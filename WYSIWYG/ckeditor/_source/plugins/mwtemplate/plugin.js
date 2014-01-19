/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "sourcearea" plugin. It registers the "source" editing
 *		mode, which displays the raw data being edited in the editor.
 */

CKEDITOR.plugins.add( 'mwtemplate',
{
	requires : [ 'mediawiki', 'dialog' ],

	init : function( editor )
	{
		// Add the CSS styles for special wiki placeholders.
		editor.addCss(
			'img.FCK__MWTemplate' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_template.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 18px !important;' +
				'height: 18px !important;' +
			'}\n'
		);

        editor.addCommand( 'MWTemplate', new CKEDITOR.dialogCommand( 'MWTemplate' ) );
        CKEDITOR.dialog.add( 'MWTemplate', this.path + 'dialogs/template.js' );
        if (editor.addMenuItem) {
            // A group menu is required
            // order, as second parameter, is not required
            editor.addMenuGroup('mediawiki');
            // Create a menu item
            editor.addMenuItem('MWTemplate', {
                label: 'Template',
                command: 'MWTemplate',
                group: 'mediawiki'
            });
        }
		if ( editor.ui.addButton )
		{
			editor.ui.addButton( 'MWTemplate',
				{
					label : 'Mediawiki Template',
					command : 'MWTemplate',
                    icon: this.path + 'images/icon_template.gif'
				});

		}

        // context menu
        if (editor.contextMenu) {
            editor.contextMenu.addListener(function(element, selection) {
                var name = element.getName();
                // fake image for some <span> with special tag
                if ( name == 'img' && element.getAttribute( 'class' ) == 'FCK__MWTemplate' )
                    return { MWTemplate: CKEDITOR.TRISTATE_ON };
            });
        }
        editor.on( 'doubleclick', function( evt )
			{
				var element = evt.data.element;

				if ( element.is( 'img' ) &&
                     element.getAttribute( 'class' ) &&
                     element.getAttribute( 'class' ) == 'FCK__MWTemplate' )
					evt.data.dialog = 'MWTemplate';
            }
       )

        var MWpluginLang = []
        MWpluginLang['en'] = {
            title      : 'Mediawiki Template Dialogue',
            defineTmpl : 'Define any template calls for Mediawiki'
        }
        MWpluginLang['de'] = {
            title      : 'Mediawiki Template Dialog',
            defineTmpl : 'Templateaufruf in Wikitext'
        }

        if (typeof MWpluginLang[editor.langCode] != 'undefined' )
            editor.lang.mwtemplateplugin = MWpluginLang[editor.langCode];
        else
            editor.lang.mwtemplateplugin = MWpluginLang['en'];
	}
});
