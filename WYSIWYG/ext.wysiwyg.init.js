
// WYSIWYG CKeditor entry function 
// 22.03.16 RL  Moved here from CKeditor.body.js
//

// 22.02.16 RL:addOnloadHook( initEditor ); addOnloadHook is deprecated method, 
//             Call "$( initEditor );" is shorthand for "jQuery( document ).ready( function( $ ) {...} );"
//             Because of async. loading of javascripts by mediawiki, somethimes call of initEditor fails 
//             => added setTimeout(); this should be properly fixed somehow.             


//alert ('init00:' + delay_addonloadhook + ' CKEDITOR_ready:' + CKEDITOR_ready);

//CKEDITOR_ready = true;

//setTimeout(function(){jQuery( document ).ready( initEditor );}, delay_addonloadhook); 

//22.03.16 RL  After using resourceloader variable delay_addonloadhook is not needed anymore.
//jQuery( document ).ready( initEditor ); 

setTimeout(function(){jQuery( document ).ready( initEditor );}, 1000); 
