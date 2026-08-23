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
 */
( function () {
	function init() {
		if ( !window.SwaggerUIBundle ) {
			return;
		}

		document.querySelectorAll( ".bxsites-openapi[data-openapi-src]" ).forEach( function ( el, index ) {
			var mount = document.createElement( "div" );
			mount.id = "bxsites-openapi-mount-" + index;
			el.appendChild( mount );

			SwaggerUIBundle( {
				url: el.getAttribute( "data-openapi-src" ),
				domNode: mount,
				deepLinking: true,
				presets: [ SwaggerUIBundle.presets.apis ]
			} );
		} );
	}

	if ( document.readyState === "loading" ) {
		document.addEventListener( "DOMContentLoaded", init );
	} else {
		init();
	}
} )();
