CKEDITOR.dialog.add( 'MWRef', function( editor ) {
  var loadElements = function( editor, selection, element )
	{
         var content = null;

         element.editMode = true;
         content = element.getText();

        if ( content.length > 0 )
         this.setValueOf( 'info','footnote', content );
        else
         this.setValueOf( 'info','footnote', "" );

        //03.01.14-> Parse also possible name of reference  
        var rname = null;
        rname = element.getAttribute('name');
        /**
        alert( "Referenced text: "  + this.getValueOf( 'info','footnote') +
               "Name of reference:" +  rname  +
               " lr:  " + content.length + 
               " lrn: " + rname.length
             );
        **/
        if ( rname.length > 0 )
          this.setValueOf( 'info','value', rname );
        else
          this.setValueOf( 'info','value', "" );
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
			 elements :
				[{
				  id    : 'footnote',
				  type  : 'textarea',
				  rows  : 16,                                                                //28.02.14 RL 
				  label : editor.lang.mwplugin.refDefTxt, //'Text of reference'              //10.01.14 RL
				  title : 'Text of reference',
				  setup: function(element){
					this.setValue(element.getAttribute('data-cke-realelement'));
				  }
				 },
				 {
				  id : 'value',
				  type : 'text',
				  label : editor.lang.mwplugin.refDefName, //'Name of reference              //10.01.14 RL
				  title : 'Name of reference (used if same text is referenced at multible places on page, if not, leave empty)', 
				  // labelLayout : 'horizontal',
				  // style : 'float:left;width:100px;',
				  setup: function(element){
					this.setValue(element.getAttribute('value'));
				  }
				 }
				]
			}],
	onShow: function()
		{
         this.editObj = false;
         this.fakeObj = false;
         this.editMode = false;
		 this.element = false;
         //Related to CKeditor Ticket #8493, 8719.patch: IE needs focus sent back to the parent document if a dialog is launched.
         //After CKeditor 4.4.0 upgrade, IE lost focus of element, restore focus back to selected element to get attribute data.
		 if ( CKEDITOR.env.ie ) editor.focus();                                              //05.05.14 RL 
	 
         var selection = editor.getSelection();
         //var ranges = selection.getRanges();
         var element = selection.getSelectedElement();
         var seltype = selection.getType();

		 if ( element == null )                      //For text block <R>
			element = selection.getStartElement();
		
		 if ( seltype == CKEDITOR.SELECTION_TEXT && element.getAttribute( 'class' ) == 'fck_mw_ref' && element.hasAscendant('ref', true) ) //Text block <R>
		 {
			//alert('ref exists, akt.elem:' + element.getName() + ' t:' + element.getText + ' c:' + element.getAttribute( 'class' ) + 
			//   ' ?:' + element.getName() + ' ' + element.getAttribute( 'title'));
				
			if ( element.hasAttribute('name') ) 
				this.setValueOf( 'info','value', element.getAttribute('name') );
			else
				this.setValueOf( 'info','value', '' );
			
			if ( element.hasAttribute('name') && element.getAttribute( 'fck_mw_reftagtext') == '_' ) 
				this.setValueOf( 'info','footnote', '' );
			else 
				this.setValueOf( 'info','footnote', element.getAttribute( 'fck_mw_reftagtext') );
			
			this.element = element;
		 }
		 else if ( seltype == CKEDITOR.SELECTION_ELEMENT && element.getAttribute( 'class' ) == 'FCK__MWRef' ) //img element
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
	onOk : function()
          {
            var editor = this.getParentEditor();
            var content = this.getValueOf( 'info', 'footnote' );
            var value = this.getValueOf( 'info', 'value' );
            var ref = '<ref>_</ref>'; 
			var realElement;    //<ref> text based element, image element is not used.
         
            //We have reference text or name of reference or both:
            if ( content.length > 0 || value.length > 0 ) {
            
              //var realElement = CKEDITOR.dom.element.createFromHtml('<ref></ref>'); //For some reason this fails with IE8 even when content is not empty
			  if (this.element) {
				  realElement = this.element;
			  }
			  else
				  realElement = new CKEDITOR.dom.element('ref');  //10.02.14 RL: This works with IE8, IE11, FF v26.0
			  
              //03.01.14 RL->CKEditor with FireFox v26.0 removes references from page in case text
              //of reference is empty (when using reference names) => convert empty value to '_'
              if (content.length == 0 && value.length > 0)
                content = '_';
              //03.01.14 RL<-

              if ( content.length > 0 ) {
                //realElement.setText(content);
				realElement.setText('<R>');
				realElement.setAttribute('fck_mw_reftagtext',content);
				realElement.setAttribute('class','fck_mw_ref');
				
				//Attribute "title" will be overwritten later by plugin.js -> references_build_list
				if ( content != '_' ) {
					if ( value.length == 0 )
						realElement.setAttribute('title',content); //For text of tooltip
					else 
						realElement.setAttribute('title','[' + value + ']:' + content); 
				}
				else if ( value.length != 0 )
					realElement.setAttribute('title','[' + value + ']');
			  }
			
			  if ( value.length > 0 ) {
				realElement.setAttribute('name',value);        //03.01.14 RL Was 'value'
			  } else if ( realElement.hasAttribute('name') ) { //08.07.16 RL
				realElement.removeAttribute('name'); 
			  }
              
			  if ( !this.element ) {
				fakeElement = new CKEDITOR.dom.element('sup');               //<sup></sup>
				fakeElement2 = realElement.appendTo( fakeElement );          //<sup>..<ref>..</ref></sup>
				                                                            
				realElement = new CKEDITOR.dom.element('span');              //<span></span>
				//realElement.setAttribute('contenteditable','false');       //<span>contenteditable=..</span>
				realElement.setAttribute('class','fck_mw_ref');              //<span>class=..</span>
				editor.insertElement(fakeElement2.appendTo( realElement ));  //<span><sup>..<ref>..</ref></sup></span>
			  }
			  
			  //Renumber <ref> elements, rebuild contents of <references> tags
			  editor.updateElement();
			  references_build_list( editor ); //08.07.16 RL function is defined in plugin.js
            }
		}
  };
} );
