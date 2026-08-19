// Vendors the self-hosted icon libraries under resources/assets/icons/ -
// bx-docs' own `icon:` frontmatter/nav-icon support (IconResolver.bx)
// reads one SVG file per icon straight off disk at build time and inlines
// it into the page, so the *installed module* carries every icon in all
// three libraries (a few thousand small SVGs, tens of MB on disk) while
// any one built *site* only ever pays for the handful it actually
// references - same approach mkdocs-material's own bundled Material/
// FontAwesome/Octicons icon sets use.
//
// Re-run this after bumping any of the three source packages below to
// refresh resources/assets/icons/ with their latest icon set:
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
		.replace(/\s+(width|height|class)="[^"]*"/g, "")
		.replace(/\s+/g, " ")
		.replace(/>\s+</g, "><")
		.replace(/\s+\/>/g, "/>")
		.replace(/\s+>/g, ">")
		.trim();
}

function vendor(label, sourceDir, destSubdir) {
	const dest = join(destRoot, destSubdir);
	mkdirSync(dest, { recursive: true });
	const files = readdirSync(sourceDir).filter((f) => f.endsWith(".svg"));
	for (const file of files) {
		writeFileSync(join(dest, file), normalize(readFileSync(join(sourceDir, file), "utf8")));
	}
	console.log(`${label}: vendored ${files.length} icons -> ${dest}`);
}

vendor("phosphor", "node_modules/@phosphor-icons/core/assets/regular", "phosphor");
vendor("lucide", "node_modules/lucide-static/icons", "lucide");
vendor("tabler", "node_modules/@tabler/icons/icons/outline", "tabler");
