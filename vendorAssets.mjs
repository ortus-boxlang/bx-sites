// Vendors the third-party CSS/JS every built-in theme needs under
// resources/assets/vendor/ - BuildPipeline.bx's copyAssets() copies these
// into every built site's own assets/vendor/, and each built-in theme's
// layout.bxm references them by local path instead of a CDN URL, so a
// generated site works with zero outbound network requests by default
// (air-gapped/offline-friendly, module spec section 8).
//
// Only libraries that are (a) a single self-contained static file/pair of
// files, no further sub-resources of their own, and (b) either always
// loaded (Bootstrap, highlight.js, Alpine.js) or gated behind a project's
// own opt-in (lunr.js behind the `local` search provider, Mermaid behind
// `bxsites.json`'s `mermaid`, Swagger UI behind `bxsites.json`'s `openapi`)
// are vendored this way. Mermaid's own UMD bundle (mermaid.min.js) is
// otherwise self-contained - its one dynamic import, `elk-api.js` (an
// alternate layout engine used by a handful of diagram types), isn't
// vendored and still resolves against jsDelivr, the one remaining CDN
// dependency for a project using Mermaid. KaTeX (ships its own font files
// as separate resources), the Tailwind theme's CDN JIT compiler, Google
// Analytics' gtag.js, and Algolia DocSearch (inherently talks to
// Algolia's own hosted API) stay CDN-loaded - see MODULE_SPEC.md section 8
// for the reasoning on each. Swagger UI's own `swagger-ui-standalone-preset.js`
// (the topbar "Explore" URL-switcher chrome) is deliberately NOT vendored -
// `openapi-init.js` mounts with just `SwaggerUIBundle.presets.apis` and
// `layout: "BaseLayout"` (the standard embedded-widget recipe, the same
// default `swagger-ui-react` itself uses), since a `::: openapi` block is
// meant to always show its own authored spec, never let a reader type in a
// different one.
//
// Re-run this after bumping any pinned version below (keep it in sync
// with the version each theme's own layout.bxm expects) to refresh
// resources/assets/vendor/:
//
//   npm install --no-save bootstrap@5.3.3 @highlightjs/cdn-assets@11.10.0 alpinejs@3.14.1 lunr@2.3.9 mermaid@10.9.1 swagger-ui-dist@5.32.14
//   node vendorAssets.mjs resources/assets/vendor

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const destRoot = process.argv[2];
if (!destRoot) {
	console.error("usage: node vendorAssets.mjs <dest-root>");
	process.exit(1);
}

function vendor(label, destSubdir, files) {
	const dest = join(destRoot, destSubdir);
	mkdirSync(dest, { recursive: true });
	let copied = 0;
	for (const [source, destName] of files) {
		if (!existsSync(source)) {
			// Optional files (e.g. a .map with no source) are skipped, not fatal.
			continue;
		}
		copyFileSync(source, join(dest, destName ?? source.split("/").pop()));
		copied++;
	}
	console.log(`${label}: vendored ${copied} file(s) -> ${dest}`);
}

vendor("bootstrap", "bootstrap", [
	["node_modules/bootstrap/dist/css/bootstrap.min.css"],
	["node_modules/bootstrap/dist/css/bootstrap.min.css.map"],
	["node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"],
	["node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map"],
]);

vendor("highlight.js", "highlight", [
	["node_modules/@highlightjs/cdn-assets/highlight.min.js"],
	["node_modules/@highlightjs/cdn-assets/styles/github.min.css"],
]);

vendor("alpine.js", "alpine", [["node_modules/alpinejs/dist/cdn.min.js"]]);

vendor("lunr", "lunr", [["node_modules/lunr/lunr.min.js"]]);

vendor("mermaid", "mermaid", [["node_modules/mermaid/dist/mermaid.min.js"]]);

vendor("swagger-ui", "swagger-ui", [
	["node_modules/swagger-ui-dist/swagger-ui-bundle.js"],
	["node_modules/swagger-ui-dist/swagger-ui.css"],
]);
