/**
 * Shared client-side search widget for bx-docs' built-in themes - fully
 * static, no server dependency, matching mkdocs' own default search
 * (lunr.js) per module spec section 7. Every theme's own search.bxm partial
 * just renders the markup (an #bxdocs-search-input + #bxdocs-search-results
 * pair); this one script wires all of them the same way against the shared
 * /search-index.json format built by SearchIndexer.bx.
 */
( function () {
	function init() {
		var input = document.getElementById( "bxdocs-search-input" );
		var results = document.getElementById( "bxdocs-search-results" );
		if ( !input || !results ) {
			return;
		}

		var docsById = {};
		var idx = null;

		fetch( "/search-index.json" )
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
					this.field( "headings", { boost : 5 } );
					this.field( "body" );

					docs.forEach( function ( doc, i ) {
						this.add( {
							id       : i,
							title    : doc.title,
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
			results.classList.remove( "bxdocs-search-open" );
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
				empty.className = "bxdocs-search-empty";
				empty.textContent = "No results found.";
				results.appendChild( empty );
				results.classList.add( "bxdocs-search-open" );
				return;
			}

			hits.slice( 0, 10 ).forEach( function ( hit ) {
				var doc = docsById[ hit.ref ];
				if ( !doc ) {
					return;
				}
				var li = document.createElement( "li" );
				var a = document.createElement( "a" );
				a.href = "/" + doc.url;
				a.textContent = doc.title;
				li.appendChild( a );
				results.appendChild( li );
			} );

			results.classList.add( "bxdocs-search-open" );
		} );

		document.addEventListener( "click", function ( evt ) {
			if ( evt.target !== input && !results.contains( evt.target ) ) {
				closeResults();
			}
		} );
	}

	if ( document.readyState === "loading" ) {
		document.addEventListener( "DOMContentLoaded", init );
	} else {
		init();
	}
} )();
