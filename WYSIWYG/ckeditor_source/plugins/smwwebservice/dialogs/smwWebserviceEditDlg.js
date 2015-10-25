CKEDITOR.dialog.add( 'SMWwebserviceEdit', function( editor ) {

	return {
		title: editor.lang.smwwebservice.titleWsEdit,

		minWidth: 600,
		minHeight:200,


		contents: [
			{
				id: 'tab1',
				label: 'Tab1',
				title: 'Tab1',
				elements : [
                    {
                        id: 'tagDefinition',
                        type: 'textarea',
                        label: editor.lang.smwwebservice.defineWs,
                        title: 'Edit webservice definition',
                        className: 'swmf_class',
                        style: 'border: 1px;'
                    }
				 ]
			}
		 ],


		onOk: function() {
			var textarea = this.getContentElement( 'tab1', 'tagDefinition'),
                content = textarea.getValue();

            content = content.Trim().replace(/\r?\n/, 'fckLR');
            content = CKEDITOR.tools.htmlEncode(content);
            content = '<span class="fck_smw_webservice">' + content + '</span>';

			var element = CKEDITOR.dom.element.createFromHtml(content, editor.document),
				newFakeObj = editor.createFakeElement( element, 'FCK__SMWwebservice', 'span' );
			if ( this.fakeObj ) {
				newFakeObj.replace( this.fakeObj );
				editor.getSelection().selectElement( newFakeObj );
            } else
				editor.insertElement( newFakeObj );
		},
   		onShow : function() {
  			this.fakeObj = false;

       		var editor = this.getParentEditor(),
           		selection = editor.getSelection(),
               	element = null;

   			// Fill in all the relevant fields if there's already one item selected.
       		if ( ( element = selection.getSelectedElement() ) && element.is( 'img' )
           			&& element.getAttribute( 'class' ) == 'FCK__SMWwebservice'
               )
            {
                this.fakeObj = element;
 				element = editor.restoreRealElement( this.fakeObj );
       			selection.selectElement( this.fakeObj );
                var content = element.getHtml().replace(/fckLR/g, '\r\n');
                content = content.htmlDecode().Trim();
                var textarea = this.getContentElement( 'tab1', 'tagDefinition');
                textarea.setValue(content);
            }
        }
	};

} );