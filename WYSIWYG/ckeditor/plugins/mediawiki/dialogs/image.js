/*
Different image objects invisible :
	element = the real selected element in CKeditor
	imageElement = image going to be inserted in CKeditor
	cleanImageElement = image buffer when in edit mode, becomes imageElement
	
For preview :
	preview = shortcut to img previewImageId = cke_64_previewImage
	previewPreloader = invisible img object

TODO : insert stopTyping ('stop typing to search')
TODO : disallow validation if image name is not found
TODO : replace deprecated Ajax call by jQuery ?
TODO : remove MW attributes that can be simply read in style ( _fck_mw_location  _fck_mw_vertical-align ... )

*/

CKEDITOR.dialog.add( 'MWImage', function( editor ) {
{
	
	// Load image preview.
	var IMAGE = 1,
		LINK = 2,
		PREVIEW = 4,
		CLEANUP = 8,
		regexGetSize = /^\s*(\d+)((px)|\%)?\s*$/i,
		SrcInWiki,
		previewPreloader,
		searchTimer,
        imgLabelField = (window.parent.wgAllowExternalImages || window.parent.wgAllowExternalImagesFrom )
            ? editor.lang.mwplugin.fileNameExtUrl
            : editor.lang.mwplugin.fileName;
			
	var numbering = function( id ) { return CKEDITOR.tools.getNextId() + '_' + id; }, // e.g 'cke_64_previewImage' -> Why ?
		btnLockSizesId = numbering( 'btnLockSizes' ),
		btnResetSizeId = numbering( 'btnResetSize' ),
		imagePreviewLoaderId = numbering( 'ImagePreviewLoader' ),
		imagePreviewBoxId = numbering( 'ImagePreviewBox' ),
		previewLinkId = numbering( 'previewLink' ),
		previewImageId = numbering( 'previewImage' );		
			
	
	var onSizeChange = function() {
					var value = this.getValue(),	// This = input element.
						aMatch = value.match( regexGetSize ); // Check value
					if ( aMatch ) {
						if ( aMatch[ 2 ] == '%' ) // % is allowed - > unlock ratio.
						switchLockRatio( false ); // Unlock.
						value = aMatch[ 1 ];
					}

					// Only if ratio is locked
					if ( dialog.lockRatio ) {
						var origWidth = previewPreloader.$.naturalWidth,
							origHeight = previewPreloader.$.naturalHeight;
						
							if ( this.id == 'txtHeight' ) {
								if ( value && value != '0' )
									value = Math.round( origWidth * ( value / origHeight ) );
								if ( !isNaN( value ) )
									dialog.setValueOf( 'info', 'txtWidth', value );
							}
							else {
								if ( value && value != '0' )
									value = Math.round( origHeight * ( value / origWidth ) );
								if ( !isNaN( value ) )
									dialog.setValueOf( 'info', 'txtHeight', value );
							}
					}
					updatePreview();  	
	};
	
	var SetupRatioLock = function() {
			// Activate Reset button
			var resetButton = CKEDITOR.document.getById( btnResetSizeId ),
			ratioButton = CKEDITOR.document.getById( btnLockSizesId );
			if ( resetButton ) {
				resetButton.on( 'click', function( evt ) {
					resetSize();
					evt.data && evt.data.preventDefault();
				} );
				resetButton.on( 'mouseover', function() { this.addClass( 'cke_btn_over' ); }, resetButton );
				resetButton.on( 'mouseout', function() { this.removeClass( 'cke_btn_over' );}, resetButton );
			}
			// Activate (Un)LockRatio button
			if ( ratioButton ) {
				ratioButton.on( 'click', function( evt ) {
					switchLockRatio();

					var origWidth = previewPreloader.$.naturalWidth,
						origHeight = previewPreloader.$.naturalHeight,
						width = dialog.getValueOf( 'info', 'txtWidth' );

						var height = origHeight / origWidth * width;
						if ( !isNaN( height ) ) {
							dialog.setValueOf( 'info', 'txtHeight', Math.round( height ) );
							updatePreview();
						}	
				evt.data && evt.data.preventDefault();
				} );
				ratioButton.on( 'mouseover', function() {this.addClass( 'cke_btn_over' );}, ratioButton );
				ratioButton.on( 'mouseout', function() {this.removeClass( 'cke_btn_over' );}, ratioButton );
			}
	}
				
	var switchLockRatio = function( value ) {
			// no argument value (undefined) = user set preference
			// 'check' value = 
			
			if ( !dialog.getContentElement( 'info', 'ratioLock' ) )	return null;

			// Check image ratio and original image ratio, but respecting user's preference.
			if ( value == 'check' ) {
				if ( !dialog.userlockRatio ) {
						var width = dialog.getValueOf( 'info', 'txtWidth' ),
							height = dialog.getValueOf( 'info', 'txtHeight' ),
							originalRatio = previewPreloader.$.naturalWidth * 1000 /  previewPreloader.$.naturalHeight,
							thisRatio = width * 1000 / height;
						dialog.lockRatio = false; // Default: unlock ratio

						if ( !width && !height ) dialog.lockRatio = true;
						else if ( !isNaN( originalRatio ) && !isNaN( thisRatio ) ) 
							if ( Math.round( originalRatio ) == Math.round( thisRatio ) )
								dialog.lockRatio = true;
				}
			} else if ( value !== undefined )
				dialog.lockRatio = value;
			else {
				dialog.userlockRatio = 1;			  // the user has defined a preference
				dialog.lockRatio = !dialog.lockRatio; // true <> false
			}

			var ratioButton = CKEDITOR.document.getById( btnLockSizesId );
			if ( dialog.lockRatio )	ratioButton.removeClass( 'cke_btn_unlocked' ); else ratioButton.addClass( 'cke_btn_unlocked' );

			// Ratio button hc presentation - WHITE SQUARE / BLACK SQUARE
			if ( CKEDITOR.env.hc ) {
				var icon = ratioButton.getChild( 0 );
				icon.setHtml( dialog.lockRatio ? CKEDITOR.env.ie ? '\u25A0' : '\u25A3' : CKEDITOR.env.ie ? '\u25A1' : '\u25A2' );
			}

			return dialog.lockRatio;
	};	


	// initialize width or height in the dialog (field txtWidth or txtHeight)
	var setupDimension = function( type, element ) {
					if ( type != IMAGE ) return;

					function checkDimension( size, defaultValue ) {
						var aMatch = size.match( regexGetSize );
						if ( aMatch ) {
							if ( aMatch[ 2 ] == '%' ) // % is allowed.
							{
								aMatch[ 1 ] += '%';
								switchLockRatio( false ); // Unlock ratio
							}
							return aMatch[ 1 ];
						}
						return defaultValue;
					}

					var value = '',
						dimension = ((this.id == 'txtWidth') ? 'width' : 'height'),
						size = element.getAttribute( dimension );

					if (size)	value = checkDimension( size, value );
					
					value = checkDimension( element.getStyle( dimension ), value );

					// set given dimension, or default natural width / height		
					if (value != '') this.setValue( value );
					else if (dimension == 'width') this.setValue( previewPreloader.$.naturalWidth );
											 else this.setValue( previewPreloader.$.naturalHeight );
	};
	
	
	var resetSize = function() {
						
			var widthField = dialog.getContentElement( 'info', 'txtWidth' ),
			heightField = dialog.getContentElement( 'info', 'txtHeight' );
						
			widthField && widthField.setValue( previewPreloader.$.naturalWidth );  
			heightField && heightField.setValue( previewPreloader.$.naturalHeight ); 
						
			updatePreview();  
	};	

			
	var onImgLoadEvent = function()	{
		// Image is ready.
		dialog.preview.setCustomData( 'isReady', 'true' );
		dialog.preview.removeListener( 'load', onImgLoadEvent );
		dialog.preview.removeListener( 'error', onImgLoadErrorEvent );
		dialog.preview.removeListener( 'abort', onImgLoadErrorEvent );

		// Hide loader
		CKEDITOR.document.getById( imagePreviewLoaderId ).setStyle( 'display', 'none' );

		// New image -> new dimensions
		resetSize();

/*		if ( this.firstLoad )
			CKEDITOR.tools.setTimeout( function(){switchLockRatio( 'check' );}, 0, this );
		this.firstLoad = false;*/
		
		// Possible fix for #12818.
		updatePreview();
	};

	var onImgLoadErrorEvent = function(){
		// Error. Image is not loaded.
		dialog.preview.removeListener( 'load', onImgLoadEvent );
		dialog.preview.removeListener( 'error', onImgLoadErrorEvent );
		dialog.preview.removeListener( 'abort', onImgLoadErrorEvent );

		// Set Error image.
		var noimage = CKEDITOR.getUrl( editor.skinPath + 'images/noimage.png' );

		if ( dialog.preview ) dialog.preview.setAttribute( 'src', noimage );

		// Hide loader
		CKEDITOR.document.getById( imagePreviewLoaderId ).setStyle( 'display', 'none' );
		
		switchLockRatio( false ); // Unlock.
	};
		
	
	var DispImgPView = function ( imgname ) {  //23.12.14 RL
	
        if ( imgname == editor.lang.mwplugin.tooManyResults || imgname == '' ) return;
		
        var LoadPreviewImage = function(result) {
            var url = result.responseText.Trim();
            if (! url) url = CKEDITOR.getUrl( editor.skinPath + 'images/noimage.png' );
            SrcInWiki = url;
            // Query the preloader to figure out the url impacted by based href.
            previewPreloader.setAttribute( 'src', url );
			dialog.preview.setAttribute( 'src', previewPreloader.$.src );
			updatePreview();
			dialog.preview.setAttribute( 'src', SrcInWiki );
        }
        window.parent.sajax_request_type = 'GET' ;
        window.parent.sajax_do_call( 'wfSajaxGetImageUrl', [imgname], LoadPreviewImage ) ; 
		
        // Show loader
		dialog.preview.removeStyle( 'display' );
		var loader = CKEDITOR.document.getById( imagePreviewLoaderId );
		if ( loader ) loader.setStyle( 'display', '' );

        dialog.preview.on( 'load', onImgLoadEvent, dialog );
		dialog.preview.on( 'error', onImgLoadErrorEvent, dialog );
		dialog.preview.on( 'abort', onImgLoadErrorEvent, dialog );
	}

	// Clear imgList
    var ClearSearch = function() {
        var	e = dialog.getContentElement( 'info', 'imgList' );
        e.items = [];
        var div = document.getElementById(e.domId),
            select = div.getElementsByTagName('select')[0];
        while ( select.options.length > 0 )
            select.remove( 0 )
    }
	
	// Clear Image preview
    var ClearImage = function() { //23.11.14 RL
        url = CKEDITOR.getUrl( editor.skinPath + 'images/noimage.png' );
        SrcInWiki = url;
        previewPreloader.setAttribute( 'src', url );
		dialog.preview.setAttribute( 'src', previewPreloader.$.src );
		updatePreview();
    }	
	
	// When imgFilename changes
    var OnUrlChange = function() {
		
		var SetSearchMessage = function ( message ) {
			message = editor.lang.mwplugin.searchLabel.replace(/%s/, message);
			var	e = dialog.getContentElement( 'info', 'imgList' ),
			label = document.getElementById(e.domId).getElementsByTagName('label')[0];
			label.innerHTML = message;
		}

		// Start searching images in db corresponding to imgFilename
        var StartSearch = function() {
			if ( imgname == '' ) ClearImage(); //23.12.14 RL
			
            SetSearchMessage( editor.lang.mwplugin.searching ) ;
            
            // Make an Ajax search for the pages.
            window.parent.sajax_request_type = 'GET' ;
            window.parent.sajax_do_call( 'wfSajaxSearchImageCKeditor', [imgname], LoadSearchResults ) ;
        }

		// Displaying the results of the search
		var LoadSearchResults = function(result) {
            var results = result.responseText.split( '\n' ),
                select = dialog.getContentElement( 'info', 'imgList' );

            ClearSearch() ;		

            if ( results.length == 0 || ( results.length == 1 && results[0].length == 0 ) ) // no image found
                SetSearchMessage( editor.lang.mwplugin.noImgFound ) ;
            else {
                if ( results.length == 1 ) {										// 1 image found
					SetSearchMessage( editor.lang.mwplugin.oneImgFound ) ;
					if (imgname == results[0]) DispImgPView(results[0]);	// if file name match, load it
				}
                else																// several images found
                    SetSearchMessage( results.length + editor.lang.mwplugin.manyImgFound ) ;
		
                for ( var i = 0 ; i < results.length ; i++ ) {		//imgList is filled from db
                    if (results[i] == '___TOO__MANY__RESULTS___')
                        select.add( editor.lang.mwplugin.tooManyResults );
                    else
                        select.add( results[i].replace(/_/g, ' '), results[i] );			
                }	
            }
        }

		var	imgname = dialog.getContentElement( 'info', 'imgFilename' ).getValue().Trim();

        if ( searchTimer ) window.clearTimeout( searchTimer ) ;

        if( /^(http|https):\/\//.test( imgname ) ) {
            SetSearchMessage( editor.lang.mwplugin.externalLink ) ;
            return ;
        }

        if ( imgname.length < 1  )
            SetSearchMessage( editor.lang.mwplugin.startTyping ) ;
        else {
            SetSearchMessage( editor.lang.mwplugin.searching ) ;
		    searchTimer = window.setTimeout( StartSearch, 500 ) ; // refresh search
		}
    }
	
    // return 0 create no image link, 1 image with local url, 2 image link with ext. url
    var createImageLink = function ( uri ) {
        uri = decodeURI( uri ).toLowerCase();
        // external link and wgAllowExternalImages is not set
        if (! uri.match(/^https?:\/\//))
            return 1;
        if (typeof window.parent.wgAllowExternalImages != 'undefined' &&
            window.parent.wgAllowExternalImages )
            return 2;
        if (typeof window.parent.wgAllowExternalImagesFrom != 'undefined') {
            for (var i = 0; i < window.parent.wgAllowExternalImagesFrom.length; i++ ) {
                if (uri.startsWith(window.parent.wgAllowExternalImagesFrom[i].toLowerCase()))
                    return 2;
            }
        }
        return 0;
    }
	
	var updatePreview = function() {
			//Don't load before onShow
			if ( !dialog.preview )
			return 1;

			// Read attributes and use it to update imagePreview
			dialog.commitContent( PREVIEW, dialog.preview );
			return 0;
	}
			
	// Custom commit dialog logic, that give inline style field (txtdlgGenStyle) 
	// higher priority to avoid overwriting styles contribute by other fields.
	// This style field is in 'advanced' tab of dialog, not presently integrated
	function commitContent() {
			var args = arguments;
			// var inlineStyleField = this.getContentElement( 'advanced', 'txtdlgGenStyle' ); 
			// inlineStyleField && inlineStyleField.commit.apply( inlineStyleField, args );

			this.foreach( function( widget ) {
				if ( widget.commit && widget.id != 'txtdlgGenStyle' )
					widget.commit.apply( widget, args );
				} );
	}
	
	
        return {
            title : editor.lang.mwplugin.imgTitle,
            minWidth : 420,
            minHeight : 310,
			contents : [
				{
					id : 'info', 
					label : 'Tab info',
					elements :
					[
                        {
                            type: 'hbox',
                            children: [
                                {
                                    type: 'vbox',
                                    style : 'width:95%;',
                                    children: [
                                        {
                                            id: 'imgFilename',
                                            type: 'text',
                                            label: imgLabelField,
                                            title: imgLabelField,
                                            style: 'border: 1px;',
                                            onKeyUp: function () { OnUrlChange(); },
                                            setup : function( type, element )
											{
												if ( type == IMAGE )
												{
													var url = element.getAttribute( '_fck_mw_filename' ) ||
                                                              element.getAttribute( '_cke_saved_src' ) ||
                                                              element.getAttribute( 'src' );
													var field = this;

													field.setValue( url );		// And call this.onChange()
													// Manually set the initial value.(#4191)
													field.setInitValue();
												}
											},
											commit : function( type, element )
											{
												if ( type == IMAGE && ( this.getValue() || this.isChanged() ) )
												{
                                                    var doImageLink = createImageLink( this.getValue() );
                                                    if ( doImageLink > 0) {
                                                        element.setAttribute( '_cke_saved_src', decodeURI( this.getValue() ) );
                                                        element.setAttribute( '_fck_mw_filename', decodeURI( this.getValue() ) );
                                                        if ( doImageLink > 1 )
                                                            element.setAttribute( 'src', decodeURI( this.getValue() ) );
                                                        else
                                                            element.setAttribute( 'src', SrcInWiki );
                                                    }
                                                    else
                                                        element.setAttribute( 'href', decodeURI( this.getValue() ) );
												}
												else if ( type == CLEANUP )
												{
													element.setAttribute( 'src', '' );	// If removeAttribute doesn't work.
													element.removeAttribute( 'src' );
                                                    element.setAttribute('href', '');
                                                    element.removeAttribute( 'href' );
												}
											},
											validate : CKEDITOR.dialog.validate.notEmpty( editor.lang.image.urlMissing )
                                        },

                                        {
                                            id: 'imgList',
                                            type: 'select',
                                            //size: 5,    //07.01.14 RL
                                            size: 11,     //07.01.14 RL
                                            label: editor.lang.mwplugin.startSearch,
                                            title: editor.lang.mwplugin.startSearchTitle,
                                            required: false,
                                            style: 'border: 1px; width:100%;',
                                            items: [  ],
                                            onChange: function () {
                                                    newImg = this.getValue(),
                                                    e = dialog.getContentElement( 'info', 'imgFilename' );
													if ( newImg == editor.lang.mwplugin.tooManyResults ) return;
													e.setValue(newImg.replace(/_/g, ' '));
													DispImgPView( newImg ); //23.12.14 RL
													}
                                        }
                                    ]
                                },
                                {
									type : 'vbox',
                                    style : 'width:60%; height:250px;',
									children :
									[
										{
											type : 'html',
											style : 'width:95%;',
											html : '<div>' + CKEDITOR.tools.htmlEncode( editor.lang.common.preview ) +'<br>'+
											'<div id="' + imagePreviewLoaderId + '" class="ImagePreviewLoader" style="display:none"><div class="loading">&nbsp;</div></div>'+
											'<div id="' + imagePreviewBoxId + '" class="ImagePreviewBox"><table><tr><td>'+
											'<a href="javascript:void(0)" target="_blank" onclick="return false;" id="' + previewLinkId + '">'+
											'<img id="' + previewImageId + '" alt="" /></a>' +
											'</td></tr></table></div></div>'
										}
									]	
                                }

                            ]
                        },
                        {
                            id: 'imgCaption',
                            type: 'text',
                            label: editor.lang.mwplugin.caption,
                            style: 'border: 1px;',
							onChange : function()
							{
								//updatePreview();
							},
							setup : function( type, element ) {
								if ( type == IMAGE )
									this.setValue( element.getAttribute( 'alt' ) );
							},
							commit : function( type, element ) {
								if ( type == IMAGE ) {
									if ( this.getValue() || this.isChanged() ) {
										element.setAttribute( 'alt',   this.getValue() );
										element.setAttribute( 'title', this.getValue() ); //31.01.15 RL
                                    }
								}
								else if ( type == PREVIEW ) {
									element.setAttribute( 'alt',   this.getValue() );
									element.setAttribute( 'title', this.getValue() ); //31.01.15 RL
								}
								else if ( type == CLEANUP ) {
									element.removeAttribute( 'alt' );
									element.removeAttribute( 'title' ); //31.01.15 RL
								}
							}
                        },
                       { //31.12.14 RL
                            id: 'imgLink',
                            type: 'text',
                            label : editor.lang.mwplugin.img_link_title, 
                            title : editor.lang.mwplugin.img_link_title,
                            style: 'border: 1px;',
							onChange : function()
							{
								// ...
							},
							setup : function( type, element ) {
								if ( type == IMAGE )
									this.setValue( element.getAttribute( 'link' ) );
							},
							commit : function( type, element ) {
								var linkTxt =this.getValue();
								linkTxt = linkTxt.trim();
								if ( type == IMAGE ) {
									if ( linkTxt || this.isChanged() ) {
										element.setAttribute( 'link', linkTxt );
                                    }
								}
								else if ( type == PREVIEW )
									element.setAttribute( 'link', linkTxt );
								else if ( type == CLEANUP )
									element.removeAttribute( 'link' );
							}
                        },
                        { //31.12.14 RL
                            id : 'linkDisabled',
                            type : 'checkbox',
                            label : editor.lang.mwplugin.img_link_disable, 
                            title : editor.lang.mwplugin.img_link_disable,
                            'default' : false,
							onChange : function()
							{
								//alert('linkDisabled:');
							},
							setup : function( type, element ) {
								if ( type == IMAGE )
									this.setValue( element.getAttribute( 'no-link' ) == "1" );
							},
							commit : function( type, element ) {
								var linkDisabled = this.getValue();
								if ( type == IMAGE || type == PREVIEW ) {
									if ( linkDisabled  ) { //|| this.isChanged()
										element.setAttribute( 'no-link', "1" );
                                    } else {
										element.removeAttribute( 'no-link' );
									}
								}
								else if ( type == CLEANUP )
									element.removeAttribute( 'no-link' );
							}							
                        },
                        {
                            type: 'hbox',
                            children:
                                [
                                    {
                                        id: 'imgSpecialType',
                                        type: 'select',
                                        label: editor.lang.mwplugin.imgType,
                                        items: [
                                            [ editor.lang.common.notSet, ' ' ],                    //07.01.14 RL->
                                            [ editor.lang.mwplugin.imgTypeThumb,    'Thumbnail' ],
                                            [ editor.lang.mwplugin.imgTypeFrame,    'Frame' ],
											[ editor.lang.mwplugin.imgTypeFrameless,'Frameless' ],
                                            [ editor.lang.mwplugin.imgTypeBorder,   'Border' ]     //07.01.14 RL<-
                                        ],
                                        setup : function( type, element ) {
                                            var imgType = element.getAttribute( '_fck_mw_type') || '',
                                                typeName = {
                                                    thumb      : 'Thumbnail', 
                                                    frame      : 'Frame',     
													frameless  : 'Frameless',                      //07.01.14 RL
                                                    border     : 'Border'
                                                }
                                            if ( type == IMAGE && imgType )
                                                this.setValue( typeName[imgType] );
                                        },
                                        commit : function( type, element ) {
                                            if ( type == IMAGE ) {
                                                if ( this.getValue() || this.isChanged() ) {
                                                    switch (this.getValue()) {
                                                        case 'Thumbnail':
                                                            element.setAttribute('_fck_mw_type', 'thumb');
                                                            element.removeClass('fck_mw_border');
                                                            element.addClass('fck_mw_frame');
                                                            break;
                                                        case 'Frame' :
                                                            element.setAttribute('_fck_mw_type', 'frame');
                                                            element.removeClass('fck_mw_border');
                                                            element.addClass('fck_mw_frame');
                                                            break;
                                                        case 'Frameless' :                         //07.01.14 RL->
                                                            element.setAttribute('_fck_mw_type', 'frameless');
                                                            element.removeClass('fck_mw_border');
                                                            element.removeClass('fck_mw_frame');
                                                            break;                                 //07.01.14 RL<-
														case 'Border' :
                                                            element.setAttribute('_fck_mw_type', 'border');
                                                            element.removeClass('fck_mw_frame');
                                                            element.addClass('fck_mw_border');
                                                            break;
                                                        default:
                                                            element.setAttribute('_fck_mw_type', '');
                                                            element.removeClass('fck_mw_border');
                                                            element.addClass('fck_mw_frame');
                                                    }
                                                }
                                            }
                                            else if ( type == CLEANUP )
                                                element.setAttribute('_fck_mw_type', '');
                                        }
                                    },
                                    {
                                        id: 'imgAlign',
                                        type: 'select',
                                        label: editor.lang.common.align, 
                                        items: [
											[ editor.lang.common.notSet,     ' '      ],
											[ editor.lang.common.alignNone,  'None'   ], 										
                                            [ editor.lang.common.alignLeft,  'Left'   ],
                                            [ editor.lang.common.alignCenter,'Center' ],
											[ editor.lang.common.alignRight, 'Right'  ]
                                        ],
                                        setup : function( type, element ) {
											//var className = element.getAttribute( 'class') || '',            //07.01.14 RL  
                                            //  align = className.replace(/fck_mw_(right|left|center)/, '$1'); //07.01.14 RL
											var align = element.getAttribute( '_fck_mw_location') || '';       //07.01.14 RL
											if ( type == IMAGE && align )
												this.setValue( align.FirstToUpper() );
                                        },
                                        commit : function( type, element ) {
                                            if ( type == IMAGE ) {
                                                if ( this.getValue() || this.isChanged() ) {
                                                    var newVal = this.getValue().toLowerCase().Trim(),
                                                        classes = [ 'none', 'right', 'left', 'center' ];
                                                    if ( newVal ) {
                                                        for (var i = 0; i < classes.length; i++ ) {
                                                            if ( newVal == classes[i] ) {
                                                                element.addClass('fck_mw_' + classes[i]);
																element.addClass('float' + classes[i]);
															}
                                                            else {
                                                                element.removeClass('fck_mw_' + classes[i]);
																element.removeClass('float' + classes[i]);
															}
                                                        }
                                                        element.setAttribute('_fck_mw_location', newVal);
                                                    }
                                                    else {
														for (var i = 0; i < classes.length; i++ ) {
															element.removeClass('fck_mw_' + classes[i]);
															element.removeClass('float' + classes[i]);
                                                        }														
														if ( element.hasAttribute( '_fck_mw_location' ) ) {
															element.removeAttribute( '_fck_mw_location' );
														}
													}
                                                }
                                            } else if ( type == CLEANUP )
                                                if ( element.hasAttribute( '_fck_mw_location' ) )
													element.removeAttribute( '_fck_mw_location' );
											}
                                    },
                                    { //31.12.14 RL
                                        id: 'imgVAlign',
                                        type: 'select',
                                        label: editor.lang.mwplugin.imgVertAlign,
                                        items: [
											[ editor.lang.common.notSet,           ' ' ],          
                                            [ editor.lang.mwplugin.img_super,      'Super' ],
											[ editor.lang.mwplugin.img_baseline,   'Baseline' ], 
                                            [ editor.lang.mwplugin.img_sub,        'Sub' ],  
											[ editor.lang.mwplugin.img_top,        'Top' ],
											[ editor.lang.mwplugin.img_text_top,   'Text-top' ],
											[ editor.lang.mwplugin.img_middle,     'Middle' ],
											[ editor.lang.mwplugin.img_text_bottom,'Text-bottom' ],
											[ editor.lang.mwplugin.img_bottom,     'Bottom' ]
                                        ],
                                        setup : function( type, element ) {
											//var valign = element.getStyle( 'vertical-align' ) || '';
											var valign = element.getAttribute( '_fck_mw_vertical-align' ) || '';
											if ( type == IMAGE && valign ) {
												this.setValue( valign.FirstToUpper() );
											}
                                        },
                                        commit : function( type, element ) {
                                            if ( type == IMAGE ) {
                                                if ( this.getValue() || this.isChanged() ) {
                                                    var newVal = this.getValue().toLowerCase().Trim();
                                                    if ( newVal ) {
														element.$.style.verticalAlign = newVal;                   //For wysiwyg
														element.setAttribute( '_fck_mw_vertical-align', newVal ); //For MW
													}
                                                    else {
														//element.$.style.removeProperty( 'vertical-align' );
														element.$.style.verticalAlign = 'middle';                 //Set default of MW for wysiwyg
														if ( element.hasAttribute( '_fck_mw_vertical-align' ) ) {
															element.removeAttribute( '_fck_mw_vertical-align' );  //For MW
														}
                                                    }
                                                }
                                            } else if ( type == CLEANUP )
                                                if ( element.hasAttribute( '_fck_mw_vertical-align' ) ) 
													element.removeAttribute( '_fck_mw_vertical-align' );
                                        }
                                    },
									{ //31.12.14 RL
										id : 'sizeUpright',
										type : 'checkbox',
										label : editor.lang.mwplugin.img_upright, 
										title : editor.lang.mwplugin.img_upright,
										'default' : false,
										onChange : function() // upright => remove dimensions
										{
											dialog.setValueOf( 'info', 'txtWidth', '' );
											dialog.setValueOf( 'info', 'txtHeight', '' );
										},
										setup : function( type, element ) {
											if ( type == IMAGE )
												this.setValue( element.getAttribute( '_fck_mw_upright' ) == "1" );
										},
										commit : function( type, element ) {
											var linkDisabled = this.getValue();
											if ( type == IMAGE || type == PREVIEW ) {
												if ( linkDisabled  ) { //|| this.isChanged()
													element.setAttribute( '_fck_mw_upright', "1" );
												} else {
													element.removeAttribute( '_fck_mw_upright' );
												}
											}
											else if ( type == CLEANUP )
												element.removeAttribute( '_fck_mw_upright' );
										}							
									},									
                                    {
                                        id: 'txtWidth',
                                        type: 'text',
                                        //label: editor.lang.image.width,   //07.01.14 RL
                                        label: editor.lang.common.width,    //07.01.14 RL
                                        size: '4',
                                        setup : setupDimension,
										onKeyUp: onSizeChange,
                                        commit : function( type, element, internalCommit ) {
											var value = this.getValue();
											if ( type == IMAGE )
											{
												if ( value )
													element.setStyle( 'width', CKEDITOR.tools.cssLength( value ) );	
												else if ( !value && this.isChanged( ) )
													element.removeStyle( 'width' );
                                                
												if ( !internalCommit ) {        //26.08.14 
													element.removeAttribute( 'width' ); 
												}
											}
											else if ( type == PREVIEW )
											{
												var aMatch = value.match( regexGetSize );
												if ( !aMatch )
													element.setStyle( 'width',  previewPreloader.$.naturalWidth + 'px');
												else
													element.setStyle( 'width', CKEDITOR.tools.cssLength( value ) );
											}
											else if ( type == CLEANUP )
											{
												element.removeAttribute( 'width' );
												element.removeStyle( 'width' );
											}
										}

                                    },
                                    {
                                        id: 'txtHeight',
                                        type: 'text',
                                        //label: editor.lang.image.height,   //07.01.14 RL
                                        label: editor.lang.common.height,    //07.01.14 RL
                                        size: '4',
                                        setup : setupDimension,
										onKeyUp: onSizeChange,
										commit : function( type, element, internalCommit )
										{
											var value = this.getValue();
											if ( type == IMAGE )
											{
												if ( value )
													element.setStyle( 'height', CKEDITOR.tools.cssLength( value ) );
												else if ( !value && this.isChanged( ) )
													element.removeStyle( 'height' );

												if ( !internalCommit ) {        //26.08.14 
													element.removeAttribute( 'height' );
												}
											}
											else if ( type == PREVIEW )
											{
												var aMatch = value.match( regexGetSize );
												if ( !aMatch )
												{
													element.setStyle( 'height', previewPreloader.$.naturalHeight + 'px' );
												}
												else
													element.setStyle( 'height',  CKEDITOR.tools.cssLength( value ) );
											}
											else if ( type == CLEANUP )
											{
												element.removeAttribute( 'height' );
												element.removeStyle( 'height' );
											}
										}

                                    },
									{
										id: 'ratioLock',
										type: 'html',
										style: 'margin-top:30px;width:40px;height:40px;',
										onLoad: SetupRatioLock,
										html: '<div>' +
											'<a href="javascript:void(0)" tabindex="-1" title="' + editor.lang.image.lockRatio +
											'" class="cke_btn_locked" id="' + btnLockSizesId + '" role="checkbox"><span class="cke_icon"></span><span class="cke_label">' + editor.lang.image.lockRatio + '</span></a>' +
											'<a href="javascript:void(0)" tabindex="-1" title="' + editor.lang.image.resetSize +
											'" class="cke_btn_reset" id="' + btnResetSizeId + '" role="button"><span class="cke_label">' + editor.lang.image.resetSize + '</span></a>' +
											'</div>'
									}

                                ]
                        }
                    ]
                }
            ],

            onOk : function() {

                if (this.imageEditMode && this.imageEditMode == "img" ) {
					// get back imageElement from the buffer
                    this.imageElement = this.cleanImageElement;
					delete this.cleanImageElement;
                }
                else 
                    this.imageElement = editor.document.createElement( 'img' );

                // Set attributes.
				this.commitContent( IMAGE, this.imageElement );

                // Change the image element into a link when it's an external URL				
                if ( this.imageElement.getAttribute('href') ) {
                    var link = editor.document.createElement( 'a' );
                    link.setAttribute('href', this.imageElement.getAttribute('href'));
                    var text = this.imageElement.getAttribute('alt') || this.imageElement.getAttribute('href');
                    link.setText( text );
                    this.imageElement = link;
                }
				/******* //31.12.14 RL Do not overwrite any of user made settings.
                else {
                    // set some default classes for alignment and border if this is not defined
                    var attrClass = this.imageElement.getAttribute('class');
                    if ( !( attrClass && attrClass.match(/fck_mw_(frame|frameless|border)/) ) )  //07.01.14 Added frameless
                        this.imageElement.addClass('fck_mw_border');
                    if ( !( attrClass && attrClass.match(/fck_mw_(left|right|center)/) ) )
                        this.imageElement.addClass('fck_mw_right');
                }
				********/ 
				
				// if size is the same as original, no need to attribute a size
				if (this.imageElement.$.width == previewPreloader.$.naturalWidth
				 && this.imageElement.$.height == previewPreloader.$.naturalHeight)
					 var has_original_size = true;
				else var has_original_size = false;
				
				if ( this.imageElement.getAttribute('_fck_mw_upright') || has_original_size) {	//31.12.14 RL
					// Check-box upright overrules width/height in this dialog.
					this.imageElement.removeAttribute('width');
					this.imageElement.removeAttribute('height');
					this.imageElement.$.style.removeProperty( 'width' );  //For IE
					this.imageElement.$.style.removeProperty( 'height' ); //For IE
                }

                // Remove empty style attribute.
				if ( !this.imageElement.getAttribute( 'style' ) )
					this.imageElement.removeAttribute( 'style' );

                // Insert a new Image.
				if ( !this.imageEditMode )
					editor.insertElement( this.imageElement );
            },

    		onShow : function()
        	{
				dialog = this;
				dialog.imageElement = false;
				dialog.imageEditMode = false; 	// Default: create a new element.
				dialog.lockRatio = true;		// Default : lock ratio
				dialog.userlockRatio = 0;		// The user has not yet set ratio preference
				// dialog.firstLoad = true;	
                
                // clear old selection list from a previous call
				ClearSearch();			
                // and set correct label for image list
				var editor = this.getParentEditor(),
					message = editor.lang.mwplugin.searchLabel.replace(/%s/, editor.lang.mwplugin.startTyping),
					e = this.getContentElement( 'info', 'imgList' );  
				label = document.getElementById(e.domId).getElementsByTagName('label')[0];
                label.innerHTML = message;

                var element = editor.getSelection().getSelectedElement();

                // Hide loader.
				CKEDITOR.document.getById( imagePreviewLoaderId ).setStyle( 'display', 'none' );
				
				// Create the preview before setup the dialog contents.
				previewPreloader = new CKEDITOR.dom.element( 'img', editor.document );
				dialog.preview = CKEDITOR.document.getById( previewImageId );

				// Check if an image -and not a fake element- is selected (=> edit mode)
				// or if dialog comes from a file input -> which case ??
				if ( element && element.getName() == 'img' && !element.getAttribute( 'data-cke-realelement' )
					|| element && element.getName() == 'input' && element.getAttribute( 'type' ) == 'image' )
				{
					dialog.imageEditMode = element.getName();
					dialog.imageElement = element;
					SrcInWiki = element.getAttribute( 'src' );			
				}

				if ( dialog.imageEditMode )
				{	// Use the original element as a buffer from  since we don't want
					// temporary changes to be committed, e.g. if the dialog is canceled.
					dialog.cleanImageElement = dialog.imageElement;
					dialog.imageElement = dialog.cleanImageElement.clone( true, true );
					
					// load image immediately (no need Ajax call)
					previewPreloader.setAttribute( 'src', SrcInWiki );
					dialog.preview.setAttribute( 'src', previewPreloader.$.src );

					// Fill out all fields & preview
					dialog.setupContent( IMAGE, dialog.imageElement );
					updatePreview();
				}
				else
					dialog.imageElement =  editor.document.createElement( 'img' );

				// Refresh LockRatio button
				switchLockRatio( true );	
			},
			
			onHide : function()
			{
				if ( this.preview )
				{
					this.commitContent( CLEANUP, this.preview );	// clean form fields
					this.preview.removeListener( 'load', onImgLoadEvent );
					this.preview.removeListener( 'error', onImgLoadErrorEvent );
					this.preview.removeListener( 'abort', onImgLoadErrorEvent );
					this.preview = false;		// Dialog is closed.
				}

				delete this.imageElement;
			}
        }
}
} );
