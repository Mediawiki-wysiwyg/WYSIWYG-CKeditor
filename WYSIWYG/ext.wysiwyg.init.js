
// WYSIWYG CKeditor entry function 
// 22.03.16 RL  Moved here from CKeditor.body.js
//

// 22.02.16 RL:addOnloadHook( initEditor ); addOnloadHook is deprecated method, 
//             Call "$( initEditor );" is shorthand for "jQuery( document ).ready( function( $ ) {...} );"
//             Because of async. loading of javascripts by mediawiki, somethimes call of initEditor fails 
//             => added setTimeout(); this should be properly fixed somehow.             
//setTimeout(function(){jQuery( document ).ready( initEditor );}, delay_addonloadhook); 

//22.03.16 RL  After using resourceloader variable delay_addonloadhook is not needed anymore.
//jQuery( document ).ready( initEditor ); 

//24.03.16 RL
jQuery( document ).ready( function(){
	//mw.loader.using( ['ext.CKEDITOR'], function () { // Ensure that we have ext.CKeditor loaded
		CKEDITOR_ready = true;
		initEditor();
	//} );
} ); 
