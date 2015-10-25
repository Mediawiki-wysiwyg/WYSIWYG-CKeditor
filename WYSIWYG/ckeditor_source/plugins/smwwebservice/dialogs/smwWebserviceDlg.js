CKEDITOR.dialog.add( 'SMWwebservice', function( editor ) {
    var wgScript = window.parent.wgScript;
    var location =  wgScript + '?action=ajax&rs=smwf_uws_getPage';
    
	return {
		title: editor.lang.smwwebservice.titleWsDef,

		minWidth: 900,
		minHeight: (window.outerHeight == undefined) ? 400 : parseInt(window.outerHeight * 0.6),


		contents: [
			{
				id: 'tab1_smw_wws',
				label: 'Tab1',
				title: 'Tab1',
				elements : [
					{
						id: 'wwsframe',
						type: 'html',
						label: "Text",
                        style: 'width:100%; height:100%;',
						html: '<iframe name="CKeditorWebserviceDef" \
                                       style="width:100%; height:100%" \
                                       scrolling="auto" src="'+location+'"></iframe>'
					}
				 ]
			}
		 ],


		onOk: function() {
			var wwsFrame = window.frames['CKeditorWebserviceDef'];
            var content = wwsFrame.useWSSpecial.createWSSyn();
            content = content.replace(/\r?\n/, 'fckLR');
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

        onShow: function() {
            // fix size of inner window for iframe
            var node = document.getElementsByName('tab1_smw_wws')[0];
            var child = node.firstChild;
            while ( child && (child.nodeType != 1 || child.nodeName.toUpperCase() != 'TABLE') )
                child = child.nextSibling;
            if (child) {
                child.style.height = '100%';
                var cells = child.getElementsByTagName('td');
                for (var i= 0; i < cells.length; i++)
                    cells[i].style.height = '100%';
            }
        }

	};

} );