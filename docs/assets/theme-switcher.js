/**
 * Dogfooding-only widget for bx-docs' own deployed docs site: this repo's
 * `docs/` tree is built three times (see scripts/build-multi-theme.sh) -
 * once per built-in theme - and assembled into one deployment, with
 * `bootstrap` at the site root and `material`/`tailwind` living under
 * `theme/material/`/`theme/tailwind/`. This drops a variant switcher next
 * to the header's dark-mode toggle (present, with the same class, in all
 * three themes) so a visitor can jump straight to the same page in another
 * theme instead of starting over from that variant's own home page.
 *
 * Not a bx-docs feature - a project-specific `extraJs` file, wired up the
 * same way any project's own custom script would be (see the Themes guide,
 * "Customizing colors without a theme override").
 *
 * `ROOT` is a placeholder - scripts/build-multi-theme.sh substitutes it
 * with the site's real root-relative base path (e.g. "/bx-docs/" or
 * "/bx-docs/development/") before each of the three builds, since that
 * root is identical across all three variants and only known at build
 * time from bxdocs.json's own `baseURL`.
 */
( function () {
	var ROOT = "__BXDOCS_ROOT__";

	var VARIANTS = [
		{ key: "bootstrap", label: "Bootstrap (default)", prefix: "" },
		{ key: "material", label: "Material", prefix: "theme/material/" },
		{ key: "tailwind", label: "Tailwind", prefix: "theme/tailwind/" }
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

	function init() {
		// A placeholder left un-substituted (e.g. a normal `boxlang module:bxDocs
		// build` run of this same project, outside the multi-theme script) means
		// there's only one variant on this deployment - nothing to switch to.
		if ( ROOT.indexOf( "BXDOCS_ROOT" ) !== -1 ) {
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

		var select = document.createElement( "select" );
		select.className = "bxdocs-theme-variant-switcher";
		select.setAttribute( "aria-label", "Switch docs theme" );
		select.style.cssText = "margin-left:0.5rem;padding:0.3rem 0.5rem;border-radius:6px;" +
			"border:1px solid rgba(128,128,128,0.4);background:transparent;color:inherit;font-size:0.85rem;";

		VARIANTS.forEach( function ( variant ) {
			var option = document.createElement( "option" );
			option.value = variant.key;
			option.textContent = variant.label;
			option.selected = variant.key === current.variant.key;
			select.appendChild( option );
		} );

		select.addEventListener( "change", function () {
			var chosen = VARIANTS.filter( function ( v ) {
				return v.key === select.value;
			} )[ 0 ];
			window.location.href = targetUrl( chosen, current.rest );
		} );

		toggle.parentNode.insertBefore( select, toggle.nextSibling );
	}

	init();
} )();
