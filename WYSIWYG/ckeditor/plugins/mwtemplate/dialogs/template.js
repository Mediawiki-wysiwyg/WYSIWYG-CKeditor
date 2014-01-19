CKEDITOR.dialog.add( 'MWTemplate', function( editor ) {
{
        return {
            title : editor.lang.mwtemplateplugin.title,
            minWidth : 350,
            minHeight : 140,
            resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
			contents : [
				{
					id : 'mwTemplateTagDef',
					label : 'Special Tags label',
                    title : 'Special Tags title',
					elements :
					[
                        {
                            id: 'tagDefinition',
                            type: 'textarea',
                            label: editor.lang.mwtemplateplugin.defineTmpl,
                            title: 'Template Tag definition',
                            className: 'swmf_class',
                            style: 'border: 1px;'
                        }
		            ]
                }
            ],
            onOk : function() {
        		var tag = null,
                    className = null,
                    textarea = this.getContentElement( 'mwTemplateTagDef', 'tagDefinition'),
                    content = textarea.getValue();

                content.Trim();
                content = content.replace(/\r?\n/g, 'fckLR');
                // check for a tag
                if (el = content.match(/^{{[\w\d_-]+((\|.*?)*)}}$/)) {
                    tag = '<span class="fck_mw_template">' + el[0] + '</span>';
                    className = 'FCK__MWTemplate';
                }
                else {
                    alert ('invalid content');
                    return;
                }
                var element = CKEDITOR.dom.element.createFromHtml(tag, editor.document),
                    newFakeObj = editor.createFakeElement( element, className, 'span' );
                if ( this.fakeObj ) {
					newFakeObj.replace( this.fakeObj );
					editor.getSelection().selectElement( newFakeObj );
				}
				else
					editor.insertElement( newFakeObj );

			},

       		onShow : function() {
    			this.fakeObj = false;

        		var editor = this.getParentEditor(),
            		selection = editor.getSelection(),
                	element = null;

    			// Fill in all the relevant fields if there's already one item selected.
        		if ( ( element = selection.getSelectedElement() ) && element.is( 'img' )
            			&& element.getAttribute( 'class' ) == 'FCK__MWTemplate' )
                {
                    this.fakeObj = element;
    				element = editor.restoreRealElement( this.fakeObj );
        			selection.selectElement( this.fakeObj );
                    var content = element.getHtml().replace(/_$/, '');
                    content = content.replace(/fckLR/g, '\r\n');
                   
                    var textarea = this.getContentElement( 'mwTemplateTagDef', 'tagDefinition');
                    textarea.setValue(content);
                }
            }

        }
}
} );
