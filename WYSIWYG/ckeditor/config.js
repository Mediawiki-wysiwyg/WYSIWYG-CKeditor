/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

if (!String.prototype.InArray) {
	String.prototype.InArray = function(arr) {
		for(var i=0;i<arr.length;i++) {
            if (arr[i] == this)
                return true;
        }
		return false;
	}
}

CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
    var showTbButton = (typeof window.parent.wgCKEditorHideDisabledTbutton == 'undefined');
    
    CKEDITOR.plugins.addExternal( 'mediawiki', CKEDITOR.basePath + 'plugins/mediawiki/' );
    CKEDITOR.plugins.addExternal( 'mwtemplate', CKEDITOR.basePath + 'plugins/mwtemplate/' );
    
    // Remove the link plugin because it's replaced with the mediawiki plugin
    //CKEDITOR.config.plugins = CKEDITOR.config.plugins.replace( /(?:^|,)link(?=,|$)/, '' );
	var extraPlugins = "mediawiki,mwtemplate";

	config.toolbar = 'Wiki';
    // var origToolbar = CKEDITOR.config.toolbar_Full

 
    config.toolbar_Wiki = [
        // 27.11.13 RL  When editing section, "Save" button replaces whole text => disable it
		// 27.11.13 RL  ['Source'],['Save','Print','SpellChecker','Scayt'],
		['Source'],['Print','SpellChecker','Scayt'],
        ['PasteText','PasteFromWord', '-','Find','Replace'],
        ['SelectAll','RemoveFormat'],
        ['Subscript','Superscript'],
        ['Link','Unlink'],
        ['Undo','Redo'],
        ['Image', 'Table', 'HorizontalRule', 'SpecialChar'],
        ['MWSpecialTags', 'MWTemplate', 'MWSignature', 'qiButton', 'wsButton', 'rmButton' ],
        [ 'stbButton' ],
		['MWCategory'],            //07.01.14 RL  
        ['MWRef', 'MWReferences'], //03.01.14 RL For references (citation)
        ['About'], 
        '/',
        ['Styles','Format','Font','FontSize'],
        ['Bold','Italic','Underline','Strike'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
        ['NumberedList','BulletedList', '-', 'Outdent','Indent', 'Blockquote'],
        ['TextColor','BGColor'],
        ['Maximize', 'ShowBlocks']
    ];
    config.extraPlugins = extraPlugins;
    config.height = '26em';
    config.resize_dir = 'vertical';
    config.language = window.parent.wgUserLanguage || 'en';

    config.WikiSignature = '--~~~~';

    // remove format: address
    config.format_tags = 'p;h1;h2;h3;h4;h5;h6;pre;div';
    // use fontsizes only that do not harm the skin
    config.fontSize_sizes = 'smaller;larger;xx-small;x-small;small;medium;large;x-large;xx-large';

};
