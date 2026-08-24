#!/usr/bin/env bash
#
# LOCAL PREVIEW ONLY - not used by CI. `pages.yml`'s own "Publish Docs"
# deploy builds the ten-theme gallery as ten separate GitHub Actions
# matrix jobs instead (real OS-level parallelism, one runner per theme,
# no shared disk/working tree to juggle) - see that workflow's own
# top-of-file comment. This script exists purely so a contributor can
# reproduce the same "bootstrap at the root, every other theme under
# theme/<name>/" gallery layout locally, in one `./buildMultiTheme.sh`
# call, without needing to push and wait on ten CI jobs just to preview
# a docs change against every built-in theme at once.
#
# Builds docs/ once per built-in theme (10, as of the theme gallery
# expansion) and assembles the results into a single site/ tree. Not a
# bx-sites product feature - just this project using its own `build`
# verb, once per theme.
#
# The 10 builds run CONCURRENTLY (capped at BXSITES_BUILD_JOBS, default
# nproc) rather than one at a time - going from 3 themes to 10 made the
# old fully-sequential version too slow for a quick local preview loop.
# Each variant builds in its own throwaway `git worktree` rather than
# all ten fighting over the same bxsites.yaml/site/ (or worse, over the
# one real working tree a contributor is actively editing) -
# `git worktree add --detach` (the same technique GhPagesDeployer.bx
# already uses for its own throwaway gh-deploy checkout) gives every
# variant a real, independent working directory that still shares the
# main repo's object database, so `git log` (bxsites.yaml's
# `lastUpdated` option, resolved per file by GitRevisionDate.bx) keeps
# resolving file history correctly - a plain directory copy, or a
# docs/ symlink with no real .git context behind it, would silently
# break that instead. Each worktree's own checked-out docs/ (frozen at
# HEAD) is immediately swapped for a live symlink back to the real
# docs/ working tree, so uncommitted local edits still show up in the
# preview build the same way they did when every build ran in place,
# one at a time.
#
# Each variant moves its own site/ output into its final destination
# (site/ for bootstrap, site/theme/<name>/ for everything else) and
# removes its own worktree the moment ITS OWN build finishes, rather
# than every worktree + site output sitting on disk until all ten are
# done and one big pass moves/removes them at the very end - keeps
# peak disk usage capped at BXSITES_BUILD_JOBS variants' worth instead
# of all ten, and means a build that quietly writes nothing (still
# exiting 0 - see ModuleConfig.bx's own top-level try/catch) fails
# loudly, attributed to that one theme's own name/log, rather than
# surfacing later as an unattributed error.
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

# Each variant already removes its own worktree the moment it finishes
# successfully (see build_variant() below) - this is only a catch-all for
# one that failed or got interrupted partway through (set -e stops that
# variant's own { } block before it reaches its own worktree removal),
# so nothing borrowed from `git worktree add` is ever left behind.
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

# Created up front, not by the first variant to finish - bootstrap's own
# move (below) merges into an already-existing site/, and every other
# variant's move target is a fresh site/theme/<name>/ under an
# already-existing site/theme/.
rm -rf site
mkdir -p site/theme

# Builds one theme variant in its own git worktree, moves its own output
# straight into its final destination, and removes its own worktree -
# all before returning - writing progress/errors to its own log file
# rather than interleaving with the other concurrent builds' own output.
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

		# The worktree's own checked-out bxsites.yaml is whatever's
		# actually committed - never pages.yml's own throwaway,
		# uncommitted per-branch patch (baseURL/repo.editUri pointed at
		# this branch's own sub-path) done to PROJECT_ROOT's copy just
		# before this script runs, since `git worktree add` only ever
		# sees committed state. Copying PROJECT_ROOT's own copy over
		# first - the same one this script's own BASE_URL/ROOT_PATH
		# were themselves derived from, above - means every variant,
		# bootstrap included, starts from the config this build was
		# actually asked for rather than silently falling back to
		# whatever's plain-committed (main's own root baseURL).
		cp "${PROJECT_ROOT}/bxsites.yaml" "${variantRoot}/bxsites.yaml"

		if [[ "${name}" != "bootstrap" ]]; then
			THEME="${name}" URL="${BASE_URL_NO_SLASH}/theme/${name}/" \
				yq eval -i '.theme.name = strenv(THEME) | .baseURL = strenv(URL)' "${variantRoot}/bxsites.yaml"
		fi

		boxlang bxSites build --projectRoot="${variantRoot}"

		# Not just `-d` - an existing but empty site/ (a build that quietly
		# wrote nothing, e.g. because it ran out of disk mid-write without
		# that surfacing as a nonzero exit) must fail loudly here, tied to
		# this variant's own name/log, rather than as a cryptic glob-not-
		# matched error somewhere else once every variant's own "Built" has
		# already printed.
		if [[ ! -d "${variantRoot}/site" ]] || [[ -z "$(ls -A "${variantRoot}/site" 2>/dev/null)" ]]; then
			echo "error: build for [${name}] produced no site/ output" >&2
			exit 1
		fi

		if [[ "${name}" == "bootstrap" ]]; then
			mv "${variantRoot}/site"/* "${PROJECT_ROOT}/site/"
		else
			mv "${variantRoot}/site" "${PROJECT_ROOT}/site/theme/${name}"
		fi

		git worktree remove --force "${variantRoot}"
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

echo "Done - bootstrap at site/, every other theme at site/theme/<name>/"
