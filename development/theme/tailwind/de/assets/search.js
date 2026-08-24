/**
 * Shared client-side search widget for bx-sites' built-in themes - fully
 * static, no server dependency, matching mkdocs' own default search
 * (lunr.js) per module spec section 7. Every theme's own search.bxm partial
 * just renders the markup (an #bxsites-search-input + #bxsites-search-results
 * pair); this one script wires all of them the same way against the shared
 * search-index.json format built by SearchIndexer.bx.
 *
 * `window.__BXSITES_BASE_PATH__` (set inline by layout.bxm from
 * BaseUrlResolver's `basePath`) prefixes both the index fetch and every
 * result link, so search still works when a site is hosted from a sub-path.
 * `window.__BXSITES_SEARCH_NO_RESULTS__` (set inline by layout.bxm from
 * StringsResolver's own resolved `searchNoResults`) is this locale's own
 * "no results" text, same reasoning - a static asset shared by every theme
 * can't itself resolve per-locale strings, so the page that includes it hands
 * the already-resolved value over.
 *
 * `/` and Cmd/Ctrl+K both focus the search box from anywhere on the page;
 * a theme's `.bxsites-search-kbd` badge (if it renders one) gets its text
 * swapped to the platform-correct hint.
 */
( function () {
	function basePath() {
		return window.__BXSITES_BASE_PATH__ || "/";
	}

	function noResultsText() {
		return window.__BXSITES_SEARCH_NO_RESULTS__ || "No results found.";
	}

	function init() {
		var input = document.getElementById( "bxsites-search-input" );
		var results = document.getElementById( "bxsites-search-results" );
		if ( !input || !results ) {
			return;
		}

		var docsById = {};
		var idx = null;

		fetch( basePath() + "search-index.json" )
			.then( function ( res ) {
				return res.json();
			} )
			.then( function ( docs ) {
				docs.forEach( function ( doc, i ) {
					docsById[ i ] = doc;
				} );

				idx = lunr( function () {
					this.ref( "id" );
					this.field( "title", { boost : 10 } );
					this.field( "tags", { boost : 8 } );
					this.field( "headings", { boost : 5 } );
					this.field( "body" );

					docs.forEach( function ( doc, i ) {
						this.add( {
							id       : i,
							title    : doc.title,
							tags     : ( doc.tags || [] ).join( " " ),
							headings : ( doc.headings || [] ).join( " " ),
							body     : doc.body
						} );
					}, this );
				} );
			} )
			.catch( function () {
				// The index may legitimately be missing (search disabled for
				// this build) - fail quietly rather than breaking the page.
			} );

		function closeResults() {
			results.innerHTML = "";
			results.classList.remove( "bxsites-search-open" );
		}

		input.addEventListener( "input", function () {
			var query = input.value.trim();
			results.innerHTML = "";

			if ( !query || !idx ) {
				closeResults();
				return;
			}

			var hits = [];
			try {
				hits = idx.search( query + "*" );
			} catch ( e ) {
				hits = idx.search( query );
			}

			if ( !hits.length ) {
				var empty = document.createElement( "li" );
				empty.className = "bxsites-search-empty";
				empty.textContent = noResultsText();
				results.appendChild( empty );
				results.classList.add( "bxsites-search-open" );
				return;
			}

			hits.slice( 0, 10 ).forEach( function ( hit ) {
				var doc = docsById[ hit.ref ];
				if ( !doc ) {
					return;
				}
				var li = document.createElement( "li" );
				var a = document.createElement( "a" );
				a.href = basePath() + doc.url;
				a.textContent = doc.title;
				li.appendChild( a );
				results.appendChild( li );
			} );

			results.classList.add( "bxsites-search-open" );
		} );

		input.addEventListener( "keydown", function ( evt ) {
			if ( evt.key === "Escape" ) {
				closeResults();
				input.blur();
			}
		} );

		document.addEventListener( "click", function ( evt ) {
			if ( evt.target !== input && !results.contains( evt.target ) ) {
				closeResults();
			}
		} );

		// mkdocs-material's own convention: "/" focuses search from anywhere
		// on the page, unless the visitor is already typing somewhere else.
		document.addEventListener( "keydown", function ( evt ) {
			if ( evt.key !== "/" || evt.target === input ) {
				return;
			}
			var tag = ( evt.target.tagName || "" ).toLowerCase();
			if ( tag === "input" || tag === "textarea" || evt.target.isContentEditable ) {
				return;
			}
			evt.preventDefault();
			input.focus();
		} );

		// Cmd/Ctrl+K - the convention every other doc-search widget (Algolia
		// DocSearch, Pagefind, VitePress, Docusaurus, ...) uses; unlike "/"
		// above it's meant to work everywhere, including while typing in
		// another field, so there's no "already typing" guard here.
		document.addEventListener( "keydown", function ( evt ) {
			if ( !( evt.ctrlKey || evt.metaKey ) || evt.key.toLowerCase() !== "k" ) {
				return;
			}
			evt.preventDefault();
			input.focus();
		} );

		// Shows the platform-correct hint (⌘K on Mac, Ctrl K elsewhere) in the
		// kbd badge search.bxm renders next to the input, if the theme has one.
		var kbd = document.querySelector( ".bxsites-search-kbd" );
		if ( kbd && /Mac|iPod|iPhone|iPad/.test( window.navigator.platform || "" ) ) {
			kbd.textContent = "⌘K";
		}
	}

	if ( document.readyState === "loading" ) {
		document.addEventListener( "DOMContentLoaded", init );
	} else {
		init();
	}
} )();
