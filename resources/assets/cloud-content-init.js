/**
 * Wires up `::: cloud slug="..."` blocks (DirectiveBlockProcessor.bx's own
 * `renderCloud()`) - only shipped when a project sets
 * `cloud.contentBlocks: true` in bxsites.yaml (BuildPipeline.bx's own
 * `copyAssetsFresh()`, the same explicit-opt-in-only convention
 * mermaid-init.js/openapi-init.js already use).
 *
 * Every `[data-cloud-slug]` element already has real, sanitized HTML baked
 * in from build time (`renderCloud()`'s own docblock - instant paint, no-JS
 * readable, real SEO text) - this script's only job is to check whether a
 * fresher version exists and swap it in live, never to make the block work
 * in the first place. A `data-cloud-slug` element with no `data-cloud-version`
 * at all (`renderCloud()`'s own "skip" placeholder, when the build-time
 * fetch itself failed) is instead a hard requirement: it renders nothing
 * until this succeeds at least once.
 *
 * Fetches `/api/content/{slug}` - same-origin, proxied by
 * bx-sites-edge-router straight through to bxSites Cloud's own public
 * delivery API (ContentApi.bx) - no token/auth of any kind belongs on this
 * side; the edge router stamps its own shared-secret header on the way
 * through. That endpoint's own `html` field is already sanitized
 * server-side (ContentRenderService.bx/ContentSanitizer.bx), so it's used
 * via `innerHTML` directly with no client-side sanitization step here.
 *
 * A 404/network failure (block deleted, unpublished, offline, ...) simply
 * leaves whatever was already on the page alone - the baked-in build-time
 * HTML for a normal block, or nothing at all for a "skip" placeholder -
 * never clears real content just because a live refresh failed.
 */
( function () {
	function slugToPath( slug ) {
		return slug
			.split( "/" )
			.map( function ( segment ) {
				return encodeURIComponent( segment );
			} )
			.join( "/" );
	}

	function refresh( el ) {
		var slug = el.getAttribute( "data-cloud-slug" ) || "";
		if ( !slug ) {
			return;
		}
		var bakedVersion = el.getAttribute( "data-cloud-version" );

		fetch( "/api/content/" + slugToPath( slug ) )
			.then( function ( response ) {
				return response.ok ? response.json() : null;
			} )
			.then( function ( data ) {
				if ( !data || typeof data.html !== "string" ) {
					return;
				}
				var liveVersion = String( data.version );
				if ( bakedVersion !== null && bakedVersion === liveVersion ) {
					return;
				}
				el.innerHTML = data.html;
				el.setAttribute( "data-cloud-version", liveVersion );
			} )
			.catch( function () {
				// Network/offline/DNS failure - leave the page as it is.
			} );
	}

	function init() {
		document.querySelectorAll( "[data-cloud-slug]" ).forEach( function ( el ) {
			if ( el.dataset.bxsitesInit ) {
				return;
			}
			el.dataset.bxsitesInit = "true";
			refresh( el );
		} );
	}

	if ( document.readyState === "loading" ) {
		document.addEventListener( "DOMContentLoaded", init );
	} else {
		init();
	}
} )();
