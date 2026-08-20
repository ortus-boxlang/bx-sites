/**
 * Wires up the sidebar nav's `.nav-toggle` buttons (module spec section 5,
 * step 4) - the server already renders each collapsible section's initial
 * open/closed state (via `hidden` on its child `<ul>` and `aria-expanded`
 * on the button, from the current page's own active branch), so this only
 * has to flip both on click. Shared across all built-in themes, loaded
 * unconditionally alongside admonition-collapse.js - a no-op page with no
 * `theme.options.navCollapsible` simply has no `.nav-toggle` buttons to find.
 */
( function () {
	function init() {
		document.querySelectorAll( ".nav-toggle" ).forEach( function ( button ) {
			var item = button.closest( ".nav-item, .md-nav__item, li" );
			var childList = item ? item.querySelector( "ul" ) : null;
			if ( !childList ) {
				return;
			}

			button.addEventListener( "click", function () {
				var open = button.getAttribute( "aria-expanded" ) === "true";
				button.setAttribute( "aria-expanded", open ? "false" : "true" );
				childList.hidden = open;
			} );
		} );
	}

	if ( document.readyState === "loading" ) {
		document.addEventListener( "DOMContentLoaded", init );
	} else {
		init();
	}
} )();
