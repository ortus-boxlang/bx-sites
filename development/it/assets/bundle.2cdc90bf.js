/**
 * Dogfooding-only widget for bx-sites' own deployed docs site: this repo's
 * `docs/` tree is built three times (see scripts/build-multi-theme.sh) -
 * once per built-in theme - and assembled into one deployment, with
 * `bootstrap` at the site root and `material`/`tailwind` living under
 * `theme/material/`/`theme/tailwind/`. This drops a variant switcher next
 * to the header's dark-mode toggle (present, with the same class, in all
 * three themes) so a visitor can jump straight to the same page in another
 * theme instead of starting over from that variant's own home page.
 *
 * Not a bx-sites feature - a project-specific `extraJs` file, wired up the
 * same way any project's own custom script would be (see the Themes guide,
 * "Customizing colors without a theme override"). Rendered as an icon
 * trigger + dropdown menu (reusing `.theme-toggle`'s own square button
 * sizing, so it sits flush with the rest of the icon row) rather than a
 * plain `<select>`, matching the header's own icon-first language - the
 * same GitBook-style pattern the built-in locale switcher uses. Since this
 * file has no access to the module's own theme stylesheets (it's
 * project-only), its dropdown menu styling is self-contained: a small
 * `<style>` tag injected once, keyed off the same `data-theme` attribute
 * every built-in theme already sets on `<html>` for dark mode.
 *
 * `ROOT` is a placeholder - scripts/build-multi-theme.sh substitutes it
 * with the site's real root-relative base path (e.g. "/bx-sites/" or
 * "/bx-sites/development/") before each of the three builds, since that
 * root is identical across all three variants and only known at build
 * time from bxsites.json's own `baseURL`.
 */
( function () {
	var ROOT = "/bx-sites/development/";

	var VARIANTS = [
		{ key: "bootstrap", label: "Bootstrap", prefix: "", dot: "#7952b3" },
		{ key: "material", label: "Material", prefix: "theme/material/", dot: "#00dbff" },
		{ key: "tailwind", label: "Tailwind", prefix: "theme/tailwind/", dot: "#38bdf8" }
	];

	function currentVariant() {
		var path = window.location.pathname;
		if ( path.indexOf( ROOT ) !== 0 ) {
			return null;
		}
		var rest = path.slice( ROOT.length );
		for ( var i = 1; i < VARIANTS.length; i++ ) {
			if ( rest.indexOf( VARIANTS[ i ].prefix ) === 0 ) {
				return { variant: VARIANTS[ i ], rest: rest.slice( VARIANTS[ i ].prefix.length ) };
			}
		}
		return { variant: VARIANTS[ 0 ], rest: rest };
	}

	function targetUrl( variant, rest ) {
		return ROOT + variant.prefix + rest + window.location.search + window.location.hash;
	}

	function injectStyle() {
		if ( document.getElementById( "bxsites-variant-switcher-style" ) ) {
			return;
		}
		var style = document.createElement( "style" );
		style.id = "bxsites-variant-switcher-style";
		style.textContent =
			".bxsites-variant-switcher{position:relative;display:inline-flex;}" +
			".bxsites-variant-menu{position:absolute;top:calc(100% + 0.35rem);right:0;z-index:1000;" +
				"min-width:11rem;margin:0;padding:0.35rem;list-style:none;border-radius:8px;" +
				"background:#ffffff;color:#212529;border:1px solid rgba(0,0,0,0.15);" +
				"box-shadow:0 8px 24px rgba(0,0,0,0.18);}" +
			"html[data-theme=\"dark\"] .bxsites-variant-menu{background:#1b2027;color:#e6edf3;" +
				"border-color:rgba(255,255,255,0.15);}" +
			".bxsites-variant-item{display:flex;align-items:center;gap:0.5rem;width:100%;" +
				"padding:0.4rem 0.6rem;border:0;border-radius:6px;background:transparent;" +
				"color:inherit;font-size:0.85rem;text-align:left;cursor:pointer;}" +
			".bxsites-variant-item:hover{background:rgba(128,128,128,0.15);}" +
			".bxsites-variant-item[aria-current=\"true\"]{font-weight:600;}" +
			".bxsites-variant-dot{width:0.6rem;height:0.6rem;border-radius:50%;flex:0 0 auto;}";
		document.head.appendChild( style );
	}

	function init() {
		// A placeholder left un-substituted (e.g. a normal `boxlang bxSites
		// build` run of this same project, outside the multi-theme script) means
		// there's only one variant on this deployment - nothing to switch to.
		if ( ROOT.indexOf( "BXSITES_ROOT" ) !== -1 ) {
			return;
		}

		var current = currentVariant();
		if ( !current ) {
			return;
		}

		var toggle = document.querySelector( ".theme-toggle" );
		if ( !toggle || !toggle.parentNode ) {
			return;
		}

		injectStyle();

		var wrapper = document.createElement( "div" );
		wrapper.className = "bxsites-variant-switcher";

		var trigger = document.createElement( "button" );
		trigger.type = "button";
		trigger.className = "theme-toggle";
		trigger.setAttribute( "aria-haspopup", "true" );
		trigger.setAttribute( "aria-expanded", "false" );
		trigger.setAttribute( "aria-label", "Switch docs theme (current: " + current.variant.label + ")" );
		// Phosphor's "palette" icon (resources/assets/icons/phosphor/palette.svg,
		// this project's own vendored icon set) inlined here since this widget
		// has no access to that server-side icon lookup at render time - sized
		// and colored (currentColor) to match the monochrome moon/GitHub icons
		// already sitting in this same row, not an emoji like the old version.
		trigger.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M200.77,53.89A103.27,103.27,0,0,0,128,24h-1.07A104,104,0,0,0,24,128c0,43,26.58,79.06,69.36,94.17A32,32,0,0,0,136,192a16,16,0,0,1,16-16h46.21a31.81,31.81,0,0,0,31.2-24.88,104.43,104.43,0,0,0,2.59-24A103.28,103.28,0,0,0,200.77,53.89Zm13,93.71A15.89,15.89,0,0,1,198.21,160H152a32,32,0,0,0-32,32,16,16,0,0,1-21.31,15.07C62.49,194.3,40,164,40,128a88,88,0,0,1,87.09-88h.9a88.35,88.35,0,0,1,88,87.25A88.86,88.86,0,0,1,213.81,147.6ZM140,76a12,12,0,1,1-12-12A12,12,0,0,1,140,76ZM96,100A12,12,0,1,1,84,88,12,12,0,0,1,96,100Zm0,56a12,12,0,1,1-12-12A12,12,0,0,1,96,156Zm88-56a12,12,0,1,1-12-12A12,12,0,0,1,184,100Z"/></svg>';

		var menu = document.createElement( "ul" );
		menu.className = "bxsites-variant-menu";
		menu.setAttribute( "role", "menu" );
		menu.hidden = true;

		VARIANTS.forEach( function ( variant ) {
			var li = document.createElement( "li" );
			li.setAttribute( "role", "none" );

			var item = document.createElement( "button" );
			item.type = "button";
			item.className = "bxsites-variant-item";
			item.setAttribute( "role", "menuitem" );
			if ( variant.key === current.variant.key ) {
				item.setAttribute( "aria-current", "true" );
			}

			var dot = document.createElement( "span" );
			dot.className = "bxsites-variant-dot";
			dot.style.background = variant.dot;
			dot.setAttribute( "aria-hidden", "true" );

			item.appendChild( dot );
			item.appendChild( document.createTextNode( variant.label + ( variant.key === "bootstrap" ? " (default)" : "" ) ) );

			item.addEventListener( "click", function () {
				window.location.href = targetUrl( variant, current.rest );
			} );

			li.appendChild( item );
			menu.appendChild( li );
		} );

		function closeMenu() {
			menu.hidden = true;
			trigger.setAttribute( "aria-expanded", "false" );
		}

		trigger.addEventListener( "click", function ( event ) {
			event.stopPropagation();
			var open = !menu.hidden;
			menu.hidden = open;
			trigger.setAttribute( "aria-expanded", open ? "false" : "true" );
		} );

		document.addEventListener( "click", function ( event ) {
			if ( !wrapper.contains( event.target ) ) {
				closeMenu();
			}
		} );

		document.addEventListener( "keydown", function ( event ) {
			if ( event.key === "Escape" ) {
				closeMenu();
			}
		} );

		wrapper.appendChild( trigger );
		wrapper.appendChild( menu );
		toggle.parentNode.insertBefore( wrapper, toggle.nextSibling );
	}

	init();
} )();
;