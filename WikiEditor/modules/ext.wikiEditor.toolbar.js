/*
 * JavaScript for WikiEditor Toolbar
 */
jQuery( document ).ready( function ( $ ) {
	if ( !$.wikiEditor.isSupported( $.wikiEditor.modules.toolbar ) ) {
		$( '.wikiEditor-oldToolbar' ).show();
		return;
	}
	// The old toolbar is still in place and needs to be removed so there aren't two toolbars
	$( '#toolbar' ).remove();
	// Add toolbar module
	// TODO: Implement .wikiEditor( 'remove' )
	$( '#wpTextbox1' ).wikiEditor(
		'addModule', $.wikiEditor.modules.toolbar.config.getDefaultConfig()
	);
	// 01.07.16 RL-> Hide WikiEditor toolbar in case CKeditor WYSIWYG mode is active
	if ( mw.config.get('useWikiEditor') ) {
		if ( mw.config.get('showFCKEditor') & mw.config.get('RTE_VISIBLE') ) { $('#wikiEditor-ui-toolbar').hide(); }
		else  { $('#wikiEditor-ui-toolbar').show(); }
	}
	// 01.07.16 RL<-	
} );
