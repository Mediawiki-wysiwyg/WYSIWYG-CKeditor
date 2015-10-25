CKEDITOR.dialog.add( 'SMWrule', function( editor ) {
    var wgScript = window.parent.wgScript;
    var location =  wgScript + '?action=ajax&rs=smwf_uws_getPage';
    
	return {
		title: editor.lang.smwrule.titleRule,

		minWidth: 900,
		minHeight: (window.outerHeight == undefined) ? 400 : parseInt(window.outerHeight * 0.6),


		contents: [
			{
				id: 'tab1_smw_rule',
				label: 'Tab1',
				title: 'Tab1',
				elements : [
					{
						id: 'wwsframe',
						type: 'html',
						label: "Text",
                        style: 'width:100%; height:100%;',
						html: '<iframe name="CKeditorSmwRuleDef" \
                                       style="width:100%; height:100%" \
                                       scrolling="auto" src="'+location+'"></iframe>'
					}
				 ]
			}
		 ],


		onOk: function() {
			var wwsFrame = window.frames['CKeditorSmwRuleDef'];
            var content = wwsFrame.useWSSpecial.createWSSyn();
            content = content.replace(/\r?\n/, 'fckLR');
			
            content = '<span class="fck_smw_rule">' + content + '</span>';

			var element = CKEDITOR.dom.element.createFromHtml(content, editor.document),
				newFakeObj = editor.createFakeElement( element, 'FCK__SMWrule', 'span' );
			if ( this.fakeObj ) {
				newFakeObj.replace( this.fakeObj );
				editor.getSelection().selectElement( newFakeObj );
            } else
				editor.insertElement( newFakeObj );
		},

        onShow: function() {
            // fix size of inner window for iframe
            var node = document.getElementsByName('tab1_smw_rule')[0];
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