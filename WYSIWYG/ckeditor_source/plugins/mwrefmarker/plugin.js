
// 14.07.16 RL: NOTE! This is test/demo widget of WYSIWYG and it is not used by Mediawiki-WYSIWYG.

CKEDITOR.plugins.add( 'mwrefmarker', {
    requires: 'widget',

    icons: 'mwrefmarker',

    init: function( editor ) {
		
		// Widget 'MWRefmarker' for <ref>
		editor.widgets.add( 'mwrefmarker', {
			
			//button:   'Create a ref widget', //Do not use automatic registration of button because of the image filename and location.	
			
			template:
				'<span class="fck_mw_ref">' +
					'<ref class="fck_mw_ref" ' +
						'title="Text of reference" ' +
						'fck_mw_reftagtext="Text of reference" ' +
						'name="Name of reference">' +
						'[X]' +
					'</ref>' +
				'</span>',
				
			dialog: 'mwrefmarker',
			

			allowedContent:
				//'span(!fck_mw_ref); sup; ref(!fck_mw_ref)[title,fck_mw_reftagtext,name]',
				'span(!fck_mw_ref); ref(fck_mw_ref)',
			
			requiredContent: 				
				//'span(!fck_mw_ref); sup; ref(!fck_mw_ref)[title,fck_mw_reftagtext,name]',
				'span(!fck_mw_ref); ref(fck_mw_ref)',

		
			upcast: function(element) {
				//return element.name == 'span' && element.hasClass('fck_mw_ref');
				if ( element.name == 'span' && element.hasClass('fck_mw_ref') )
					return element;
			},
	
			/*******/
			// Copy data from dom element into data of widget.
			init: function() {
				
				//var selection = editor.getSelection();
				//var ranges = selection.getRanges();
				//var element = selection.getSelectedElement() || null;
				//var seltype = selection.getType();     // SELECTION_NONE=1 SELECTION_TEXT=2 SELECTION_ELEMENT=3
				
				//this.element.getType() + ' ref:' + ref.getName()
				/***
				alert('widget MWRefmarker, init'
						+ '\n ename:\t' + this.element.getName() 
						+ '\n clref:\t' + this.element.hasClass( 'fck_mw_ref' ) 
						+ '\n dwidg:\t' + this.element.hasAttribute('data-widget') 
						//+ '\n seltype:\t' + seltype
						//+ '\n shc-qty:\t' + element.getChildCount() 
						+ '\n cont.ed:\t'   + this.element.hasAttribute('contenteditable')
						+ '\n hasPrev:\t' + this.element.hasPrevious()
						+ '\n hasNext:\t' + this.element.hasNext
						+ '\n firstN:\t'  + this.element.getFirst().getName()
						+ '\n lastN:\t'   + this.element.getLast().getName()						
						+ '\n chqty:\t'   + this.element.getChildCount()
						+ '\n ch1Name:\t' + this.element.getChild(0).getName()
						+ '\n ch1AtR:\t'  + this.element.getChild(0).getAttribute('fck_mw_reftagtext')
						+ '\n ch1AtN:\t'  + this.element.getChild(0).getAttribute('name') 
					); 
				***/
				
				var ref = this.element.getChild(0);  //='<ref>' from '<span>..<ref>..' of ref- element structure
				
				if ( ref.hasAttribute('fck_mw_reftagtext') )
					this.setData( 'fck_mw_reftagtext', ref.getAttribute( 'fck_mw_reftagtext' ) );
				else
					this.setData( 'fck_mw_reftagtext', '' );
				
				if ( ref.hasAttribute('name') )
					this.setData( 'name', ref.getAttribute( 'name' ) );
				else
					this.setData( 'name', '' );
			},
			
			// Save data from widget into element.
			data: function() {
				//alert( 'widget mwrefmarker, data' );
				
				var ref = this.element.getChild(0);  //='<ref>' from '<span>..<ref>..' of ref- element structure
				ref.setAttribute( 'fck_mw_reftagtext', this.data.fck_mw_reftagtext );
				
				if ( this.data.name != '' ) {
					ref.setAttribute( 'name', this.data.name );
					ref.setAttribute( 'title', '[' + this.data.name + ']: ' + this.data.fck_mw_reftagtext );
				}
				else {
					ref.removeAttribute( 'name' );
					ref.setAttribute( 'title', this.data.fck_mw_reftagtext );
				}
				
				//ref.setClass('fck_mw_ref');
			}
			/*******/
	
		});
	
			// Register dialog file of widget 'mwrefmarker' ('this.path' is the path of the plugin folder).
		CKEDITOR.dialog.add('mwrefmarker', this.path + 'dialogs/ref_w.js');	
	
		/****/
		// NOTE! addCommand may not be used when manually loading widget, addButton (or execCommand)
		//       does the work with widgets.
		//editor.addCommand('mwrefmarker', new CKEDITOR.dialogCommand('mwrefmarker') );
		/***/
		/***
		, {
			// This needs some testing:
			//allowedContent:  'span[*](*);header[*](*);li[*];a[*];ref(*)[*];sup[*];p[*]',
			//requiredContent: 'span[*](*);header[*](*);li[*];a[*];ref(*)[*];sup[*];p[*]'
		}
		***/		

		// Add button of 'MWRefmarker' and activate widget..
		editor.ui.addButton( 'mwrefmarker', {
			label: 'Create widget  ref', //editor.lang.mwplugin.ref,   //Create a reference
			command: 'mwrefmarker',
			//toolbar: 'basicstyles,1',
			icon: this.path + 'icons/icon_ref.gif'
		} );
		
		//.. or activate widget in "normal" way... same as when 'button:' is used.
		//editor.execCommand( 'foo' );
		
		// http://ckeditor.com/forums/CKEditor/help-Inserting-a-widget-from-my-own-button
		// During runtime you can initialize widgets on elements which you just inserted manually using the initOn. 
		// If dialog is not used, then it's pretty simple:
		//   var element = CKEDITOR.dom.element.createFromHtml( template, editor.document );
		//   editor.insertElement( element );
		//   editor.widgets.initOn( element, 'nameOfYourWidget', { ... startup data... } );
		
	}
} );