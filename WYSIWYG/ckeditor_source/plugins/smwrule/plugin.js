if (('SEMANTIC_RULES_VERSION').InArray(window.parent.wgCKeditorUseBuildin4Extensions)) {
// Rules extension is installed
CKEDITOR.plugins.add('smw_rule', {

    requires : [ 'mediawiki', 'dialog' ],
    
	init : function( editor )
	{
		editor.addCss(
			'img.FCK__SMWrule' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/tb_icon_rule.gif' ) + ');' +
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
            titleRule       : 'Semantic Rule',
            titleRuleEdit   : 'Edit semantic rule',
            editRule        : 'Edit your rule definition:'
        }

        pluginLang['de'] = {
            titleRule       : 'semantische Regel',
            titleRuleEdit   : 'Ändere semantische Regel',
            editRule        : 'Definiere den Regeltext:'
        }
        if (typeof pluginLang[editor.langCode] != 'undefined' )
            editor.lang.smwrule = pluginLang[editor.langCode];
        else
            editor.lang.smwrule = pluginLang['en'];

		//editor.addCommand( 'SMWrule', new CKEDITOR.dialogCommand( 'SMWrule' ) );
        //CKEDITOR.dialog.add( 'SMWrule', this.path + 'dialogs/smwRuleDlg.js');
		editor.addCommand( 'SMWruleEdit', new CKEDITOR.dialogCommand( 'SMWruleEdit' ) );
        CKEDITOR.dialog.add( 'SMWruleEdit', this.path + 'dialogs/smwRuleEditDlg.js');

        if (editor.addMenuItem) {
            // A group menu is required
            // order, as second parameter, is not required
            editor.addMenuGroup('mediawiki');
            // Create a menu item
            editor.addMenuItem('SMWruleEdit', {
                label: editor.lang.smwrule.titleRuleEdit ,
                command: 'SMWruleEdit',
                group: 'mediawiki'
            });
        }
        /*
        if ( editor.ui.addButton ) {
            editor.ui.addButton( 'SMWrule',
                {
                    label : 'Create new rule',
                    command : 'SMWrule',
                    icon: this.path + 'images/tb_icon_rule.gif'
                });
        }
        */
        // context menu
        if (editor.contextMenu) {
            editor.contextMenu.addListener(function(element, selection) {
                var name = element.getName();
                // fake image for some <span> with special tag
                if ( name == 'img' && element.getAttribute( 'class' ) == 'FCK__SMWrule' )
                    return { SMWruleEdit: CKEDITOR.TRISTATE_ON };
            });
        }
        editor.on( 'doubleclick', function( evt )
			{
				var element = evt.data.element;

				if ( element.is( 'img' ) &&
                     element.getAttribute( 'class' ) &&
                     element.getAttribute( 'class' ) == 'FCK__SMWrule' )
					evt.data.dialog = 'SMWruleEdit';
            }
       )

	}
});
} else {
// rules extension is not installed
}