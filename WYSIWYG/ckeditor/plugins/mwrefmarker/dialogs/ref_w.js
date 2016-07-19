
// 14.07.16 RL: NOTE! This is test/demo widget of WYSIWYG and it is not used by Mediawiki-WYSIWYG.

CKEDITOR.dialog.add( 'mwrefmarker', function( editor ) {
	return {
		title : 'Widget: ' + editor.lang.mwplugin.referenceTitle,        //'Add/modify reference (citation)' 
		minWidth  : 600,                                                                  
		minHeight : 50,
		resizable: CKEDITOR.DIALOG_RESIZE_BOTH,                                           
		contents : [{
			id : 'info',
			label : 'Widget: ' + editor.lang.mwplugin.referenceTitle,    //'Add reference (citation)'     
			title : 'Add reference',
			elements : [
				{
					id   : 'footnote',
					type : 'textarea',
					rows : 16,                                                            
					label: editor.lang.mwplugin.refDefTxt,  //'Text of reference'          
					title: 'Text of reference',
					setup: function( widget ){
						alert('MWRefmarker footnote setup2');
						this.setValue( widget.data.fck_mw_reftagtext );

					},
					commit: function( widget ) {
						alert('MWRefmarker footnote commit2');
						widget.setData( 'fck_mw_reftagtext', this.getValue() );
					}
				},
				{
					id   : 'refname',
					type : 'text',
					label: editor.lang.mwplugin.refDefName, //'Name of reference             
					title: 'Name of reference (used if same text is referenced at multible places on page, if not, leave empty)',
					setup: function( widget ){
						alert('MWRefmarker refname setup2');
						this.setValue( widget.data.name );
					},
					commit: function( widget ) {
						alert('MWRefmarker refname commit2');
						widget.setData( 'name', this.getValue() );
					}
				}
			]
		}] //,
		
		//onOk : function( ) {
			
			//alert('onOKssa');
			
			// Run element specific commit functions for elements of this dialog
			//this.commitContent();			
			
			//alert('uusi widget:' + widget);
			
		//}
	};
} );
