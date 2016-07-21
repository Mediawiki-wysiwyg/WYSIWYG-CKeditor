
// WYSIWYG CKeditor entry function 
// 22.03.16 RL  Moved here from CKeditor.body.php
//

// 22.02.16 RL:addOnloadHook( initEditor ); addOnloadHook is deprecated method, 
//             Call "$( initEditor );" is shorthand for "jQuery( document ).ready( function( $ ) {...} );"
//             Because of async. loading of javascripts by mediawiki, somethimes call of initEditor fails 
//             => added setTimeout(); this should be properly fixed somehow.             
//setTimeout(function(){jQuery( document ).ready( initEditor );}, delay_addonloadhook); 

//24.03.16 RL  After using resourceloader, variable delay_addonloadhook is not needed anymore.
//jQuery( document ).ready( initEditor ); // Starts when page is ready

// To test if module has been loaded, in console of browser type:
// mw.loader.getState( '_name_of_module_' );  where _name_of_module is ext.WYSIWYG.init, ext.WYSIWYG.func or ext.CKEDITOR


/*****
jQuery( document ).ready( function(){
	mw.loader.using( ['ext.CKEDITOR'], function () {
		CKEDITOR_ready = true;
		initEditor();
	} );
} ); 
*****/


var modules = [], //17.04.16 RL
_showFCKEditor = mw.config.get('showFCKEditor');
_RTE_VISIBLE   = mw.config.get('RTE_VISIBLE');
_RTE_TOGGLE_LINK = mw.config.get('RTE_TOGGLE_LINK');

// 27.03.16 RL: Hide window of wikieditor because it may take some time until window of WYSIWG is displayed.
if ( ( _showFCKEditor & _RTE_VISIBLE     == _RTE_VISIBLE ) ||      // 1 = _RTE_VISIBLE
	 ( _showFCKEditor & _RTE_TOGGLE_LINK == _RTE_TOGGLE_LINK ) ) { // 2 = _RTE_TOGGLE_LINK
	$('#wpTextbox1').hide();  
}


if ( mw.config.get('useWikiEditor') == true && mw.loader.getState('ext.wikiEditor') != null ) {  //Use WikiEditor + module is registered
	modules.push('ext.wikiEditor'); 
}

// Source-  mode of Wysiwyg is not fully resourceloader compatible and it requires 
// setting $wgWYSIWYGSourceMode = true; and $wgResourceLoaderDebug = true; in LocalSettings.php,
// which will then load CKeditor on server side.
if ( mw.config.get( 'CKEDITOR_sourcemode' ) == 0 ) {   //17.04.16 RL Runtime- mode loads CKeditor on client side.
	modules.push('ext.CKEDITOR'); 
}                                

modules.push('ext.WYSIWYG.func');       //Functions needed by Wysiwyg.

// 27.03.16 RL: Client side loading of modules
$.when(
	mw.loader.using( modules ),
	$.ready
).done( function () {
	mw.config.set('CKEDITOR_ready', true);
	initEditor();
} );
