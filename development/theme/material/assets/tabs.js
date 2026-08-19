/**
 * Click-to-switch behavior for content tab groups (`=== "Title"` markdown
 * syntax, see TabsProcessor.bx), shared across all built-in themes. Each
 * group is fully self-contained - clicking a button only ever changes
 * state within its own `.bxdocs-tabs` ancestor.
 */
( function () {
	function activate( group, index ) {
		group.querySelectorAll( ":scope > .bxdocs-tabs__nav > .bxdocs-tab-btn" ).forEach( function ( btn ) {
			btn.classList.toggle( "bxdocs-tab-btn--active", btn.getAttribute( "data-bxdocs-tab" ) === index );
		} );
		group.querySelectorAll( ":scope > .bxdocs-tabs__panels > .bxdocs-tab-panel" ).forEach( function ( panel ) {
			panel.classList.toggle( "bxdocs-tab-panel--active", panel.getAttribute( "data-bxdocs-tab" ) === index );
		} );
	}

	function init() {
		document.querySelectorAll( ".bxdocs-tabs" ).forEach( function ( group ) {
			group.querySelectorAll( ".bxdocs-tab-btn" ).forEach( function ( btn ) {
				btn.addEventListener( "click", function () {
					activate( group, btn.getAttribute( "data-bxdocs-tab" ) );
				} );
			} );
		} );
	}

	if ( document.readyState === "loading" ) {
		document.addEventListener( "DOMContentLoaded", init );
	} else {
		init();
	}
} )();
