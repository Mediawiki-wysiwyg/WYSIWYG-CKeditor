if (!('SMW_DI_VERSION').InArray(window.parent.wgCKeditorUseBuildin4Extensions)) {
// Data Import extension is not installed, show a teaser only.
CKEDITOR.plugins.add( 'smw_webservice',
{
	requires : [ 'dialog' ],
	init : function( editor )
	{
		var command = editor.addCommand( 'SMWwebservice', new CKEDITOR.dialogCommand( 'SMWwebservice' ) );
		command.canUndo = false;

		editor.ui.addButton( 'SMWwebservice',
			{
				label : 'Webservice definition',
				command : 'SMWwebservice',
                icon: this.path + 'images/tb_icon_webservice.gif'
			});

		CKEDITOR.dialog.add( 'SMWwebservice', this.path + 'dialogs/teaser.js' );
	}
});

} else {
// Data Import extension is installed, use the Webservice
CKEDITOR.plugins.add('smw_webservice', {

    requires : [ 'mediawiki', 'dialog' ],
    
	init : function( editor )
	{
		editor.addCss(
			'img.FCK__SMWwebservice' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/tb_icon_webservice.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 18px !important;' +
				'height: 18px !important;' +
			'}\n'
        );
        // language logic for additional messages
        var pluginLang = []
        pluginLang['en'] = {
            titleWsDef      : 'Webservice call',
            titleWsEdit     : 'Edit webservice call',
            defineWs        : 'Define here the webservice call:'
        }

        pluginLang['de'] = {
            titleWsDef      : 'Webservice Definition',
            titleWsEdit     : 'Ändere Webservice Aufruf',
            defineWs        : 'Spezifiziere den Webservice Aufruf:'
        }
        if (typeof pluginLang[editor.langCode] != 'undefined' )
            editor.lang.smwwebservice = pluginLang[editor.langCode];
        else
            editor.lang.smwwebservice = pluginLang['en'];
        
		editor.addCommand( 'SMWwebservice', new CKEDITOR.dialogCommand( 'SMWwebservice' ) );
        CKEDITOR.dialog.add( 'SMWwebservice', this.path + 'dialogs/smwWebserviceDlg.js');
		editor.addCommand( 'SMWwebserviceEdit', new CKEDITOR.dialogCommand( 'SMWwebserviceEdit' ) );
        CKEDITOR.dialog.add( 'SMWwebserviceEdit', this.path + 'dialogs/smwWebserviceEditDlg.js');

        if (editor.addMenuItem) {
            // A group menu is required
            // order, as second parameter, is not required
            editor.addMenuGroup('mediawiki');
            // Create a menu item
            editor.addMenuItem('SMWwebserviceEdit', {
                label: editor.lang.smwwebservice.titleWsEdit,
                command: 'SMWwebserviceEdit',
                group: 'mediawiki'
            });
        }

        if ( editor.ui.addButton ) {
            editor.ui.addButton( 'SMWwebservice',
                {
                    label : editor.lang.smwwebservice.titleWsDef,
                    command : 'SMWwebservice',
                    icon: this.path + 'images/tb_icon_webservice.gif'
                });
        }
        // context menu
        if (editor.contextMenu) {
            editor.contextMenu.addListener(function(element, selection) {
                var name = element.getName();
                // fake image for some <span> with special tag
                if ( name == 'img' && element.getAttribute( 'class' ) == 'FCK__SMWwebservice' )
                    return { SMWwebserviceEdit: CKEDITOR.TRISTATE_ON };
            });
        }
        editor.on( 'doubleclick', function( evt )
			{
				var element = evt.data.element;

				if ( element.is( 'img' ) &&
                     element.getAttribute( 'class' ) &&
                     element.getAttribute( 'class' ) == 'FCK__SMWwebservice' )
					evt.data.dialog = 'SMWwebserviceEdit';
            }
        )
		
	}
});

}