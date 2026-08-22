// Vendors the self-hosted icon libraries under resources/assets/icons/ -
// bx-docs' own `icon:` frontmatter/nav-icon support (IconResolver.bx)
// reads one SVG file per icon straight off disk at build time and inlines
// it into the page, so the *installed module* carries every icon in
// every library/weight (many thousand small SVGs, tens of MB on disk)
// while any one built *site* only ever pays for the handful it actually
// references - same approach mkdocs-material's own bundled Material/
// FontAwesome/Octicons icon sets use.
//
// Phosphor ships all six of its own weights (thin/light/regular/bold/
// fill/duotone) - each vendored as its own library, e.g.
// `phosphor-thin:rocket`, with bare `phosphor:` staying an alias for
// regular.
//
// Font Awesome is deliberately not one of these: its Duotone style (and
// most of its non-brand icon set in v6+) is Pro-only, not available
// under an open license this module could freely redistribute.
//
// Re-run this after bumping any of the source packages below to refresh
// resources/assets/icons/ with their latest icon set:
//
//   npm install --no-save @phosphor-icons/core lucide-static @tabler/icons
//   node vendorIcons.mjs resources/assets/icons
//
// Each source SVG is stripped of its license-comment header and any
// author-supplied width/height/class attribute (IconResolver.bx controls
// sizing/color entirely via CSS, using each icon's own `viewBox` and
// currentColor fill/stroke), then collapsed to one line - safe to inline
// directly into a page with no further processing.

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const destRoot = process.argv[2];
if (!destRoot) {
	console.error("usage: node vendorIcons.mjs <dest-root>");
	process.exit(1);
}

function normalize(svg) {
	return svg
		.replace(/<!--[\s\S]*?-->/g, "")
		// Only the outer <svg ...> tag's own width/height/class are
		// presentational sizing IconResolver.bx's own `.bxdocs-icon` CSS
		// class replaces - stripping the same attributes wherever they
		// appear (the previous global regex here) also hit inner shape
		// elements like a calendar/archive icon's own <rect width="18"
		// height="18" .../>, where width/height are load-bearing geometry,
		// not styling - collapsing those shapes to zero size.
		.replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s+(width|height|class)="[^"]*"/g, ""))
		.replace(/\s+/g, " ")
		.replace(/>\s+</g, "><")
		.replace(/\s+\/>/g, "/>")
		.replace(/\s+>/g, ">")
		.trim();
}

// `stripSuffix` drops a per-weight filename suffix (Phosphor's own
// non-regular weights are named e.g. "rocket-duotone.svg") so an icon's
// name is the same bare slug regardless of which library/weight
// directory it lives under - IconResolver.bx never needs to know any
// library has its own filename quirk.
function vendor(label, sourceDir, destSubdir, stripSuffix = "") {
	const dest = join(destRoot, destSubdir);
	mkdirSync(dest, { recursive: true });
	const files = readdirSync(sourceDir).filter((f) => f.endsWith(".svg"));
	for (const file of files) {
		const destName = stripSuffix ? file.replace(`${stripSuffix}.svg`, ".svg") : file;
		writeFileSync(join(dest, destName), normalize(readFileSync(join(sourceDir, file), "utf8")));
	}
	console.log(`${label}: vendored ${files.length} icons -> ${dest}`);
}

vendor("phosphor", "node_modules/@phosphor-icons/core/assets/regular", "phosphor");
vendor("phosphor-thin", "node_modules/@phosphor-icons/core/assets/thin", "phosphor-thin", "-thin");
vendor("phosphor-light", "node_modules/@phosphor-icons/core/assets/light", "phosphor-light", "-light");
vendor("phosphor-bold", "node_modules/@phosphor-icons/core/assets/bold", "phosphor-bold", "-bold");
vendor("phosphor-fill", "node_modules/@phosphor-icons/core/assets/fill", "phosphor-fill", "-fill");
vendor("phosphor-duotone", "node_modules/@phosphor-icons/core/assets/duotone", "phosphor-duotone", "-duotone");
vendor("lucide", "node_modules/lucide-static/icons", "lucide");
vendor("tabler", "node_modules/@tabler/icons/icons/outline", "tabler");
