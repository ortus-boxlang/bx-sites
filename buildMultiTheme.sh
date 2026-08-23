#!/usr/bin/env bash
#
# Dogfooding-only build script for this repo's own docs site: builds
# docs/ three times - once per built-in theme - and assembles the results
# into a single site/ tree, so the deployed site shows off `bootstrap` at
# the root plus `material`/`tailwind` living side by side under
# theme/material/ and theme/tailwind/. Not a bx-sites product feature -
# just this project using its own `build` verb three times with a
# temporarily-patched bxsites.yaml, the same way pages.yml already patches
# baseURL per branch.
#
# Usage: ./buildMultiTheme.sh [projectRoot]   (defaults to ".")
#
# Requires: boxlang (with this module registered so `bxSites`
# resolves), yq (mikefarah/yq - https://github.com/mikefarah/yq).

set -euo pipefail

PROJECT_ROOT="${1:-.}"
cd "${PROJECT_ROOT}"

if [[ ! -f "bxsites.yaml" ]]; then
	echo "error: no bxsites.yaml in $(pwd) - run from (or pass) the bx-sites project root" >&2
	exit 1
fi

CONFIG_BACKUP="$(mktemp)"
SWITCHER_BACKUP="$(mktemp)"
SCRATCH_DIR="$(mktemp -d)"
SWITCHER_JS="docs/assets/theme-switcher.js"

cp bxsites.yaml "${CONFIG_BACKUP}"
cp "${SWITCHER_JS}" "${SWITCHER_BACKUP}"

cleanup() {
	cp "${CONFIG_BACKUP}" bxsites.yaml
	cp "${SWITCHER_BACKUP}" "${SWITCHER_JS}"
	rm -f "${CONFIG_BACKUP}" "${SWITCHER_BACKUP}"
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

echo "Multi-theme build - site root: ${ROOT_PATH}"

# theme-switcher.js is identical across all three builds (ROOT_PATH is the
# site's true root, not any one variant's own sub-path), so substitute it
# once, before any of the three builds run.
sed -i "s#__BXSITES_ROOT__#${ROOT_PATH}#g" "${SWITCHER_JS}"

build_variant() {
	local name="$1"
	echo "==> Building [${name}]"
	rm -rf site
	boxlang bxSites build
	if [[ ! -d site ]]; then
		echo "error: build for [${name}] produced no site/ directory" >&2
		exit 1
	fi
	if [[ "${name}" == "bootstrap" ]]; then
		mv site "${SCRATCH_DIR}/root"
	else
		mkdir -p "${SCRATCH_DIR}/root/theme"
		mv site "${SCRATCH_DIR}/root/theme/${name}"
	fi
}

# 1. bootstrap - the committed bxsites.yaml, unmodified, at the site root.
build_variant "bootstrap"

# 2 & 3. material/tailwind - same docs/, different theme + a baseURL
# pointing at their own sub-path so their own internal links/assets
# resolve correctly once nested under theme/<name>/.
for name in material tailwind; do
	export THEME="${name}"
	export URL="${BASE_URL_NO_SLASH}/theme/${name}/"
	yq eval '.theme.name = strenv(THEME) | .baseURL = strenv(URL)' "${CONFIG_BACKUP}" > bxsites.yaml
	unset THEME URL
	build_variant "${name}"
done

rm -rf site
mv "${SCRATCH_DIR}/root" site

echo "Done - bootstrap at site/, material at site/theme/material/, tailwind at site/theme/tailwind/"
