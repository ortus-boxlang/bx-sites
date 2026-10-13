/**
 * Click-to-enlarge lightbox (DirectiveBlockProcessor.bx's `::: image-gallery`
 * plus every other content image). Only copied into a build when the project
 * sets `imageGallery: true` (BuildPipeline.bx) - inert with zero cost
 * otherwise, the same opt-in posture as openapi-init.js.
 *
 * What opens the lightbox:
 *   - any `<img data-bxsites-lightbox>` (a `::: image-gallery` item, or an
 *     author or theme marking its own image), anywhere in the page;
 *   - any other `<img>` inside the page's `<main>`/`<article>` content,
 *     unless it is opted out (`class="no-zoom"` or `data-no-zoom`), sits in
 *     a link or a button, or is smaller than MIN_SIZE (icons, badges, logos).
 *
 * One shared overlay is built lazily on the first click. Prev/next cycles
 * through every zoomable image on the page, in document order, so a page
 * of lone screenshots behaves like one gallery. Clicks are delegated, so
 * images added later (lazy loading, Alpine `x-if`) work with no re-init.
 */
( function () {
	var MIN_SIZE = 120;
	var CONTENT_ROOTS = "main, article";
	var SKIP_ANCESTORS = "a[href], button, nav, header, footer, .bxsites-card, .bxsites-lightbox";

	var overlay = null;
	var images = [];
	var index = 0;

	function buildOverlay() {
		var el = document.createElement( "div" );
		el.className = "bxsites-lightbox";
		el.hidden = true;
		el.setAttribute( "role", "dialog" );
		el.setAttribute( "aria-modal", "true" );
		el.innerHTML =
			'<button type="button" class="bxsites-lightbox__close" aria-label="Close">&times;</button>' +
			'<button type="button" class="bxsites-lightbox__prev" aria-label="Previous image">&#8249;</button>' +
			'<img class="bxsites-lightbox__image" alt="">' +
			'<button type="button" class="bxsites-lightbox__next" aria-label="Next image">&#8250;</button>';

		el.querySelector( ".bxsites-lightbox__close" ).addEventListener( "click", close );
		el.querySelector( ".bxsites-lightbox__prev" ).addEventListener( "click", function () {
			show( index - 1 );
		} );
		el.querySelector( ".bxsites-lightbox__next" ).addEventListener( "click", function () {
			show( index + 1 );
		} );
		// A click on the dark scrim itself (not the image or the nav buttons) closes it.
		el.addEventListener( "click", function ( event ) {
			if ( event.target === el ) {
				close();
			}
		} );

		document.body.appendChild( el );
		return el;
	}

	function show( newIndex ) {
		index = ( newIndex + images.length ) % images.length;
		var img = images[ index ];
		var lightboxImage = overlay.querySelector( ".bxsites-lightbox__image" );
		// `src`, not `currentSrc`: a responsive <picture> may have picked a small variant
		lightboxImage.src = img.src || img.currentSrc;
		lightboxImage.alt = img.alt;

		var multiple = images.length > 1;
		overlay.querySelector( ".bxsites-lightbox__prev" ).hidden = !multiple;
		overlay.querySelector( ".bxsites-lightbox__next" ).hidden = !multiple;
	}

	function open( clickedImage ) {
		if ( !overlay ) {
			overlay = buildOverlay();
		}
		images = zoomables();
		var start = images.indexOf( clickedImage );
		if ( start < 0 ) {
			images = [ clickedImage ];
			start = 0;
		}
		show( start );
		overlay.hidden = false;
		document.addEventListener( "keydown", onKeydown );
	}

	function close() {
		if ( overlay ) {
			overlay.hidden = true;
		}
		document.removeEventListener( "keydown", onKeydown );
	}

	function onKeydown( event ) {
		if ( event.key === "Escape" ) {
			close();
		} else if ( event.key === "ArrowLeft" ) {
			show( index - 1 );
		} else if ( event.key === "ArrowRight" ) {
			show( index + 1 );
		}
	}

	function optedOut( img ) {
		return img.classList.contains( "no-zoom" ) || img.hasAttribute( "data-no-zoom" );
	}

	/** An image that is marked explicitly, or is plain page content of a useful size. */
	function isZoomable( img ) {
		if ( optedOut( img ) || img.closest( ".bxsites-lightbox" ) ) {
			return false;
		}
		if ( img.hasAttribute( "data-bxsites-lightbox" ) ) {
			return true;
		}
		if ( !img.closest( CONTENT_ROOTS ) || img.closest( SKIP_ANCESTORS ) ) {
			return false;
		}
		// Not loaded yet (lazy): judge by the declared width, else let it through.
		var width = img.naturalWidth || parseInt( img.getAttribute( "width" ), 10 ) || 0;
		return !img.complete || !width || width >= MIN_SIZE;
	}

	function zoomables() {
		return Array.prototype.filter.call( document.querySelectorAll( "img" ), isZoomable );
	}

	function init() {
		document.addEventListener( "click", function ( event ) {
			var img = event.target.closest ? event.target.closest( "img" ) : null;
			if ( img && !event.defaultPrevented && isZoomable( img ) ) {
				open( img );
			}
		} );
		// Say so with the cursor, without needing a stylesheet change in every theme.
		zoomables().forEach( function ( img ) {
			if ( !img.style.cursor ) {
				img.style.cursor = "zoom-in";
			}
		} );
	}

	if ( document.readyState === "loading" ) {
		document.addEventListener( "DOMContentLoaded", init );
	} else {
		init();
	}
} )();
