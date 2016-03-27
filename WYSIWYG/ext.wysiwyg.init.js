
// WYSIWYG CKeditor entry function 
// 22.03.16 RL  Moved here from CKeditor.body.js
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

// 27.03.16 RL: Hide window of wikieditor because it may take some time until window of WYSIWG is displayed.
if ( (showFCKEditor & RTE_VISIBLE     == RTE_VISIBLE) ||      // 1 = RTE_VISIBLE
	 (showFCKEditor & RTE_TOGGLE_LINK == RTE_TOGGLE_LINK) ) { // 2 = RTE_TOGGLE_LINK
	$('#wpTextbox1').hide();  
}

// 27.03.16 RL: Client side loading of modules
$.when(
	mw.loader.using( ['ext.CKEDITOR','ext.WYSIWYG.func'] ),
	$.ready
).done( function () {
	CKEDITOR_ready = true;
	initEditor();
} );
