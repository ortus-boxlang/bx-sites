/**
 * Mounts Swagger UI into every `::: openapi` block's own placeholder -
 * shared across all built-in themes, only loaded when bxsites.json's
 * `openapi` is true. Each `.bxsites-openapi[data-openapi-src]` element
 * gets its own independent SwaggerUIBundle instance (a page can have more
 * than one), reading the spec file DirectiveBlockProcessor.bx already
 * resolved to a root-relative URL - the same static file bx-sites' own
 * asset pipeline already copies from `docs/assets/**` verbatim, so no
 * server-side OpenAPI parsing happens anywhere in this module; Swagger UI
 * parses the JSON/YAML spec entirely client-side.
 *
 * Deliberately mounted with just `SwaggerUIBundle.presets.apis` and no
 * `layout` (Swagger UI's own default, "BaseLayout") rather than
 * `SwaggerUIStandalonePreset`/`"StandaloneLayout"` - that combination adds
 * a topbar letting a reader type in a *different* spec URL to explore,
 * which isn't vendored here on purpose: a `::: openapi` block is meant to
 * always show the one spec its author pointed it at.
 *
 * A block carrying `data-openapi-operation="METHOD /path"` (DirectiveBlockProcessor.bx's
 * `::: openapi ... operation="POST /users"`) mounts the exact same full
 * Swagger UI widget, then - once `onComplete` fires - scopeToOperation()
 * hides every other operation and auto-expands the matching one, so a
 * tutorial can drop in just one endpoint inline. This still never parses
 * the spec ourselves: it only reads Swagger UI's own already-rendered DOM
 * (`.opblock-summary-path`'s `data-path` attribute, and the stable
 * `opblock-<method>` class Swagger UI puts on each operation's container).
 */
( function () {
	function scopeToOperation( container, methodAndPath ) {
		var spaceAt = methodAndPath.indexOf( " " );
		if ( spaceAt < 0 ) {
			return;
		}
		var method = methodAndPath.slice( 0, spaceAt );
		var path = methodAndPath.slice( spaceAt + 1 );

		var matched = null;
		container.querySelectorAll( ".opblock" ).forEach( function ( block ) {
			var pathEl = block.querySelector( ".opblock-summary-path" );
			var blockPath = pathEl ? ( pathEl.getAttribute( "data-path" ) || pathEl.textContent.trim() ) : "";
			if ( !matched && block.classList.contains( "opblock-" + method ) && blockPath === path ) {
				matched = block;
			} else {
				block.style.display = "none";
			}
		} );

		if ( matched ) {
			var summary = matched.querySelector( ".opblock-summary" );
			if ( summary && !matched.classList.contains( "is-open" ) ) {
				summary.click();
			}
		}

		container.querySelectorAll( ".opblock-tag-section" ).forEach( function ( section ) {
			if ( matched && section.contains( matched ) ) {
				var header = section.querySelector( ".opblock-tag" );
				if ( header ) {
					header.style.display = "none";
				}
			} else {
				section.style.display = "none";
			}
		} );

		var info = container.querySelector( ".information-container" );
		if ( info ) {
			info.style.display = "none";
		}
	}

	function init() {
		if ( !window.SwaggerUIBundle ) {
			return;
		}

		document.querySelectorAll( ".bxsites-openapi[data-openapi-src]" ).forEach( function ( el, index ) {
			var mount = document.createElement( "div" );
			mount.id = "bxsites-openapi-mount-" + index;
			el.appendChild( mount );

			var operation = el.getAttribute( "data-openapi-operation" );

			SwaggerUIBundle( {
				url: el.getAttribute( "data-openapi-src" ),
				domNode: mount,
				deepLinking: true,
				presets: [ SwaggerUIBundle.presets.apis ],
				onComplete: operation ? function () { scopeToOperation( mount, operation ); } : undefined
			} );
		} );
	}

	if ( document.readyState === "loading" ) {
		document.addEventListener( "DOMContentLoaded", init );
	} else {
		init();
	}
} )();
