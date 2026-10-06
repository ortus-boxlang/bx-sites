/**
 * Typesets LaTeX math left in the page text by MathProtector.bx
 * (`$...$` inline, `$$...$$` block) using KaTeX's auto-render extension,
 * loaded from its CDN alongside this file (see layout.bxm, gated on
 * bxsites.json's `math` flag). Only included in the build when math is
 * enabled - see BuildPipeline.bx's copyAssets().
 */
( function () {
	function init() {
		if ( typeof renderMathInElement !== "function" ) {
			return;
		}
		renderMathInElement( document.body, {
			delimiters : [
				{ left : "$$", right : "$$", display : true },
				{ left : "$", right : "$", display : false }
			],
			throwOnError : false
		} );
	}

	if ( document.readyState === "loading" ) {
		document.addEventListener( "DOMContentLoaded", init );
	} else {
		init();
	}
} )();
