/**
 * Wires up `::: comments` blocks (DirectiveBlockProcessor.bx's own
 * `renderComments()`) - only shipped when a project sets
 * `cloud.comments: true` in bxsites.yaml (BuildPipeline.bx's own
 * `copyAssetsFresh()`, the same explicit-opt-in-only convention
 * mermaid-init.js/openapi-init.js/cloud-content-init.js already use).
 *
 * Unlike `cloud-content-init.js`, the `[data-comments-thread]` container
 * this mounts into always starts EMPTY - `renderComments()` never fetches
 * anything at build time (a comment thread keeps growing after deploy, so
 * a baked snapshot would go stale the moment a new comment lands). This
 * script owns the entire UI: it builds the comment list and the submit
 * form itself, on every page load, from a fresh fetch.
 *
 * Same-origin, relative fetches only - `/api/comments/{threadId}`,
 * proxied by bx-sites-edge-router straight through to bxSites Cloud
 * (identical shape to cloud-content-init.js's own `/api/content/{slug}`
 * call) - no API base URL/token of any kind belongs on this side; the
 * edge router stamps its own shared-secret header on the way through, and
 * whether this project's plan is even entitled to a *working* thread is
 * decided there, not here (a 403/404 renders the same "not available"
 * fallback regardless of the exact reason).
 *
 * API contract this script targets (bxSites Cloud's own public delivery
 * API, implemented separately from this repo):
 *
 *   GET  /api/comments/{threadId}?offset={n}&max={n}
 *        -> 200 { count, offset, max, records: [
 *             { commentId, authorName, body, createdAt }, ...
 *           ] }
 *        Only ever returns already-APPROVED comments - a pending/rejected
 *        one is never included, so this list is always safe to render
 *        as-is with no client-side moderation state of its own.
 *
 *   POST /api/comments/{threadId}
 *        body: { authorName, authorEmail, body }  (authorName/authorEmail
 *              optional depending on the project's own settings; body
 *              required)
 *        -> 201 { commentId, status: "pending" } - accepted, awaiting
 *              moderation; NEVER appears in a later GET for any other
 *              visitor until a moderator approves it. This script shows
 *              it locally, in this one visitor's own browser only, with
 *              an explicit "pending" label - it's never treated as
 *              already-published.
 *        -> 422 { message } - validation failure (e.g. empty body).
 *        -> 403 { message } - comments aren't entitled/enabled for this
 *              site right now.
 *        -> 429 { message } - rate-limited.
 *
 * A fetch/network failure on the list request simply leaves the
 * container showing its loading state's own fallback ("Comments are
 * unavailable right now") - never a raw error, never retried
 * automatically. A submit failure leaves the reader's own draft text in
 * the form untouched, same posture as contact-form-init.js.
 */
( function () {
	var PAGE_SIZE = 20;

	function escapeHtml( value ) {
		var div = document.createElement( "div" );
		div.textContent = String( value == null ? "" : value );
		return div.innerHTML;
	}

	function formatDate( iso ) {
		try {
			return new Date( iso ).toLocaleDateString( undefined, { year: "numeric", month: "short", day: "numeric" } );
		} catch ( e ) {
			return "";
		}
	}

	/**
	 * Per-container state - not global, so multiple `::: comments` blocks
	 * on one page (different `id="..."` thread ids) never interfere with
	 * each other's pagination/pending-comment state.
	 */
	function createState( threadId ) {
		return { threadId: threadId, offset: 0, total: 0, pendingComments: [] };
	}

	function commentItemHtml( comment, pending ) {
		var name = comment.authorName && String( comment.authorName ).trim().length ? comment.authorName : "Anonymous";
		var dateLabel = pending ? "Pending moderation" : formatDate( comment.createdAt );
		return (
			'<li class="bxsites-comments__item' + ( pending ? " bxsites-comments__item--pending" : "" ) + '">' +
				'<div class="bxsites-comments__item-meta">' +
					'<span class="bxsites-comments__item-author">' + escapeHtml( name ) + "</span>" +
					'<span class="bxsites-comments__item-date">' + escapeHtml( dateLabel ) + "</span>" +
				"</div>" +
				'<div class="bxsites-comments__item-body">' + escapeHtml( comment.body ) + "</div>" +
			"</li>"
		);
	}

	function renderList( container, state, records ) {
		var list = container.querySelector( ".bxsites-comments__list" );
		var html = state.pendingComments.map( function ( c ) { return commentItemHtml( c, true ); } ).join( "" );
		html += records.map( function ( c ) { return commentItemHtml( c, false ); } ).join( "" );
		list.innerHTML = html;

		var empty = container.querySelector( ".bxsites-comments__empty" );
		empty.hidden = state.pendingComments.length > 0 || records.length > 0 || state.offset > 0;

		var loadMore = container.querySelector( ".bxsites-comments__load-more" );
		var loaded = state.offset + records.length;
		loadMore.hidden = loaded >= state.total;
	}

	function loadPage( container, state, append ) {
		var loadMore = container.querySelector( ".bxsites-comments__load-more" );
		loadMore.disabled = true;

		var url = "/api/comments/" + encodeURIComponent( state.threadId ) + "?offset=" + state.offset + "&max=" + PAGE_SIZE;
		fetch( url )
			.then( function ( response ) {
				return response.ok ? response.json() : null;
			} )
			.then( function ( data ) {
				loadMore.disabled = false;
				if ( !data || !Array.isArray( data.records ) ) {
					if ( !append ) {
						container.querySelector( ".bxsites-comments__status" ).textContent = "Comments are unavailable right now.";
						container.querySelector( ".bxsites-comments__status" ).hidden = false;
					}
					return;
				}
				state.total = Number( data.count ) || 0;
				if ( append ) {
					var list = container.querySelector( ".bxsites-comments__list" );
					list.insertAdjacentHTML( "beforeend", data.records.map( function ( c ) { return commentItemHtml( c, false ); } ).join( "" ) );
					var loadMoreBtn = container.querySelector( ".bxsites-comments__load-more" );
					state.offset += data.records.length;
					loadMoreBtn.hidden = state.offset >= state.total;
				} else {
					renderList( container, state, data.records );
					state.offset = data.records.length;
				}
			} )
			.catch( function () {
				loadMore.disabled = false;
				if ( !append ) {
					var status = container.querySelector( ".bxsites-comments__status" );
					status.textContent = "Comments are unavailable right now.";
					status.hidden = false;
				}
			} );
	}

	function submitComment( container, state, form ) {
		var status = form.querySelector( ".bxsites-comments__form-status" );
		var button = form.querySelector( 'button[type="submit"]' );
		var body = form.querySelector( '[name="body"]' ).value.trim();

		status.hidden = true;
		status.className = "bxsites-comments__form-status";

		if ( !body.length ) {
			status.textContent = "Please write a comment before submitting.";
			status.className = "bxsites-comments__form-status bxsites-comments__form-status--error";
			status.hidden = false;
			return;
		}

		button.disabled = true;

		var authorNameField = form.querySelector( '[name="authorName"]' );
		var authorEmailField = form.querySelector( '[name="authorEmail"]' );
		var payload = {
			authorName : authorNameField ? authorNameField.value.trim() : "",
			authorEmail: authorEmailField ? authorEmailField.value.trim() : "",
			body       : body
		};

		fetch( "/api/comments/" + encodeURIComponent( state.threadId ), {
			method : "POST",
			headers: { "Content-Type": "application/json" },
			body   : JSON.stringify( payload )
		} )
			.then( function ( response ) {
				button.disabled = false;
				if ( response.status === 201 ) {
					state.pendingComments.push( { authorName: payload.authorName, body: payload.body, createdAt: new Date().toISOString() } );
					var list = container.querySelector( ".bxsites-comments__list" );
					list.insertAdjacentHTML( "afterbegin", commentItemHtml( state.pendingComments[ state.pendingComments.length - 1 ], true ) );
					container.querySelector( ".bxsites-comments__empty" ).hidden = true;
					form.querySelector( '[name="body"]' ).value = "";
					status.textContent = "Thanks - your comment is awaiting moderation and will appear once approved.";
					status.className = "bxsites-comments__form-status bxsites-comments__form-status--success";
					status.hidden = false;
					return;
				}
				if ( response.status === 403 ) {
					status.textContent = "Comments aren't available on this site right now.";
					status.className = "bxsites-comments__form-status bxsites-comments__form-status--error";
					status.hidden = false;
					return;
				}
				if ( response.status === 429 ) {
					status.textContent = "Too many comments submitted - please try again shortly.";
					status.className = "bxsites-comments__form-status bxsites-comments__form-status--error";
					status.hidden = false;
					return;
				}
				response.json().then(
					function ( data ) {
						status.textContent = ( data && data.message ) || "Something went wrong posting this comment. Please try again.";
						status.className = "bxsites-comments__form-status bxsites-comments__form-status--error";
						status.hidden = false;
					},
					function () {
						status.textContent = "Something went wrong posting this comment. Please try again.";
						status.className = "bxsites-comments__form-status bxsites-comments__form-status--error";
						status.hidden = false;
					}
				);
			} )
			.catch( function () {
				// Network/DNS/offline failure - the reader's own draft
				// text is left untouched, same posture as
				// contact-form-init.js.
				button.disabled = false;
				status.textContent = "Something went wrong posting this comment. Please check your connection and try again.";
				status.className = "bxsites-comments__form-status bxsites-comments__form-status--error";
				status.hidden = false;
			} );
	}

	function mount( container ) {
		var threadId = container.getAttribute( "data-comments-thread" ) || "";
		if ( !threadId ) {
			return;
		}
		var state = createState( threadId );

		container.innerHTML =
			'<ul class="bxsites-comments__list"></ul>' +
			'<p class="bxsites-comments__empty" hidden>No comments yet - be the first to say something.</p>' +
			'<p class="bxsites-comments__status" hidden></p>' +
			'<button type="button" class="bxsites-comments__load-more" hidden>Load more comments</button>' +
			'<form class="bxsites-comments__form">' +
				'<div class="bxsites-comments__field">' +
					'<label for="bxsites-comments-name-' + escapeHtml( threadId ) + '">Name</label>' +
					'<input type="text" id="bxsites-comments-name-' + escapeHtml( threadId ) + '" name="authorName" autocomplete="name">' +
				"</div>" +
				'<div class="bxsites-comments__field">' +
					'<label for="bxsites-comments-email-' + escapeHtml( threadId ) + '">Email (never shown publicly)</label>' +
					'<input type="email" id="bxsites-comments-email-' + escapeHtml( threadId ) + '" name="authorEmail" autocomplete="email">' +
				"</div>" +
				'<div class="bxsites-comments__field">' +
					'<label for="bxsites-comments-body-' + escapeHtml( threadId ) + '">Comment</label>' +
					'<textarea id="bxsites-comments-body-' + escapeHtml( threadId ) + '" name="body" rows="3" required></textarea>' +
				"</div>" +
				'<p class="bxsites-comments__form-status" hidden></p>' +
				'<button type="submit">Post comment</button>' +
			"</form>";

		container.querySelector( ".bxsites-comments__load-more" ).addEventListener( "click", function () {
			loadPage( container, state, true );
		} );
		container.querySelector( ".bxsites-comments__form" ).addEventListener( "submit", function ( event ) {
			event.preventDefault();
			submitComment( container, state, event.target );
		} );

		loadPage( container, state, false );
	}

	function init() {
		document.querySelectorAll( "[data-comments-thread]" ).forEach( function ( el ) {
			if ( el.dataset.bxsitesInit ) {
				return;
			}
			el.dataset.bxsitesInit = "true";
			mount( el );
		} );
	}

	if ( document.readyState === "loading" ) {
		document.addEventListener( "DOMContentLoaded", init );
	} else {
		init();
	}
} )();
