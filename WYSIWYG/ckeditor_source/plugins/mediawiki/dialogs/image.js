CKEDITOR.dialog.add( 'MWImage', function( editor ) {
{
	// Load image preview.
	var IMAGE = 1,
		LINK = 2,
		PREVIEW = 4,
		CLEANUP = 8,
		regexGetSize = /^\s*(\d+)((px)|\%)?\s*$/i,
		regexGetSizeOrEmpty = /(^\s*(\d+)((px)|\%)?\s*$)|^$/i,
		pxLengthRegex = /^\d+px$/,
		SrcInWiki,
        imgLabelField = (window.parent.wgAllowExternalImages || window.parent.wgAllowExternalImagesFrom )
            ? editor.lang.mwplugin.fileNameExtUrl
            : editor.lang.mwplugin.fileName;

	var onImgLoadEvent = function()	{
		// Image is ready.
		var original = this.originalElement;
		original.setCustomData( 'isReady', 'true' );
		original.removeListener( 'load', onImgLoadEvent );
		original.removeListener( 'error', onImgLoadErrorEvent );
		original.removeListener( 'abort', onImgLoadErrorEvent );

		// Hide loader
		CKEDITOR.document.getById( imagePreviewLoaderId ).setStyle( 'display', 'none' );

		// New image -> new dimensions
		if ( !this.dontResetSize )
			resetSize( this );

		if ( this.firstLoad )
			CKEDITOR.tools.setTimeout( function(){switchLockRatio( this, 'check' );}, 0, this );

		this.firstLoad = false;
		this.dontResetSize = false;
	};

	var onImgLoadErrorEvent = function(){
		// Error. Image is not loaded.
		var original = this.originalElement;
		original.removeListener( 'load', onImgLoadEvent );
		original.removeListener( 'error', onImgLoadErrorEvent );
		original.removeListener( 'abort', onImgLoadErrorEvent );

		// Set Error image.
		var noimage = CKEDITOR.getUrl( editor.skinPath + 'images/noimage.png' );

		if ( this.preview )
			this.preview.setAttribute( 'src', noimage );

		// Hide loader
		CKEDITOR.document.getById( imagePreviewLoaderId ).setStyle( 'display', 'none' );
	};

    var searchTimer,
        searchLabel = editor.lang.mwplugin.searchLabel,
        numbering = function( id )
		{
			return CKEDITOR.tools.getNextId() + '_' + id;
		},
		imagePreviewLoaderId = numbering( 'ImagePreviewLoader' ),
		imagePreviewBoxId = numbering( 'ImagePreviewBox' ),
		previewLinkId = numbering( 'previewLink' ),
		previewImageId = numbering( 'previewImage' );

    var previewPreloader;
	
    var ClearImage = function( dialog ) { //23.11.14 RL
        url = CKEDITOR.getUrl( editor.skinPath + 'images/noimage.png' );
        SrcInWiki = url;
        previewPreloader.setAttribute( 'src', url );
		dialog.preview.setAttribute( 'src', previewPreloader.$.src );
		updatePreview( dialog );
    }	
    
    var GetImageUrl = function( dialog, img ) {
        var LoadPreviewImage = function(result) {
            var url;
			if (typeof result.responseText != 'undefined')         // 22.02.16 RL            
				url = result.responseText.Trim();
			else
				url = result.Trim(); // 22.02.16 RL

            if (! url)
                url = CKEDITOR.getUrl( editor.skinPath + 'images/noimage.png' );
            SrcInWiki = url;
            // Query the preloader to figure out the url impacted by based href.
            previewPreloader.setAttribute( 'src', url );
			dialog.preview.setAttribute( 'src', previewPreloader.$.src );
			updatePreview( dialog );
        }
        // window.parent.sajax_request_type = 'GET'; // 22.02.16 RL
        // window.parent.sajax_do_call( 'wfSajaxGetImageUrl', [img], LoadPreviewImage ); // 22.06.16 RL
		window.parent.$.get( mw.util.wikiScript(), { // 22.02.16 RL
				action: 'ajax', 
				rs: 'wfSajaxGetImageUrl', 
				rsargs: [img] 
				},
				LoadPreviewImage
			); 	

    }

	var DispImgPView = function ( dialog, img ) {  //23.12.14 RL
	
        if ( img == editor.lang.mwplugin.tooManyResults || img == '' ) return;

        GetImageUrl( dialog, img );

        var original = dialog.originalElement;

		dialog.preview.removeStyle( 'display' );

		original.setCustomData( 'isReady', 'false' );
        // Show loader
		var loader = CKEDITOR.document.getById( imagePreviewLoaderId );
		if ( loader )
            loader.setStyle( 'display', '' );

        original.on( 'load', onImgLoadEvent, dialog );
		original.on( 'error', onImgLoadErrorEvent, dialog );
		original.on( 'abort', onImgLoadErrorEvent, dialog );
		original.setAttribute( 'src', img );
	}

    var updatePreview = function( dialog ) {
		//Don't load before onShow.
		if ( !dialog.originalElement || !dialog.preview )
			return 1;

		// Read attributes and update imagePreview;
		dialog.commitContent( PREVIEW, dialog.preview );
		return 0;
	}

    var SetSearchMessage = function ( dialog, message ) {
        message = searchLabel.replace(/%s/, message);
        var	e = dialog.getContentElement( 'mwImgTab1', 'imgList' ),
        label = document.getElementById(e.domId).getElementsByTagName('label')[0];
        e.html = message;
        label.innerHTML = message;
    }

    var ClearSearch = function(dialog) {
        var	e = dialog.getContentElement( 'mwImgTab1', 'imgList' );
        e.items = [];
        var div = document.getElementById(e.domId),
            select = div.getElementsByTagName('select')[0];
        while ( select.options.length > 0 )
            select.remove( 0 )
    }

    var OnUrlChange = function( dialog ) {

        //var dialog = this.getDialog();

        var StartSearch = function() {
            var	e = dialog.getContentElement( 'mwImgTab1', 'imgFilename' ),
                link = e.getValue().Trim();
            
			if ( link == '' ) ClearImage( dialog ); //23.12.14 RL
			
            SetSearchMessage( dialog, editor.lang.mwplugin.searching ) ;
            
            // Make an Ajax search for the pages.
            // window.parent.sajax_request_type = 'GET' ; // 22.02.16 RL
            // window.parent.sajax_do_call( 'wfSajaxSearchImageCKeditor', [link], LoadSearchResults ); // 22.02.16 RL
			window.parent.$.get( mw.util.wikiScript(), { // 22.02.16 RL
					action: 'ajax', 
					rs: 'wfSajaxSearchImageCKeditor', 
					rsargs: [link] 
					},
					LoadSearchResults
				); 	
        }

        var LoadSearchResults = function(result) {
            var results,
                select = dialog.getContentElement( 'mwImgTab1', 'imgList' );

			if (typeof result.responseText != 'undefined')  // 22.02.16 RL  
				results = result.responseText.split( '\n' );
			else
				results = result.split( '\n' );             // 22.02.16 RL

            ClearSearch(dialog) ;

            if ( results.length == 0 || ( results.length == 1 && results[0].length == 0 ) ) {
                SetSearchMessage( dialog, editor.lang.mwplugin.noImgFound ) ;
            }
            else {
                if ( results.length == 1 )
                    SetSearchMessage( dialog, editor.lang.mwplugin.oneImgFound ) ;
                else
                    SetSearchMessage( dialog, results.length + editor.lang.mwplugin.manyImgFound ) ;

                for ( var i = 0 ; i < results.length ; i++ ) {
                    if (results[i] == '___TOO__MANY__RESULTS___')
                        select.add ( editor.lang.mwplugin.tooManyResults );
                    else
                        select.add ( results[i].replace(/_/g, ' '), results[i] );

                }
            }

        }

        var e = dialog.getContentElement( 'mwImgTab1', 'imgFilename' ),
        link = e.getValue().Trim();

        if ( searchTimer )
            window.clearTimeout( searchTimer ) ;

        if( /^(http|https):\/\//.test( link ) ) {
            SetSearchMessage( dialog, editor.lang.mwplugin.externalLink ) ;
            return ;
        }

        if ( link.length < 1  )
            SetSearchMessage( dialog, editor.lang.mwplugin.startTyping ) ;
        else
            SetSearchMessage( dialog, editor.lang.mwplugin.searching ) ;
        searchTimer = window.setTimeout( StartSearch, 500 ) ;

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
        return {
            title : editor.lang.mwplugin.imgTitle,
            minWidth : 420,
            minHeight : 310,
			contents : [
				{
					id : 'mwImgTab1', 
					label : 'Tab info',
					elements :
					[
                        {
                            type: 'hbox',
                            children: [
                                {
                                    type: 'vbox',
                                    style : 'width:40%;',
                                    children: [
                                        {
                                            id: 'imgFilename',
                                            type: 'text',
                                            label: imgLabelField,
                                            title: imgLabelField,   
                                            style: 'border: 1px;',
                                            onKeyUp: function () {
                                                OnUrlChange( this.getDialog() );
                                            },
                                            setup : function( type, element )
											{
												if ( type == IMAGE )
												{
													var url = element.getAttribute( '_fck_mw_filename' ) ||
                                                              element.getAttribute( '_cke_saved_src' ) ||
                                                              element.getAttribute( 'src' );
													var field = this;

													this.getDialog().dontResetSize = true;

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
                                                    else {
                                                        element.setAttribute( 'href', decodeURI( this.getValue() ) );
                                                    }
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
                                            title: editor.lang.mwplugin.startSearchTitle, // 'image list'
                                            required: false,
                                            style: 'border: 1px; width:100%;',
                                            items: [  ],
                                            onChange: function () {
                                                var dialog = this.getDialog(),
                                                    newImg = this.getValue(),
                                                    e = dialog.getContentElement( 'mwImgTab1', 'imgFilename' );
                                                if ( newImg == editor.lang.mwplugin.tooManyResults ) return;
                                                e.setValue(newImg.replace(/_/g, ' '));
												DispImgPView( dialog, newImg); //23.12.14 RL
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
								//updatePreview( this.getDialog() );
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
								//alert('imgLink:');
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
                                        //07.01.14 RL  label: editor.lang.image.align,
                                        label: editor.lang.common.align,        //07.01.14 RL
                                        items: [
                                            /*07.01.14 RL->****
                                            [ ' ' ],
                                            [ editor.lang.image.alignRight, 'Right' ],
                                            [ editor.lang.image.alignLeft , 'Left' ],
                                            [ editor.lang.mwplugin.alignCenter, 'Center' ]
                                            ****/
											[ editor.lang.common.notSet,     ' '      ],
											[ editor.lang.common.alignNone,  'None'   ], //31.12.14 RL											
                                            [ editor.lang.common.alignLeft,  'Left'   ],
                                            [ editor.lang.common.alignCenter,'Center' ],
											[ editor.lang.common.alignRight, 'Right'  ]
                                            /*07.01.14 RL<-*/
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
                                            }
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
                                            }
                                        }
                                    },
									{ //31.12.14 RL
										id : 'sizeUpright',
										type : 'checkbox',
										label : editor.lang.mwplugin.img_upright, 
										title : editor.lang.mwplugin.img_upright,
										'default' : false,
										onChange : function()
										{
											//alert('linkDisabled:');
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
                                        id: 'imgWidth',
                                        type: 'text',
                                        //label: editor.lang.image.width,   //07.01.14 RL
                                        label: editor.lang.common.width,    //07.01.14 RL
                                        size: '4',
                                        setup : function( type, element ) {
                                            var imgWidth = '',  //element.getAttribute( '_fck_mw_width') || '', //30.12.14 RL, 10.01.14 RL	
												imgStyle = element.getAttribute( 'style') || '',            
                                                match = /(?:^|\s)width\s*:\s*(\d+)/i.exec( imgStyle ),
                                                imgStyleWidth = match && match[1] || 0,
												imgRealWidth  = ( element.getAttribute( 'width' ) || '' ) + ''; //10.01.14 RL
												//imgOrigWidth  = ( element.getAttribute( '_fck_mw_origimgwidth' ) || '' ) + ''; //31.12.14 RL
													
											if ( imgStyleWidth.length > 0 )     //10.01.14 RL->
												imgWidth = imgStyleWidth;                                        
											else if ( imgRealWidth.length > 0 ) //26.08.14
												imgWidth = imgRealWidth;        //10.01.14 RL<-
											//else if ( imgOrigWidth.length > 0 )
											//    imgWidth = imgOrigWidth;
											
                                            if ( type == IMAGE && imgWidth )    //10.01.14 RL Was imgStyleWidth
                                                this.setValue( imgWidth );		//10.01.14 RL Was imgStyleWidth		
                                        },
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
												{
													var oImageOriginal = this.getDialog().originalElement;
													if ( oImageOriginal.getCustomData( 'isReady' ) == 'true' )
														element.setStyle( 'width',  oImageOriginal.$.width + 'px');
												}
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
                                        id: 'imgHeight',
                                        type: 'text',
                                        //label: editor.lang.image.height,   //07.01.14 RL
                                        label: editor.lang.common.height,    //07.01.14 RL
                                        size: '4',
                                        setup : function( type, element ) {
                                            var imgHeight = '' //element.getAttribute( '_fck_mw_height') || '',    //30.12.14 RL, 10.01.14 RL
												imgStyle = element.getAttribute( 'style') || '',             
                                                match = /(?:^|\s)height\s*:\s*(\d+)/i.exec( imgStyle ),      
                                                imgStyleHeight = match && match[1] || 0,
												imgRealHeight  = ( element.getAttribute( 'height' ) || '' ) + '';  //10.01.14 RL
												//imgOrigHeight  = ( element.getAttribute( '_fck_mw_origimgheight' ) || '' ) + ''; //31.12.14 RL

											if ( imgStyleHeight.length > 0 )     //10.01.14 RL->
												imgHeight = imgStyleHeight;
											else if ( imgRealHeight.length > 0 ) //26.08.14
												imgHeight = imgRealHeight;       //10.01.14 RL<-
											//else if ( imgOrigHeight.length > 0 )
											//	imgHeight = imgOrigHeight;
								
                                            if ( type == IMAGE && imgHeight )	 //10.01.14 RL Was imgStyleHight
                                                this.setValue( imgHeight ); 	 //10.01.14 RL Was imgStyleHight
                                        },
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
													var oImageOriginal = this.getDialog().originalElement;
													if ( oImageOriginal.getCustomData( 'isReady' ) == 'true' )
														element.setStyle( 'height', oImageOriginal.$.height + 'px' );
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
                                        type: 'html',
                                        width: '100%',
                                        html: ''
                                    }
                                ]
                        }
                    ]
                }
            ],

            onOk : function() {

                if (this.imageEditMode && this.imageEditMode == "img" ) {
                    this.imageElement = this.cleanImageElement;
					delete this.cleanImageElement;
                }
                else {
                    this.imageElement = editor.document.createElement( 'img' );
                }
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
				/****** //31.12.14 RL Do not overwrite any of user made settings.
                else {
                    // set some default classes for alignment and border if this is not defined
                    var attrClass = this.imageElement.getAttribute('class');
                    if ( !( attrClass && attrClass.match(/fck_mw_(frame|frameless|border)/) ) )  //07.01.14 Added frameless
                        this.imageElement.addClass('fck_mw_border');
                    if ( !( attrClass && attrClass.match(/fck_mw_(left|right|center)/) ) )
                        this.imageElement.addClass('fck_mw_right');
                }
				********/
				
				if ( this.imageElement.getAttribute('_fck_mw_upright') ) { //31.12.14 RL
					// Check-box upright overrules width/height in this dialog.
					// I was unable to find out how width/height elements of dialog could be accessed from
					// upright element, so remove width and height here.
					this.imageElement.removeAttribute('width');
					this.imageElement.removeAttribute('height');
					this.imageElement.$.style.removeProperty( 'width' );  //For IE
					this.imageElement.$.style.removeProperty( 'height' ); //For IE
                }

                // Remove empty style attribute.
				if ( !this.imageElement.getAttribute( 'style' ) ) {
					this.imageElement.removeAttribute( 'style' );
				}

                // Insert a new Image.
				if ( !this.imageEditMode )
				{
					editor.insertElement( this.imageElement );
				}
            },

    		onShow : function()
        	{
                this.imageEditMode = false;
                this.dontResetSize = false;
                
                // clear old selection list from a previous call
                var	e = this.getContentElement( 'mwImgTab1', 'imgList' );
                    e.items = [];
                var div = document.getElementById(e.domId),
                    select = div.getElementsByTagName('select')[0];
                while ( select.options.length > 0 )
                    select.remove( 0 );
                // and set correct label for image list
                e = this.getContentElement( 'mwImgTab1', 'imgList' ),
                    label = document.getElementById(e.domId).getElementsByTagName('label')[0];
                var editor = this.getParentEditor(),
                    message = editor.lang.mwplugin.searchLabel.replace(/%s/, editor.lang.mwplugin.startTyping);
                e.html = message;
                label.innerHTML = message;

                var selection = editor.getSelection(),
    				element = selection.getSelectedElement();

                // Hide loader.
				CKEDITOR.document.getById( imagePreviewLoaderId ).setStyle( 'display', 'none' );
				// Create the preview before setup the dialog contents.
				previewPreloader = new CKEDITOR.dom.element( 'img', editor.document );
				this.preview = CKEDITOR.document.getById( previewImageId );

                // Copy of the image
				this.originalElement = editor.document.createElement( 'img' );
				this.originalElement.setAttribute( 'alt', '' );
				this.originalElement.setCustomData( 'isReady', 'false' );

				if ( element && element.getName() == 'img' && !element.getAttribute( 'data-cke-realelement' )
					|| element && element.getName() == 'input' && element.getAttribute( 'type' ) == 'image' )
				{
					this.imageEditMode = element.getName();
					this.imageElement = element;
					SrcInWiki = element.getAttribute( 'src' );
					OnUrlChange( this ); //23.12.14 RL imgList contains only name of existing image					
				}
                else {
					OnUrlChange( this ); //imgList is filled from db
                }

				if ( this.imageEditMode )
				{	// Use the original element as a buffer from  since we don't want
					// temporary changes to be committed, e.g. if the dialog is canceled.
					this.cleanImageElement = this.imageElement;
					this.imageElement = this.cleanImageElement.clone( true, true );
					// Fill out all fields.
					this.setupContent( IMAGE, this.imageElement );
				}
				else
					this.imageElement =  editor.document.createElement( 'img' );

				// Dont show preview if no URL given.
				if ( !CKEDITOR.tools.trim( this.getValueOf( 'mwImgTab1', 'imgFilename' ) ) )
				{
					this.preview.removeAttribute( 'src' );
					this.preview.setStyle( 'display', 'none' );
				} else { // Preview existing image //30.12.14 RL Added "else"
					e = this.getContentElement( 'mwImgTab1', 'imgFilename' ); //23.12.14 RL-> 
					var newImg = e.getValue().replace(/ /g, '_');
					DispImgPView( this, newImg);   //23.12.14 RL<-
				}				
			},
			onHide : function()
			{
				if ( this.preview )
					this.commitContent( CLEANUP, this.preview );

				if ( this.originalElement )
				{
					this.originalElement.removeListener( 'load', onImgLoadEvent );
					this.originalElement.removeListener( 'error', onImgLoadErrorEvent );
					this.originalElement.removeListener( 'abort', onImgLoadErrorEvent );
					this.originalElement.remove();
					this.originalElement = false;		// Dialog is closed.
				}

				delete this.imageElement;
			}
        }
}
} );
