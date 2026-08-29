/**
 * Shared client-side search widget for bx-sites' built-in themes - fully
 * static, no server dependency, the same "index once at build time, search
 * in the browser" approach mkdocs uses by default, per module spec section 7.
 * Every theme's own search.bxm partial just renders the markup (an
 * #bxsites-search-input + #bxsites-search-results pair); this one script
 * wires all of them the same way against the shared search-index.json format
 * built by SearchIndexer.bx, using MiniSearch (vendored alongside this file)
 * to actually index/query it - prefix matching and typo-tolerant fuzzy
 * matching are both built into MiniSearch's own `search()` call, so unlike
 * the lunr.js widget this replaced, there's no separate wildcard-query retry
 * needed to match a partial word while typing.
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
 * `/` focuses the sidebar search box from anywhere on the page (mkdocs-material's
 * own convention); Cmd/Ctrl+K instead opens a separate command-palette-style
 * overlay (buildPalette()) - a centered modal over a backdrop, with arrow-key
 * result navigation and Enter-to-go, matching the "Quick Find"/⌘K convention
 * every other doc-search widget (Algolia DocSearch, Pagefind, VitePress,
 * Docusaurus, GitBook) uses. Its own markup is built entirely in JS and
 * appended to `document.body` - no theme template changes needed - and it
 * reuses the exact same already-built `idx` the sidebar widget itself
 * builds below, rather than fetching search-index.json twice. A
 * theme's `.bxsites-search-kbd` badge (if it renders one) gets its text
 * swapped to the platform-correct hint.
 */
( function () {
	function basePath() {
		return window.__BXSITES_BASE_PATH__ || "/";
	}

	function noResultsText() {
		return window.__BXSITES_SEARCH_NO_RESULTS__ || "No results found.";
	}

	/**
	 * Builds the Cmd/Ctrl+K command-palette overlay - a backdrop + centered
	 * panel with its own input and result list, entirely DOM-generated
	 * (no theme template changes needed) and appended to `document.body`
	 * once. Arrow Up/Down move a `--active` highlight across results,
	 * Enter navigates to the highlighted (or first) one, Escape or a
	 * backdrop click closes it.
	 *
	 * @searchFn `query => Array<{ title, url }>` - the sidebar widget's own `search()`, shared rather than re-fetching/re-indexing search-index.json a second time
	 *
	 * @return { open: () => void, close: () => void }
	 */
	function buildPalette( searchFn ) {
		var backdrop = document.createElement( "div" );
		backdrop.className = "bxsites-command-palette";
		backdrop.hidden = true;

		var panel = document.createElement( "div" );
		panel.className = "bxsites-command-palette__panel";
		backdrop.appendChild( panel );

		var input = document.createElement( "input" );
		input.type = "text";
		input.className = "bxsites-command-palette__input";
		input.setAttribute( "aria-label", "Search" );
		panel.appendChild( input );

		var list = document.createElement( "ul" );
		list.className = "bxsites-command-palette__results";
		panel.appendChild( list );

		document.body.appendChild( backdrop );

		var activeIndex = -1;

		function setActive( index ) {
			var items = list.querySelectorAll( "li" );
			items.forEach( function ( li, i ) {
				li.classList.toggle( "bxsites-command-palette__result--active", i === index );
			} );
			if ( items[ index ] ) {
				items[ index ].scrollIntoView( { block : "nearest" } );
			}
			activeIndex = index;
		}

		function render( query ) {
			list.innerHTML = "";
			activeIndex = -1;
			if ( !query ) {
				return;
			}

			var hits = searchFn( query );
			if ( !hits.length ) {
				var empty = document.createElement( "li" );
				empty.className = "bxsites-command-palette__empty";
				empty.textContent = noResultsText();
				list.appendChild( empty );
				return;
			}

			hits.forEach( function ( doc ) {
				var li = document.createElement( "li" );
				li.className = "bxsites-command-palette__result";
				var a = document.createElement( "a" );
				a.href = basePath() + doc.url;
				a.textContent = doc.title;
				li.appendChild( a );
				li.addEventListener( "mouseenter", function () {
					setActive( Array.prototype.indexOf.call( list.children, li ) );
				} );
				list.appendChild( li );
			} );

			setActive( 0 );
		}

		function open() {
			backdrop.hidden = false;
			input.value = "";
			list.innerHTML = "";
			input.focus();
		}

		function close() {
			backdrop.hidden = true;
		}

		input.addEventListener( "input", function () {
			render( input.value.trim() );
		} );

		input.addEventListener( "keydown", function ( evt ) {
			var items = list.querySelectorAll( "li.bxsites-command-palette__result" );
			if ( evt.key === "ArrowDown" ) {
				evt.preventDefault();
				if ( items.length ) {
					setActive( ( activeIndex + 1 ) % items.length );
				}
			} else if ( evt.key === "ArrowUp" ) {
				evt.preventDefault();
				if ( items.length ) {
					setActive( ( activeIndex - 1 + items.length ) % items.length );
				}
			} else if ( evt.key === "Enter" ) {
				var target = items[ activeIndex ] || items[ 0 ];
				var link = target ? target.querySelector( "a" ) : null;
				if ( link ) {
					evt.preventDefault();
					window.location.href = link.href;
				}
			} else if ( evt.key === "Escape" ) {
				close();
			}
		} );

		backdrop.addEventListener( "click", function ( evt ) {
			if ( evt.target === backdrop ) {
				close();
			}
		} );

		return { open : open, close : close };
	}

	function init() {
		var input = document.getElementById( "bxsites-search-input" );
		var results = document.getElementById( "bxsites-search-results" );
		if ( !input || !results ) {
			return;
		}

		var idx = null;

		fetch( basePath() + "search-index.json" )
			.then( function ( res ) {
				return res.json();
			} )
			.then( function ( docs ) {
				idx = new MiniSearch( {
					fields      : [ "title", "tags", "headings", "body" ],
					storeFields : [ "title", "url" ],
					searchOptions : {
						boost  : { title : 10, tags : 8, headings : 5 },
						prefix : true,
						fuzzy  : 0.2
					}
				} );

				idx.addAll( docs.map( function ( doc, i ) {
					return {
						id       : i,
						title    : doc.title,
						url      : doc.url,
						tags     : ( doc.tags || [] ).join( " " ),
						headings : ( doc.headings || [] ).join( " " ),
						body     : doc.body
					};
				} ) );
			} )
			.catch( function () {
				// The index may legitimately be missing (search disabled for
				// this build) - fail quietly rather than breaking the page.
			} );

		// Shared by the sidebar widget below and buildPalette()'s own query
		// handler - looks up against whatever `idx` the fetch above finished
		// building (stays null, so this just returns no hits, until it does).
		// MiniSearch's own `prefix`/`fuzzy` search options (set above) already
		// cover partial words while typing and simple typos in one call - no
		// separate wildcard-query retry needed, unlike the lunr.js widget
		// this replaced.
		function search( query ) {
			if ( !query || !idx ) {
				return [];
			}
			var hits = [];
			try {
				hits = idx.search( query );
			} catch ( e ) {
				hits = [];
			}
			return hits.slice( 0, 10 ).map( function ( hit ) {
				return { title : hit.title, url : hit.url };
			} );
		}

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

			var hits = search( query );

			if ( !hits.length ) {
				var empty = document.createElement( "li" );
				empty.className = "bxsites-search-empty";
				empty.textContent = noResultsText();
				results.appendChild( empty );
				results.classList.add( "bxsites-search-open" );
				return;
			}

			hits.forEach( function ( doc ) {
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

		var palette = buildPalette( function ( query ) {
			return search( query );
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
			palette.open();
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
