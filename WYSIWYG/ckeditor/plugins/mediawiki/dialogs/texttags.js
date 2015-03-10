CKEDITOR.dialog.add( 'MWTextTagsD', function( editor ) {
    return {
        title: editor.lang.mwplugin.speSpecialTexts, //'Special Texts'
        minWidth: 400,
        minHeight: 120,
        contents: [
            {
                id: 'tab-basic',
                label: editor.lang.mwplugin.speSpecialTexts,  //'Special Texts'
                elements: [
					{
						type: 'radio',
						id: 'mwtag',
						label: editor.lang.mwplugin.speOperation, //'Select type / operation',
						items:[ [ 'Nowiki', 'nowiki' ], 
								[ 'Syntaxhighlight', 'syntaxhighlight' ],
								[ editor.lang.mwplugin.speRemoveTag, 'removetag' ]  //'Remove tag'
							  ],
						style:	'color: black',
								'default': 'nowiki',
								
						onClick: function() {
							/****
							alert( 'Current value of rb: ' + this.getValue() +
							       ' mwtag text:' + CKEDITOR.dialog.getCurrent().getValueOf( 'tab-basic','attribute')
								 );
							*****/
						},
                        setup: function( element ) {
							
							var rbTagName = 'removetag';
							switch ( element.getName() ){
								case 'syntaxhighlight': 
								case 'nowiki':
								rbTagName = element.getName();
								break;
							}	
                            this.setValue( rbTagName );
                        }
						/***
                        commit: function( element ) {
                            element.setAttribute( "lang", this.getValue() );
                        }		
						***/
					},
                    {
                        type: 'text',
                        id: 'attribute',
                        label: editor.lang.mwplugin.speAttrValue, //'Syntax'
                        setup: function( element ) {
							var rbAttribute = '';
							switch ( element.getName() ){
								case 'syntaxhighlight': 
									//case 'nowiki':
									rbAttribute = element.getAttribute('lang');
									break;
							}	
							this.setValue( rbAttribute );
                        },
						validate: function(){
							var value = this.getValue().trim(),
								mwTag = CKEDITOR.dialog.getCurrent().getValueOf( 'tab-basic','mwtag'),
								pass = ( mwTag != 'syntaxhighlight' ) || ( mwTag == 'syntaxhighlight' && value != '' );
							if ( pass == false ) alert( editor.lang.common.invalidValue ); // Illegal value, empty value is not allowed
							return pass;
						}
						/**
						setup: function( element ) {
							this.setValue( element.getText() );
						},
						commit: function( element ) {
							if ( CKEDITOR.dialog.getCurrent().getValueOf( 'tab-basic','mwtag') == 'syntaxhighlight' ) {
								element.setAttribute( 'lang', this.getValue().trim() );
							}
						}
						**/
                    }
                ]
            }
        ],

        onShow: function() {
            var selection = editor.getSelection();
            var element = selection.getStartElement();

			this.hasPre = false;
			this.hasSyntaxhighlight = false;
			this.hasNowiki = false;
			
			if ( element ) {
				if( element.hasAscendant('pre', true) ) 
					this.hasPre = true;
				if ( element.getName() == 'syntaxhighlight' )
					this.hasSyntaxhighlight = true;
				if ( element.getName() == 'nowiki' )
					this.hasNowiki = true;
			}

			if (this.hasPre || this.hasSyntaxhighlight  || this.hasNowiki ) {
				this.hasText = element.getText(); //Remember text
			}
			else {
				if ( CKEDITOR.env.ie ) 				
					this.hasText = selection.document.$.selection.createRange().text; //Remember text
				else
					this.hasText = selection.getNative(); //Remember text
			}
			
			if ( !this.hasPre ) {
				element = editor.document.createElement( 'pre' ); 
				this.insertMode = true;   //Plain text selected, insert pre tag
			}
			else {
				this.insertMode = false;  //Element already has pre tag
			}
		
			this.element = element; //Remember focused element
			
			if ( !this.insertMode )
				this.setupContent( this.element ); //Setup dialog
        },

        onOk: function() {
            var dialog = this;
            var element, elText, mwtag, hasMWTag;
			
			hasMWTag = this.hasSyntaxhighlight || this.hasNowiki;
			if ( hasMWTag ) {
				mwtag   = this.element; // Existing nowiki/syntaxhighlight child element
				mwtag.setText('');      // Clear to prevent duplicate text
				element = mwtag.getAscendant( 'pre', false ); // Parent pre tag				
			}
			else {
				mwtag   = new CKEDITOR.dom.element( this.getValueOf( 'tab-basic','mwtag') ); // New child element
				element = this.element; // Clean pre element when dialog was openened
				element.setText('');    // Clear to prevent duplicate text
			}

			switch ( this.getValueOf( 'tab-basic','mwtag') ){
				case 'syntaxhighlight':
						if ( this.hasNowiki ) { // Switch nowiki=>syntaxhighlight
							mwtag.remove( false );
							mwtag = new CKEDITOR.dom.element( 'syntaxhighlight' ); // New element
							hasMWTag = false;
						}
						mwtag.setAttribute( 'lang', this.getValueOf( 'tab-basic','attribute') );
						mwtag.setText( this.hasText );
						if ( element.hasClass('fck_mw_nowiki')           ) element.removeClass('fck_mw_nowiki');
						if ( !element.hasClass('fck_mw_syntaxhighlight') ) element.addClass('fck_mw_syntaxhighlight');
						break;
				case 'nowiki':
						if ( this.hasSyntaxhighlight ) { // Switch syntaxhighlight => nowiki
							mwtag.remove( false );
							mwtag = new CKEDITOR.dom.element( 'nowiki' ); // New element
							hasMWTag = false;
						}
						mwtag.setText( this.hasText );
						if ( element.hasClass('fck_mw_syntaxhighlight') ) element.removeClass('fck_mw_syntaxhighlight');
						if ( !element.hasClass('fck_mw_nowiki')         ) element.addClass('fck_mw_nowiki');
						break;
				case 'removetag':
						if ( element ) {
							if ( element.hasClass('fck_mw_nowiki') )          element.removeClass('fck_mw_nowiki');
							if ( element.hasClass('fck_mw_syntaxhighlight') ) element.removeClass('fck_mw_syntaxhighlight');
							mwtag.setText( this.hasText );
							if ( this.hasNowiki || this.hasSyntaxhighlight ) {
								mwtag.remove( true );  //Remove nowiki/syntaxhighlight child tag
								if ( this.hasPre ) {
									element.remove( true ); //Remove pre- tag, keep text
								}
							} else {
								element.remove( true ); //Remove pre- tag, keep text
							}
							if ( CKEDITOR.env.ie ) editor.focus();
						}
						break;
				default:
						break;
			}	

			if ( element && this.getValueOf( 'tab-basic','mwtag') != 'removetag' ) {

				if ( !hasMWTag )
					mwtag.appendTo( element );       // Add nowiki or syntaxhighlight child to old parent pre tag
				
				if ( this.insertMode )
					editor.insertElement( element ); // Insert new parent pre tag with nowiki/syntaxhighlight child
			}
        }
    };
});
