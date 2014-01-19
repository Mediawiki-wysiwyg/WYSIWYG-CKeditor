CKEDITOR.dialog.add( 'SMWqi', function( editor ) {
    var wgScript = window.parent.wgScript;
    var locationQi =  wgScript + window.parent.smwghQiLoadUrl;
    var querySource;
	var height = (window.outerHeight == undefined) ? 400 : parseInt(window.outerHeight * 0.6);
	var language = editor.lang;
    
	return {
		title: 'Query Interface',
		lang: editor.lang,
		minWidth: 900,
		minHeight: (window.outerHeight == undefined) ? 400 : parseInt(window.outerHeight * 0.6),

		contents: [
			{
				id: 'tab1_smw_qi',
				label: 'Tab1',
				title: 'Tab1',
				elements : [
					{
						id: 'qiframe',
						type: 'html',
						label: "Text",
                        style: 'width:100%; height:'+height+'px;',
						html: '<iframe name="CKeditorQueryInterface" \
                                       style="width:100%; height:'+height+'px;" \
                                       scrolling="auto" src="'+locationQi+'"></iframe>'
					}
				 ]
			}
		 ],
		 
		 buttons: [
			       	CKEDITOR.dialog.okButton(editor, {
			       		label: 'Insert Query'
			       	}),
			       	CKEDITOR.dialog.cancelButton
			       ],

		 
         InsertDataInTextarea : function(ask) {
            var myArea = window.parent.getElementById('wpTextbox1');
            if (!myArea) myArea = window.parent.getElementById('free_text');

            if ( CKEDITOR.env.ie ) {
                if (document.selection) {
                    // The current selection
                    var range = document.selection.createRange();
                    // Well use this as a "dummy"
                    var stored_range = range.duplicate();
                    // Select all text
                    stored_range.moveToElementText( myArea );
                    // Now move "dummy" end point to end point of original range
                    stored_range.setEndPoint( 'EndToEnd', range );
                    // Now we can calculate start and end points
                    myArea.selectionStart = stored_range.text.length - range.text.length;
                }
            }
            if (myArea.selectionStart != undefined) {
                var before = myArea.value.substr(0, myArea.selectionStart);
                var after = myArea.value.substr(myArea.selectionStart);
                myArea.value = before + ask + after;
            }
         },

         onShow : function() {
			this.fakeObj = false;

    		var editor = this.getParentEditor(),
        		selection = editor.getSelection(),
            	element = null,
                qiDocument = window.frames['CKeditorQueryInterface'];
                
			// Fill in all the relevant fields if there's already one item selected.
    		if ( editor.mode == 'wysiwyg' &&
                 ( element = selection.getSelectedElement() ) && element.is( 'img' )
        			&& element.getAttribute( 'class' ) == 'FCK__SMWquery' )
            {
                this.fakeObj = element;
				element = editor.restoreRealElement( this.fakeObj );
    			selection.selectElement( this.fakeObj );
                querySource = element.getHtml().replace(/_$/, '');
				// decode HTML entities in the encoded query source
				querySource = jQuery("<div/>").html(querySource).text();
                querySource = querySource.replace(/fckLR/g, '\r\n');

                if ( typeof qiDocument.qihelper == 'undefined' )
                    qiDocument.onload = function() {
                        qiDocument.initialize_qi_from_querystring(querySource);
                    }
                else
                    qiDocument.qihelper.initFromQueryString(querySource);

            }
            else {
                if ( typeof qiDocument.qihelper != 'undefined' )
                    qiDocument.qihelper.doReset();
            }
        },

		onOk: function() {
			var qiDocument = window.frames['CKeditorQueryInterface'];
			var ask = qiDocument.qihelper.getAskQueryFromGui();
			ask = ask.replace(/\]\]\[\[/g, "]]\n[[");
			ask = ask.replace(/>\[\[/g, ">\n[[");
			ask = ask.replace(/\]\]</g, "]]\n<");
			ask = ask.replace(/([^\|]{1})\|{1}(?!\|)/g, "$1\n|");

            if ( editor.mode == 'wysiwyg') {
                ask = ask.replace(/\r?\n/g, 'fckLR');
                ask = '<span class="fck_smw_query">' + ask + '</span>';
                var element = CKEDITOR.dom.element.createFromHtml(ask, editor.document),
                    newFakeObj = editor.createFakeElement( element, 'FCK__SMWquery', 'span', false, 'Edit Query (with Query Interface)' );
                if ( this.fakeObj ) {
                    newFakeObj.replace( this.fakeObj );
    				editor.getSelection().selectElement( newFakeObj );
                } else
            		editor.insertElement( newFakeObj );
            }
            else {
                this.InsertDataInTextarea(ask);
            }
		}

	};

} );