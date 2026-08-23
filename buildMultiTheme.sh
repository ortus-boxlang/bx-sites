#!/usr/bin/env bash
#
# Dogfooding-only build script for this repo's own docs site: builds
# docs/ once per built-in theme (10, as of the theme gallery expansion)
# and assembles the results into a single site/ tree, so the deployed
# site shows off `bootstrap` at the root plus every other built-in theme
# living side by side under theme/<name>/ - this repo's own docs double
# as the theme gallery. Not a bx-sites product feature - just this
# project using its own `build` verb, the same way pages.yml already
# patches baseURL per branch.
#
# The 10 builds run CONCURRENTLY (capped at BXSITES_BUILD_JOBS, default
# nproc) rather than one at a time - going from 3 themes to 10 made the
# old fully-sequential version too slow. Each variant builds in its own
# throwaway `git worktree` rather than all ten fighting over the same
# bxsites.yaml/site/ - `git worktree add --detach` (the same technique
# GhPagesDeployer.bx already uses for its own throwaway gh-deploy
# checkout) gives every variant a real, independent working directory
# that still shares the main repo's object database, so `git log`
# (bxsites.yaml's `lastUpdated` option, resolved per file by
# GitRevisionDate.bx) keeps resolving file history correctly - a plain
# directory copy, or a docs/ symlink with no real .git context behind
# it, would silently break that instead. Each worktree's own
# checked-out docs/ (frozen at HEAD) is immediately swapped for a live
# symlink back to the real docs/ working tree, so uncommitted local
# edits still show up in the preview build the same way they did when
# every build ran in place, one at a time.
#
# Usage: ./buildMultiTheme.sh [projectRoot]   (defaults to ".")
# Env:   BXSITES_BUILD_JOBS - max concurrent theme builds (default: nproc)
#
# Requires: boxlang (with this module registered so `bxSites`
# resolves), yq (mikefarah/yq - https://github.com/mikefarah/yq), and a
# git checkout (uses `git worktree`, so this must run inside a real .git
# repository, not e.g. a downloaded zip of the source).

set -euo pipefail

PROJECT_ROOT="${1:-.}"
cd "${PROJECT_ROOT}"
PROJECT_ROOT="$(pwd)"

if [[ ! -f "bxsites.yaml" ]]; then
	echo "error: no bxsites.yaml in $(pwd) - run from (or pass) the bx-sites project root" >&2
	exit 1
fi

THEMES=(bootstrap material tailwind docsy slate docusaurus justthedocs vuepress gitbook notion)
MAX_JOBS="${BXSITES_BUILD_JOBS:-$(nproc 2>/dev/null || echo 4)}"

SWITCHER_BACKUP="$(mktemp)"
SCRATCH_DIR="$(mktemp -d)"
LOG_DIR="${SCRATCH_DIR}/logs"
SWITCHER_JS="docs/assets/theme-switcher.js"

mkdir -p "${LOG_DIR}"
cp "${SWITCHER_JS}" "${SWITCHER_BACKUP}"

cleanup() {
	cp "${SWITCHER_BACKUP}" "${SWITCHER_JS}" 2>/dev/null || true
	rm -f "${SWITCHER_BACKUP}"
	for name in "${THEMES[@]}"; do
		wt="${SCRATCH_DIR}/build/${name}"
		if [[ -d "${wt}" ]]; then
			git worktree remove --force "${wt}" >/dev/null 2>&1 || true
		fi
	done
	rm -rf "${SCRATCH_DIR}"
}
trap cleanup EXIT

# Same basePath derivation as BaseUrlResolver.bx: strip scheme+host off a
# full URL, otherwise use the value as-is (ensuring leading/trailing "/").
BASE_URL="$(yq -r '.baseURL // "/"' bxsites.yaml)"
if [[ "${BASE_URL}" =~ ^https?:// ]]; then
	ROOT_PATH="$(echo "${BASE_URL}" | sed -E 's#^https?://[^/]+##')"
	[[ -z "${ROOT_PATH}" ]] && ROOT_PATH="/"
else
	ROOT_PATH="${BASE_URL}"
	[[ "${ROOT_PATH}" != /* ]] && ROOT_PATH="/${ROOT_PATH}"
	[[ "${ROOT_PATH}" != */ ]] && ROOT_PATH="${ROOT_PATH}/"
fi
# baseURL always ends in "/" already (BaseUrlResolver enforces it) - for
# appending "theme/<name>/" we need it *without* a trailing slash instead.
BASE_URL_NO_SLASH="${BASE_URL%/}"

echo "Multi-theme build - site root: ${ROOT_PATH} - up to ${MAX_JOBS} theme(s) at once"

# theme-switcher.js is identical across every build (ROOT_PATH is the
# site's true root, not any one variant's own sub-path), so substitute it
# once, before any of the ten builds run.
sed -i "s#__BXSITES_ROOT__#${ROOT_PATH}#g" "${SWITCHER_JS}"

# Builds one theme variant in its own git worktree, writing progress/errors
# to its own log file rather than interleaving with the other concurrent
# builds' own output.
build_variant() {
	local name="$1"
	local variantRoot="${SCRATCH_DIR}/build/${name}"
	local log="${LOG_DIR}/${name}.log"

	{
		git worktree add --quiet --detach "${variantRoot}" HEAD

		# The worktree's own checked-out docs/ is frozen at HEAD - swap it
		# for a live symlink back to the real working tree so uncommitted
		# local edits still show up, the same as every other variant
		# reading the one real docs/ did when these builds ran in place.
		# (Doesn't confuse `git log` above - history lookups walk the
		# object database by path string, not the working tree's actual
		# file contents.)
		rm -rf "${variantRoot}/docs"
		ln -s "${PROJECT_ROOT}/docs" "${variantRoot}/docs"

		if [[ "${name}" != "bootstrap" ]]; then
			THEME="${name}" URL="${BASE_URL_NO_SLASH}/theme/${name}/" \
				yq eval -i '.theme.name = strenv(THEME) | .baseURL = strenv(URL)' "${variantRoot}/bxsites.yaml"
		fi

		boxlang bxSites build --projectRoot="${variantRoot}"

		if [[ ! -d "${variantRoot}/site" ]]; then
			echo "error: build for [${name}] produced no site/ directory" >&2
			exit 1
		fi
	} > "${log}" 2>&1

	echo "==> Built [${name}]"
}

pids=()
running=0
for name in "${THEMES[@]}"; do
	build_variant "${name}" &
	pids+=("$!")
	running=$(( running + 1 ))

	if [[ "${running}" -ge "${MAX_JOBS}" ]]; then
		wait -n || true
		running=$(( running - 1 ))
	fi
done

# Indices of `pids`/`THEMES` line up (both built by the same loop above),
# so each wait can be attributed back to the theme name it belongs to -
# only that variant's own log gets dumped on failure, not all ten.
fail_names=()
for i in "${!pids[@]}"; do
	wait "${pids[$i]}" || fail_names+=("${THEMES[$i]}")
done

if [[ "${#fail_names[@]}" -gt 0 ]]; then
	echo "" >&2
	echo "error: theme build(s) failed: ${fail_names[*]}" >&2
	for name in "${fail_names[@]}"; do
		echo "--- ${name} (${LOG_DIR}/${name}.log) ---" >&2
		cat "${LOG_DIR}/${name}.log" >&2
	done
	exit 1
fi

rm -rf site
mkdir -p site/theme
mv "${SCRATCH_DIR}/build/bootstrap/site"/* site/
for name in "${THEMES[@]}"; do
	[[ "${name}" == "bootstrap" ]] && continue
	mv "${SCRATCH_DIR}/build/${name}/site" "site/theme/${name}"
done

echo "Done - bootstrap at site/, every other theme at site/theme/<name>/"
