/* Publish module for wikiEditor */
( function ( $, mw ) {

	$.wikiEditor.modules.publish = {

		/**
		 * Compatibility map
		 */
		browsers: {
			// Left-to-right languages
			ltr: {
				msie: [ [ '>=', 9 ] ],
				firefox: [ [ '>=', 4 ] ],
				opera: [ [ '>=', '10.5' ] ],
				safari: [ [ '>=', 5 ] ],
				chrome: [ [ '>=', 5 ] ]
			},
			// Right-to-left languages
			rtl: {
				msie: [ [ '>=', 9 ] ],
				firefox: [ [ '>=', 4 ] ],
				opera: [ [ '>=', '10.5' ] ],
				safari: [ [ '>=', 5 ] ],
				chrome: [ [ '>=', 5 ] ]
			}
		},

		/**
		 * Internally used functions
		 */
		fn: {
			/**
			 * Creates a publish module within a wikiEditor
			 *
			 * @param {Object} context Context object of editor to create module in
			 */
			create: function ( context ) {
				// Build the dialog behind the Publish button
				var dialogID = 'wikiEditor-' + context.instance + '-dialog';
				$.wikiEditor.modules.dialogs.fn.create(
					context,
					{
						previewsave: {
							id: dialogID,
							titleMsg: 'wikieditor-publish-dialog-title',
							html:
								'<div class="wikiEditor-publish-dialog-copywarn"></div>' +
								'<div class="wikiEditor-publish-dialog-editoptions">' +
									'<form id="wikieditor-' + context.instance + '-publish-dialog-form">' +
										'<div class="wikiEditor-publish-dialog-summary">' +
											'<label for="wikiEditor-' + context.instance + '-dialog-summary"' +
												'rel="wikieditor-publish-dialog-summary"></label>' +
											'<br />' +
											'<input type="text" id="wikiEditor-' + context.instance + '-dialog-summary"' +
												'style="width: 100%;" />' +
										'</div>' +
										'<div class="wikiEditor-publish-dialog-options">' +
											'<input type="checkbox"' +
												'id="wikiEditor-' + context.instance + '-dialog-minor" />' +
											'<label for="wikiEditor-' + context.instance + '-dialog-minor"' +
												'rel="wikieditor-publish-dialog-minor"></label>' +
											'<input type="checkbox"' +
												'id="wikiEditor-' + context.instance + '-dialog-watch" />' +
											'<label for="wikiEditor-' + context.instance + '-dialog-watch"' +
												'rel="wikieditor-publish-dialog-watch"></label>' +
										'</div>' +
									'</form>' +
								'</div>',
							init: function () {
								var i, copyWarnHTML, copyWarnStatements, copyWarnStatement,
									newCopyWarnHTML;

								$( this ).find( '[rel]' ).each( function () {
									$( this ).text( mw.msg( $( this ).attr( 'rel' ) ) );
								} );

								/* REALLY DIRTY HACK! */
								// Reformat the copyright warning stuff, if available
								if ( $( '#editpage-copywarn p' ).length ) {
									copyWarnHTML = $( '#editpage-copywarn p' ).html();
									// TODO: internationalize by splitting on other characters that end statements
									copyWarnStatements = copyWarnHTML.split( '. ' );
									newCopyWarnHTML = '<ul>';
									for ( i = 0; i < copyWarnStatements.length; i++ ) {
										if ( copyWarnStatements[ i ] !== '' ) {
											copyWarnStatement = $.trim( copyWarnStatements[ i ] ).replace( /\.*$/, '' );
											newCopyWarnHTML += '<li>' + copyWarnStatement + '.</li>';
										}
									}
									newCopyWarnHTML += '</ul>';
									// No list if there's only one element
									$( this ).find( '.wikiEditor-publish-dialog-copywarn' ).html(
											copyWarnStatements.length > 1 ? newCopyWarnHTML : copyWarnHTML
									);
								}
								/* END OF REALLY DIRTY HACK */

								if ( $( '#wpMinoredit' ).length === 0 ) {
									$( '#wikiEditor-' + context.instance + '-dialog-minor' ).hide();
								} else if ( $( '#wpMinoredit' ).prop( 'checked' ) ) {
									$( '#wikiEditor-' + context.instance + '-dialog-minor' )
										.prop( 'checked', true );
								}
								if ( $( '#wpWatchthis' ).length === 0 ) {
									$( '#wikiEditor-' + context.instance + '-dialog-watch' ).hide();
								} else if ( $( '#wpWatchthis' ).prop( 'checked' ) ) {
									$( '#wikiEditor-' + context.instance + '-dialog-watch' )
										.prop( 'checked', true );
								}

								$( this ).find( 'form' ).submit( function ( e ) {
									$( this ).closest( '.ui-dialog' ).find( 'button:first' ).click();
									e.preventDefault();
								} );
							},
							immediateCreate: true,
							dialog: {
								buttons: {
									'wikieditor-publish-dialog-publish': function () {
										var minorChecked = $( '#wikiEditor-' + context.instance +
											'-dialog-minor' ).is( ':checked' ),
											watchChecked = $( '#wikiEditor-' + context.instance +
											'-dialog-watch' ).is( ':checked' );
										$( '#wpMinoredit' ).prop( 'checked', minorChecked );
										$( '#wpWatchthis' ).prop( 'checked', watchChecked );
										$( '#wpSummary' ).val( $( '#wikiEditor-' + context.instance +
											'-dialog-summary' ).val() );
										$( '#editform' ).submit();
									},
									'wikieditor-publish-dialog-goback': function () {
										$( this ).dialog( 'close' );
									}
								},
								open: function () {
									$( '#wikiEditor-' + context.instance + '-dialog-summary' ).focus();
								},
								width: 500
							},
							resizeme: false
						}
					}
				);

				context.fn.addButton( {
					captionMsg: 'wikieditor-publish-button-publish',
					action: function () {
						$( '#' + dialogID ).dialog( 'open' );
						return false;
					}
				} );

				context.fn.addButton( {
					captionMsg: 'wikieditor-publish-button-cancel',
					action: function () {
						window.location.href = $( '#mw-editform-cancel' ).attr( 'href' );
						return false;
					}
				} );
			}
		}

	};

}( jQuery, mediaWiki ) );
