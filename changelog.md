# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

----

## [Unreleased]

* First iteration of this module
* Added a pluggable `searchProvider` setting in `bxdocs.json` - `"local"` (bx-docs' own static/lunr search) stays the default, `"algolia"` wires up Algolia DocSearch, and any other provider name can be wired up by a project's own theme override
