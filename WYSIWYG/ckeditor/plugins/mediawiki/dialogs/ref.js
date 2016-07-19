CKEDITOR.dialog.add( 'MWRefmarker', function( editor ) {

	var loadElements = function( editor, selection, element ) {
		var reftext = null;
		
		element.editMode = true;
		reftext = element.getText();
		
		if ( reftext.length > 0 )
			this.setValueOf( 'info','footnote', reftext );
		else
			this.setValueOf( 'info','footnote', "" );
		
		//03.01.14-> Parse also possible name of reference  
		var rname = null;
		rname = element.getAttribute('name');
		/**
		alert( "Referenced text: "  + this.getValueOf( 'info','footnote') +
			"Name of reference:" +  rname  +
			" lr:  " + reftext.length + 
			" lrn: " + rname.length
			);
		**/
		if ( rname.length > 0 )
			this.setValueOf( 'info','refname', rname );
		else
			this.setValueOf( 'info','refname', "" );
		//03.01.14 RL<-
		
	};
	
	return {	
		title : editor.lang.mwplugin.referenceTitle,  //'Add/modify reference (citation)'  //10.01.14 RL
		minWidth  : 600,                                                                   //28.02.14 RL 
		minHeight : 50,
		resizable: CKEDITOR.DIALOG_RESIZE_BOTH,                                            //28.02.14 RL
		contents : [{
			id : 'info',
			label : editor.lang.mwplugin.referenceTitle, //'Add reference (citation)'      //10.01.14 RL
			title : 'Add reference',
			elements : [
				{
					id   : 'footnote',
					type : 'textarea',
					rows : 16,                                                               //28.02.14 RL 
					label: editor.lang.mwplugin.refDefTxt, //'Text of reference'             //10.01.14 RL
					title: 'Text of reference'
					/****
					setup: function(element){
						alert('MWRefmarker footnote setup');
						this.setValue( widget.data.fck_mw_reftagtext );

					},
					commit: function( widget ) {
						alert('MWRefmarker footnote commit');
						widget.setData( 'fck_mw_reftagtext', this.getValue() );

					}
					*****/
				},
				{
					id   : 'refname',
					type : 'text',
					label: editor.lang.mwplugin.refDefName, //'Name of reference              //10.01.14 RL
					title: 'Name of reference (used if same text is referenced at multible places on page, if not, leave empty)' 
					// labelLayout : 'horizontal',
					// style : 'float:left;width:100px;',
					/***
					setup: function(element){
						alert('MWRefmarker refname setup');
						this.setValue( widget.data.name );
					},
					commit: function( widget ) {
						alert('MWRefmarker refname commit');
						widget.setData( 'name', this.getValue() );
					}
					*****/
				}
			]
		}],
		
		onShow: function() {

			this.editObj  = false;
			this.fakeObj  = false;
			this.editMode = false;
			this.element  = false;
				
			// Run element specific setup functions for elements of this dialog
			// this.setupContent();
				
			// Related to CKeditor Ticket #8493, 8719.patch: IE needs focus sent back to the parent document if a dialog is launched.
			// After CKeditor 4.4.0 upgrade, IE lost focus of element, restore focus back to selected element to get attribute data.
			if ( CKEDITOR.env.ie ) editor.focus(); //05.05.14 RL 
	 
			var selection = editor.getSelection();
			//var ranges = selection.getRanges();
			var element = selection.getSelectedElement() || null;
			var seltype = selection.getType();     // SELECTION_NONE=1 SELECTION_TEXT=2 SELECTION_ELEMENT=3

			// Check if element is <R>- widget     // 14.07.16 RL 
			if ( element != null ) { 		       // For <R>- widget '<span class="fck_mw_ref" data-widget="mwrefmarker"><sup><ref fck_mw_reftagtext="..'
				var span1 = element.getChild(0) || null;
				var sup1  = span1.getChild(0)   || null;
				var ref1  = sup1.getChild(0)    || null;
				
				/****debug***
				alert('elem:' + element + ' asc-rec:' + element.hasAscendant('ref', true)
					+ '\n seltype:\t' + seltype
					+ '\n ce:\t'      + element.hasAttribute('contenteditable')
					+ '\n hasPrev:\t' + element.hasPrevious()
					+ '\n hasNext:\t' + element.hasNext()
					+ '\n firstN:\t'  + element.getFirst().getName()
					+ '\n lastN:\t'   + element.getLast().getName()
					+ '\n shc-qty:\t' + element.getChildCount() 
					+ '\n span1:\t'   + span1
					+ '\n sup1:\t'    + sup1
					+ '\n ref1:\t'    + ref1
					+ '\n shc1N:\t'      + span1.getName()                        // <span 
					+ '\n shc1Class:\t'  + span1.hasClass('fck_mw_ref')           // <span class="fck_mw_ref"
					+ '\n shc1Attr:\t'   + span1.getAttribute('data-widget')      // <span class="fck_mw_ref" data-widget="mwrefmarker"..
					+ '\n shc1.1N:\t'    + sup1.getName()                         //   ..<sup>..
					+ '\n shc1.2N:\t'    + ref1.getName()                         //     ..<ref ..
					+ '\n shc1.2Attr:\t' + ref1.getAttribute('fck_mw_reftagtext') //     ..<ref fck_mw_reftagtext="..
				);		
				*****/
						
				if ( span1 != null && sup1 != null && ref1 != null ) {
					if ( span1.getName() == 'span' && span1.hasClass('fck_mw_ref')  && span1.getAttribute('data-widget') == 'mwrefmarker' &&
						sup1.getName() == 'sup' && ref1.getName() == 'ref' ) { 		
						element = ref1;
					}
				}
			}

			// Check if selection is first version of text based <R> -element. Not used anymore after widget implementation.
			if ( element == null ) {                     //For text block <R>
				element = selection.getStartElement();
			}

			// <R>-widget or text based <R>-element
			if ( element != null && element.getAttribute( 'class' ) == 'fck_mw_ref' && element.hasAscendant('ref', true) ) 
			{
				//alert('ref exists, act.elem:' + element.getName() + ' t:' + element.getText + ' c:' + element.getAttribute( 'class' ) + 
				//   ' en:' + element.getName() + ' et:' + element.getAttribute( 'title'));
				
				if ( element.hasAttribute('name') ) 
					this.setValueOf( 'info','refname', element.getAttribute('name') );
				else
					this.setValueOf( 'info','refname', '' );
			
				if ( element.hasAttribute('name') && element.getAttribute( 'fck_mw_reftagtext') == '_' ) 
					this.setValueOf( 'info','footnote', '' );
				else 
					this.setValueOf( 'info','footnote', element.getAttribute( 'fck_mw_reftagtext') );
			
				this.element = element;
			}
			else if ( element != null && seltype == CKEDITOR.SELECTION_ELEMENT && element.getAttribute( 'class' ) == 'FCK__MWRef' ) //img element
			{
				this.fakeObj = element;
				element = editor.restoreRealElement( this.fakeObj );
				loadElements.apply( this, [ editor, selection, element ] );
				selection.selectElement( this.fakeObj );         
			}
			else if ( seltype == CKEDITOR.SELECTION_TEXT )  //Selected text for reference
			{  
				this.setValueOf( 'info','footnote', selection.getSelectedText());  //09.09.14 RL           
				//if ( CKEDITOR.env.ie )  //27.02.14 RL->                                                                         
				//	this.setValueOf( 'info','footnote', selection.document.$.selection.createRange().text ); 
				//else                    //27.02.14 RL<- 
				//	this.setValueOf( 'info','footnote', selection.getNative() );              
			}
			this.getContentElement( 'info', 'footnote' ).focus();
		},

		onOk : function() {
			
			var editor  = this.getParentEditor();
			var reftext = this.getValueOf( 'info', 'footnote' );
			var refname = this.getValueOf( 'info', 'refname' );
			//var refHtml = '<ref>_</ref>'; 
			var realElement;    //<ref> text based element, image element is not used.
			var data;
			
			// Run element specific commit functions for elements of this dialog
			//this.commitContent();		
         
			//We have reference text or name of reference or both:
			if ( reftext.length > 0 || refname.length > 0 ) {
            
				//var realElement = CKEDITOR.dom.element.createFromHtml('<ref></ref>'); //For some reason this fails with IE8 even when reftext is not empty
				if (this.element) {
					realElement = this.element;
				}
				else {
					//realElement = new CKEDITOR.dom.element('ref'); 
					realElement = CKEDITOR.dom.element.createFromHtml('<ref></ref>', editor.document);  //10.02.14 RL: This works with IE8, IE11, FF v26.0
				}
				
				//03.01.14 RL CKEditor with FireFox v26.0 removes references from page in case text
				//of reference is empty (when using reference names) => convert empty value to '_'
				if (reftext.length == 0 && refname.length > 0)
					reftext = '_';

				if ( reftext.length > 0 ) {
					//realElement.setText(reftext);
					realElement.setText('&lt;R&gt;');
					realElement.setAttribute('fck_mw_reftagtext',reftext);
					realElement.setAttribute('class','fck_mw_ref');
							
					//Attribute "title" will be overwritten later by plugin.js -> references_build_list
					if ( reftext != '_' ) {
						if ( refname.length == 0 )
							realElement.setAttribute('title',reftext); //For text of tooltip
						else 
							realElement.setAttribute('title','[' + refname + ']:' + reftext); 
					}
					else if ( refname.length != 0 )
						realElement.setAttribute('title','[' + refname + ']');
				}
			
				if ( refname.length > 0 ) {
					realElement.setAttribute('name',refname);      //03.01.14 RL Was 'value'
				} else if ( realElement.hasAttribute('name') ) { //08.07.16 RL
					realElement.removeAttribute('name'); 
				}
              
				if ( !this.element ) {
					fakeElement = CKEDITOR.dom.element.createFromHtml( '<sup></sup>', editor.document );
					fakeElement2 = realElement.appendTo( fakeElement );          // <sup>..<ref>..</ref></sup>

					fakeElement = CKEDITOR.dom.element.createFromHtml( '<span></span>', editor.document );
					//fakeElement.setAttribute('contenteditable','false');       // <span>contenteditable=..</span>
					fakeElement.setAttribute('class','fck_mw_ref');              // <span>class=..</span>
					realElement = fakeElement2.appendTo( fakeElement );          // <span><sup>..<ref>..</ref></sup></span>		

					editor.insertElement( realElement );  
					
					// Initialize widget recognition for new element.
					// http://ckeditor.com/forums/CKEditor/help-Inserting-a-widget-from-my-own-button
					editor.widgets.initOn( realElement, 'mwrefmarker' );         //14.07.16 RL
				}
			  
				// Just in case... not sure if this is needed.
				editor.updateElement();

				// Renumber <ref> elements, rebuild contents of <references> tags
				references_build_list( editor ); //08.07.16 RL function is defined in plugin.js
			}
		}
	}
} );
