#!/bin/bash

# Generates this module's API documentation with DocBox (bx-docbox),
# one source mapping per top-level BoxLang source folder. Used by
# .github/workflows/docbox.yml, which then syncs OUTPUT_DIR to S3 - run
# it locally the same way to preview the generated site before pushing.
#
# Requires: `boxlang module:docbox` on the PATH, i.e. bx-docbox installed
# (see .github/workflows/docbox.yml's `modules: bx-docbox` setup step, or
# locally: `install-bx-module bx-docbox`).

set -e

OUTPUT_DIR="./apidocs"
PROJECT_TITLE="BX Docs API"

rm -rf "${OUTPUT_DIR}"
mkdir -p "${OUTPUT_DIR}"

boxlang module:docbox \
	--mappings:models=./models \
	--mappings:bifs=./bifs \
	--mappings:components=./components \
	--mappings:interceptors=./interceptors \
	--output-dir="${OUTPUT_DIR}" \
	--project-title="${PROJECT_TITLE}"
