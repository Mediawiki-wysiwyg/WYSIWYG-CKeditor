/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The "sourcearea" plugin. It registers the "source" editing
 *		mode, which displays the raw data being edited in the editor.
 */

	
CKEDITOR.plugins.add( 'mediawiki',
{
	requires : [ 'fakeobjects', 'htmlwriter', 'dialog', 'widget' ],  //14.07.16 RL Added widget
    getMWElementCss : function() {  //01.03.14 RL Because of CKeditor 3.x and 4.x differences
       var str =
            // add the CSS for general styles of Mediawiki elements
            'img.fck_mw_frame' +
            '{' +
                'background-color: #F9F9F9;' +
                'border: 1px solid #CCCCCC;' +
                'padding: 3px !important;' +
            '}\n' +
            'img.fck_mw_right' +
            '{' +
                'margin: 0.5em 5px 0.8em 1.4em;' +
                'clear: right;'+
                'float: right;'+
            '}\n' +
            'img.fck_mw_left' +
            '{' +
                'margin: 0.5em 1.4em 0.8em 0em;' +
                'clear: left;' +     //31.12.14 RL
                'float: left;' +     //31.12.14 RL
            '}\n' +
            'img.fck_mw_center' +
            '{' +
                'margin-left: auto;' +
                'margin-right: auto;' +
                'margin-bottom: 0.5em;' +
                'display: block;' +
            '}\n' +
           'img.fck_mw_none' +       //31.12.14 RL
            '{' +
                'clear: both;' +     //Remove left and right floats
				'display: block;' +  //To make image split possible text lines automatically
            '}\n' +			
            'img.fck_mw_notfound' +
            '{' +
                'font-size: 1px;' +
                'height: 25px;' +
                'width: 25px;' +
                'overflow: hidden;' +
            '}\n' +
            'img.fck_mw_border' +
            '{' +
                'border: 1px solid #dddddd;' +
            '}\n' +
            // Add the CSS styles for special wiki placeholders.
			/*14.07.16 RL*******
			'img.FCK__MWRef' +   //<ref>  Img element was replaced by <R>
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_ref.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 18px !important;'  +  
				'height: 15px !important;' + 
			'}\n' +
			'img.FCK__MWReferences' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_references.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 66px !important;' +
				'height: 15px !important;' +
			'}\n' +
			********/
			'img.FCK__MWSignature' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_signature.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 66px !important;' +
				'height: 15px !important;' +
			'}\n' +

			'img.FCK__MWMagicWord' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_magic.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 66px !important;' +
				'height: 15px !important;' +
			'}\n' +
			'img.FCK__MWSpecial' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_special.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 66px !important;' +
				'height: 15px !important;' +
			'}\n' +
			'img.FCK__MWSyntaxhighlight' +  //17.02.14 RL, 02.11.14 RL For syntaxhighlight (earlier source)
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_source.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 66px !important;' +
				'height: 15px !important;' +
			'}\n' +
			'img.FCK__MWNowiki' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_nowiki.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 66px !important;' +
				'height: 15px !important;' +
			'}\n' +
			'img.FCK__MWIncludeonly' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_includeonly.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 66px !important;' +
				'height: 15px !important;' +
			'}\n' +
			'img.FCK__MWNoinclude' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_noinclude.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 66px !important;' +
				'height: 15px !important;' +
			'}\n' +
			'img.FCK__MWGallery' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_gallery.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 66px !important;' +
				'height: 15px !important;' +
			'}\n' +
			/*28.07.2015***	
			'img.FCK__MWCategory' +     //07.01.14 RL New element
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_category.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 18px !important;' +
				'height: 15px !important;' +
			'}\n' +
			****/
			'img.FCK__MWMath' +         //19.11.14 RL
			'{' +
				'background-image: url(' + ( CKEDITOR.getUrl( this.path + 'images/button_math.png' ) ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 18px !important;' +
				'height: 15px !important;' +
			'}\n' +
			'span.fck_mw_property' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_property.gif' ) + ');' +
				'background-position: 0 center;' +
				'background-repeat: no-repeat;' +
                'background-color: #ffcd87;' +
				'border: 1px solid #a9a9a9;' +
				'padding-left: 18px;' +
			'}\n' +
			'span.fck_mw_category' + //28.07.2015 Was commented. //07.01.14 RL Original element
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_category.gif' ) + ');' +
				'background-position: 0 center;' +
				'background-repeat: no-repeat;' +
                'background-color: #94b0f3;' +
				'border: 1px solid #a9a9a9;' +
				'padding-left: 18px;' +
			'}\n' +
			'pre' +  //08.02.15 RL For paragraph format "Formatted" of CKeditor which is using <pre> -tag
			'{' +
				'background-color:rgb(245,245,245);' + 
				'border: 1px solid rgb(224,224,224);' +
			'}\n' +  
			'pre.fck_mw_nowiki' +           //fck_mw_nowiki,FCK__MWNowiki           //Syntaxhighlight-Nowiki-Pre->
			'{' +
				'background-color:rgb(235,235,235);' + 
				'border: 1px solid rgb(224,224,224);' +
				'display: inline;' +
				'float: none' +
			'}\n' +  
			'pre.fck_mw_syntaxhighlight' +  //fck_mw_syntaxhighlight, FCK__MWSyntaxhighlight
			'{' +
				'background-color:rgb(245,245,245);' + 
				'border: 1px solid rgb(224,224,224);' +
			'}\n' +                         //Syntaxhighlight-Nowiki-Pre<-
			'pre._fck_mw_lspace' +          //29.11.15 RL For MW special space initiated <pre> block (related to class _fck_mw_lspace and this._inLSpace)
			'{' +
				'background-color:rgb(245,245,245);' + 
				'border: 1px solid rgb(224,224,224);' +
				'padding-left: 10pt' +      //Width of ~1 character indent for each line
			'}\n' +                  		//Syntaxhighlight-Nowiki-Pre<-
			'table.wikitable {' +           //30.10.15 RL Predefined wikitable class for MW table formatting
				'margin: 1em 0;' +
				'background-color: #f9f9f9;' +
				'border: 1px #aaa solid;' +
				'border-collapse: collapse;' +
				'color: black;' +
			'}\n' +
			'span.fck_mw_ref' +             //<ref>  Img element was replaced by this (=<R>)
			'{' +         
				//'display: inline;' +
				//'background-color: #ffff99;' + 
				'color: blue;' + 
				'font-weight: bold;' +
				'font-size: 100%;' +
				//'resize: both;' +
				//'border: 1px solid #a9a9a9;' +
				'float: none' +
			'}\n' +
			'span.fck_mw_references' +      //<references>  Img element was replaced by this
			'{' +         
				//'background-color: #ffffcc;' +  //light yellow  //light blue: rgba(0, 127, 255, 0.133)
				//'border: 1px solid rgb(224,224,224);' +
				'font-size: 100%;' +
				//'display: inline-block;' +
			'}\n';
			/****
			'span.fck_mw_ref ref:target,' +
			'span.fck_mw_references references span:target' +
			'{' +
				'background-color: #def;' +                 
				'background-color: rgba(0, 127, 255, 0.133);' +
			'}\n';
			***/
        return str;
    },

    onLoad: function () {   //01.03 RL: For CKeditor 4.x
        if (CKEDITOR.addCss)
            CKEDITOR.addCss( this.getMWElementCss() );
    },

	init : function( editor )
	{
        if (editor.addCss)  //01.03 RL: For CKeditor 3.x
            editor.addCss( this.getMWElementCss() );

		var wikiFilterRules =
			{
				elements :
				{
					span : function( element )
					{
                        var eClassName = element.attributes['class'] || '';
                        var className = null;
                        switch ( eClassName ){
                            case 'fck_mw_syntaxhighlight' :          //02.11.14 RL Was source
                                className = 'FCK__MWSyntaxhighlight';
                            /***   <ref>  Img element was replaced by <R>
                            case 'fck_mw_ref' :
                                if (className == null)
                                    className = 'FCK__MWRef';
					        ***/			
							/***   <references>  Img element was replaced by text block
                            case 'fck_mw_references' :
                                if ( className == null )
                                    className = 'FCK__MWReferences';
							***/	
                			/*28.07.2015***
							case 'fck_mw_category' :                 //07.01.14 RL->
                               if ( className == null )              
                                    className = 'FCK__MWCategory';   //07.01.14 RL<-
                			****/
							case 'fck_mw_math' :                     //19.11.14 RL->
                               if ( className == null )  
                                    className = 'FCK__MWMath';       //19.11.14 RL<-								
                            case 'fck_mw_template' :
                                if ( className == null ) //YC
                                    className = 'FCK__MWTemplate'; //YC
                            case 'fck_mw_magic' :
                                if ( className == null )
                                    className = 'FCK__MWMagicWord';
                            case 'fck_mw_special' : //YC
                                if ( className == null )
                                    className = 'FCK__MWSpecial';
                            case 'fck_mw_nowiki' :
                                if ( className == null )
                                    className = 'FCK__MWNowiki';
                            case 'fck_mw_html' :
                                if ( className == null )
                                    className = 'FCK__MWHtml';
                            case 'fck_mw_includeonly' :
                                if ( className == null )
                                    className = 'FCK__MWIncludeonly';
                            case 'fck_mw_gallery' :
                                if ( className == null )
                                    className = 'FCK__MWGallery';
                            case 'fck_mw_noinclude' :
                                if ( className == null )
                                    className = 'FCK__MWNoinclude';
                            case 'fck_mw_onlyinclude' :
                                if ( className == null )
                                    className = 'FCK__MWOnlyinclude';
                            case 'fck_mw_signature' :
                                if ( className == null )
                                    className = 'FCK__MWSignature';
                            case 'fck_smw_query' :
                                if ( className == null )
                                    className = 'FCK__SMWquery';
                            case 'fck_smw_webservice' :
                                if (className == null)
                                    className = 'FCK__SMWwebservice';
                            case 'fck_smw_rule' :
                                if (className == null)
                                    className = 'FCK__SMWrule';
                                if (className) {
                                    var result = editor.createFakeParserElement(element, className, 'span');
                                    if (className == "FCK__MWCategory") {
                                        result.attributes.alt = element.children[0].value.replace(/&quot;/g,''); //31.01.15 RL Quotes cause problems
                                        result.attributes.title = result.attributes.alt;
                                    }
                                    return result;
                                }
                            break;
                        }
					}
				}
			};

		// 14.07.16 RL:
		// CKEDITOR.customprocessor is original custom dataProcessor which is defined later in this file.			
		// We do not use custom dataProcessor anymore because:
		//  -it does not support Advanced Content Filter (ACF) (CKeditor >= 4.1)
		//  -it makes other plugins uncompatible with wysiwyg, because custom processor did not react to events properly
		// => ACF is disabled by setting "config.allowedContent = true;" otherwise it will require tag by tag 
		//    definitions for wysiwyg editor contents) in ckeditor/config.js
		var dataProcessor = editor.dataProcessor; // = new CKEDITOR.customprocessor( editor ); // 14.07.16 RL:
        dataProcessor.dataFilter.addRules( wikiFilterRules );

		//28.03.14 RL->
		var unlinkCommand =
    	{	//To override unlink function of CKeditor, taken from
			//http://docs.cksource.com/ckeditor_api/symbols/src/plugins_link_plugin.js.html
        	canUndo : false,    // The undo snapshot will be handled by 'insertElement'.
            exec : function( editor ) {
					var selection = editor.getSelection(),
						bookmarks = selection.createBookmarks(),
						ranges = selection.getRanges(),
						rangeRoot,
						element;

					for ( var i = 0 ; i < ranges.length ; i++ )
					{
						rangeRoot = ranges[i].getCommonAncestor( true );
						element = rangeRoot.getAscendant( 'a', true );
						if ( !element )
							continue;
						ranges[i].selectNodeContents( element );
					}

					selection.selectRanges( ranges );
					editor.document.$.execCommand( 'unlink', false, null );
					selection.selectBookmarks( bookmarks );
            },
			startDisabled: true // 06.03.15 Varlin
        };
        //28.03.14 RL<-

        //03.01.14 RL->For references (citation)
		var referencesCommand =
    	{
        	canUndo : false,    // The undo snapshot will be handled by 'insertElement'.
            exec : function( editor ) {

                var //ref = '<span class="fck_mw_references">_</span>',
                    element, // = CKEDITOR.dom.element.createFromHtml(ref, editor.document),
                    spanelement,
					realElement;
					// newFakeObj= editor.createFakeElement( element, 'FCK__MWReferences', 'span' );

				element = CKEDITOR.dom.element.createFromHtml('<references></references>', editor.document);
				element.setAttribute('class','fck_mw_references');             
				element.setText('&lt;References&gt;');

				spanelement = CKEDITOR.dom.element.createFromHtml('<span></span>', editor.document);              
				spanelement.setAttribute('class','fck_mw_references');             
				
				realElement = element.appendTo( spanelement );
					
                editor.insertElement( realElement );
				
				// Initialize widget recognition for new element.
				// http://ckeditor.com/forums/CKEditor/help-Inserting-a-widget-from-my-own-button
				editor.widgets.initOn( realElement, 'mwreferencesmarker' );         //09.08.16 RL
				
				// 08.07.16 RL: To get texts of references into <references> tags
				references_build_list( editor );
            }
        };
        //03.01.14 RL<-

        //08.07.16 RL->For references (citation)
		var referencesUpdCommand =
    	{
        	canUndo : false,    // The undo snapshot will be handled by 'insertElement'.
            exec : function( editor ) {
				
				//To get texts of references into <references> text based block 
				references_build_list( editor );
            }
        };
        //08.07.16 RL<-		
		
        var signatureCommand =
    	{
        	canUndo : false,    // The undo snapshot will be handled by 'insertElement'.
            exec : function( editor ) {
                var sig = '<span class="fck_mw_signature">_</span>',
                    element = CKEDITOR.dom.element.createFromHtml(sig, editor.document),
                    newFakeObj = editor.createFakeElement( element, 'FCK__MWSignature', 'span' );
                editor.insertElement( newFakeObj );
            }
        };

        var simplelinkCommand =                                                    //27.08.14 Varlin 
        { 
            exec : function( editor ) { 
			    var link; 
				link = editor.getSelection().getSelectedText();                    //09.09.14 RL  
                //if ( CKEDITOR.env.ie )                                           //05.09.14 RL->  
				//    link = editor.getSelection().document.$.selection.createRange().text; 
				//else                                                                      
				//    link = editor.getSelection().getNative();  

                if ( link && link != '' ) {                                        //05.09.14 RL<-
                    var style = new CKEDITOR.style( {element : 'a', attributes : {href : link}} ); 
                        style.type = CKEDITOR.STYLE_INLINE;		// need to override... dunno why. 
                        style.apply( editor.document ); 
				}		
            },
			startDisabled: true // 06.03.15 Varlin
        }; 
		
        // language logic for additional messages
        var MWpluginLang = []
        MWpluginLang['en'] = {
            invalidContent  : 'invalid content',
            searching       : 'searching...',
            externalLink    : 'external link... no search for it',
            startTyping     : 'start typing in the above field',
            stopTyping      : 'stop typing to search',
            tooManyResults  : 'too many results...',
            // image
            imgTitle        : 'Mediawiki Image',
            fileName        : 'Image file name',
            fileNameExtUrl  : 'Image file name or URL',
            searchLabel     : 'Automatic search results (%s)',
            noImgFound      : 'no images found',
            oneImgFound     : 'one image found',
            manyImgFound    : ' images found',
            caption         : 'Caption',
            imgType         : 'Special type',
			imgTypeThumb    : 'Thumbnail',                                  //07.01.14 RL
			imgTypeFrame    : 'Frame',                                      //07.01.14 RL
			imgTypeFrameless: 'Frameless',                                  //07.01.14 RL
			imgTypeBorder   : 'Border',                                     //07.01.14 RL
			img_baseline    : 'Baseline', //31.12.14 RL->
			img_sub         : 'Sub',
			img_super       : 'Super',
			img_top         : 'Top',
			img_text_top    : 'Text-top',
			img_middle      : 'Middle',
			img_bottom      : 'Bottom',
			img_text_bottom : 'Text-bottom',
			img_upright     : 'Resize to fit (upright)',
			img_link_title  : 'Link',
			img_link_disable: 'Disable link', 
			imgVertAlign    : 'Alignment (vert.)', //31.12.14 RL<-
			startSearchTitle: 'image list',
            // signature
            signature       : 'Signature', 
            // special tags
            specialTags     : 'Special Tags',
            specialTagTitle : 'Special Tags Dialogue',
            specialTagDef   : 'Define any special tag, magic word or parser function:',
            // link
            linkTitle       : 'Mediawiki Link',
			simplelink	    : 'Convert text to link',                             //05.09.14 RL 
            noPageFound     : 'no article found',
            onePageFound    : 'one article found',
            manyPageFound   : ' articles found',
            emailLink       : 'e-mail link... no search for it',
            anchorLink      : 'anchor link... no search for it',
            linkAsRedirect  : 'Redirect to target page (#REDIRECT)',              //01.03.14 RL
			linkAsRedirectTitle: 'Use only one #REDIRECT to linked page as first element on page.',
			linkAsMedia        : 'Internal link to an image or a file of other types, [[Media:<link>]]', //09.05.14 RL
			linkAsMediaTitle   : 'Internal link to an image or a file of other types [[Media:<link>]]',
            defineTarget       : 'Define the wiki page for the link target:',   
			defineTargetTitle  : 'Link target',
            chooseTarget       : 'Choose an existing wikipage for the link target:',
			chooseTargetTitle  : 'Page list',
			// references (citation)
			referenceTitle 	   : 'Add/edit reference (citation)',                //03.01.14 RL
			refDefTxt  		   : 'Reference text',                               //03.01.14 RL
			refDefName         : 'Name of reference (if same text is referenced at multible places on page, if not, leave empty):',
			ref				   : 'Add a reference',                              //03.01.14 RL
			references		   : 'Add references block',                         //03.01.14 RL
			references_upd	   : 'Update references',                            //08.07.16 RL
			references_noedit  : 'Do not modify references here.',                //08.07.16 RL
            // category
			categorybtn        : 'Create new category',                          //20.01.15 RL   'Ajouter'
			categoryTitle      : 'Add/edit categories',                          //20.01.15 RL
			category           : 'Type text to search for or to create a new category:', //20.01.15 RL 'Recherche'
			categorySelected   : 'Selected categories for the page:',            //20.01.15 RL
            selfromCategoryList: 'Select category for the page:',                 //20.01.15 RL			
			categorySort       : 'Sortkey within category',                      //07.01.14 RL
			noCategoryFound    : 'Not found, category is new',                   //09.01.14 RL
            oneCategoryFound   : 'One category found',                           //09.01.14 RL
            manyCategoryFound  : ' categories found',                            //09.01.14 RL
			mouseOverUnknownObj: 'Double-click to edit the value',               //31.01.15 RL
			speSpecialTexts    : 'Special Texts',                                //Special Texts 
			speOperation       : 'Select type / operation',                      //Select type / operation
			speRemoveTag       : 'Remove tag',                                   //Remove tag
			speAttrValue       : 'Value of attribute'                            //Value of attribute 
		}

        MWpluginLang['fi'] = {  //07.01.14 RL->
            invalidContent  : 'virheellinen sisältö',                         //'invalid content',
            searching       : 'haetaan...',                                   //'searching...',
            externalLink    : 'ulkoinen linkki... ei haeta',                  //external link... no search for it',
            startTyping     : 'kirjoita yo. kenttään',                        //'start typing in the above field',
            stopTyping      : 'lopeta kirjoitus etsinnän käynnistämiseksi',   //'stop typing to search',
            tooManyResults  : 'liikaa hakutuloksia...',                       //'too many results...',
            // image
            imgTitle        : 'Mediawikin kuva',                              //'Mediawiki Image',
            fileName        : 'Tiedoston nimi mediawikissä',                  //'Image file name',
            fileNameExtUrl  : 'Kuvatiedoston nimi tai URL',                   //'Image file name or URL',
            searchLabel     : 'Löytyneet kuvat (%s)',                         //'Automatic search results (%s)',
            noImgFound      : 'ei kuvia',                                     //'no images found',
            oneImgFound     : 'yksi kuva',                                    //'one image found',
            manyImgFound    : ' kpl',                                         //' images found',
            caption         : 'Otsikko',                                      //'Caption',
            imgType         : 'Tyyppi',                                       //Special type',
			imgTypeThumb    : 'Pikkukuva (thumbnail)',                        //'Thumbnail',
			imgTypeFrame    : 'Kehys (frame)',                                //'Frame',
			imgTypeFrameless: 'Ei kehystä (frameless)',                       //'Frameless',
			imgTypeBorder   : 'Rajat (border)',                               //Border',
			img_baseline    : 'Perustaso',     //31.12.14 RL->
			img_sub         : 'Alaindeksi',
			img_super       : 'Yläindeksi',
			img_top         : 'Ylös',
			img_text_top    : 'Ylös tekstiin',
			img_middle      : 'Keskelle',
			img_bottom      : 'Alas',
			img_text_bottom : 'Alas tekstiin',
			img_upright     : 'Sovita kuvan koko (upright)',
			img_link_title  : 'Linkki',
			img_link_disable: 'Estä linkin toiminta',
			imgVertAlign    : 'Kohdistus (pystys.)', //31.12.14 RL<-
			startSearchTitle: 'lista kuvista',                                //'image list' 
            // signature
            signature       : 'Allekirjoitus',                                //'Signature',
            // special tags
            specialTags     : 'Tag',                                          //'Special Tags',
            specialTagTitle : 'Tag -dialogi',                                 //'Special Tags Dialogue',
            specialTagDef   : 'Määritä tag, magic word tai parser funktio',   //'Define any special tag, magic word or parser function:',
            // link
            linkTitle       : 'Mediawikin linkki',                            //'Mediawiki Link',
			simplelink	    : 'Teksti linkiksi',                              //'Simple link',                      //09.05.14 RL
            noPageFound     : 'sivuja ei löytynyt',                           //'no article found',
            onePageFound    : 'yksi sivu löytyi',                             //'one article found',
            manyPageFound   : ' kpl',                                         //' articles found',
            emailLink       : 'sposti linkki... ei etsintää',                 //'e-mail link... no search for it',
            anchorLink      : 'ankkuri linkki... ei etsintää',                //'anchor link... no search for it',
            linkAsRedirect  : 'Pakko-ohjaus kohdesivulle (#REDIRECT)',        //'Redirect to target page',          //01.03.14 RL
			linkAsRedirectTitle: 'Lisää vain yksi #REDIRECT -ohjaus sivun ensimmäiselle riville.', //'Use only one #REDIRECT to linked page as first element on page.'
			linkAsMedia        : 'Sisäinen linkki kuvaan tai muun tyyppiseen tiedostoon, [[Media:<link>]]',            //09.05.14 RL
			linkAsMediaTitle   : 'Sisäinen linkki kuvaan tai muun tyyppiseen tiedostoon, [[Media:<link>]]',
            defineTarget       : 'Määritä wikin sivu linkin kohteeksi',       //'Define the wiki page for the link target:',
			defineTargetTitle  : 'Linkin kohde',                               //'Link target'
            chooseTarget       : 'Valitse wikin sivu linkin kohteeksi',          //Choose an existing wikipage for the link target:',
			chooseTargetTitle  : 'Sivut',                                      //'Page list'
			// references (citation)
			referenceTitle 	   : 'Lisää viite / muuta viitettä',                 //'Add/edit reference (citation)',
			refDefTxt  		   : 'Viitteen teksti',                              //'Reference text',
			refDefName         : 'Viitteen nimi (anna nimi vain jos samaan viitetekstiin viitataan useasta paikasta):', //'Name of reference'
			ref				   : 'Viite',                                        //'Add a reference' for button of menu
			references		   : 'Lista viitteistä',                             //'Add references block' for button of menu
            references_upd	   : 'Päivitä viitteet',                            //08.07.16 RL
			references_noedit  : 'Älä muuta viitteitä tässä kohdassa.',          //08.07.16 RL
			// category
			categorybtn    	   : 'Luo uusi luokka',                           //'Create new category' //20.01.15 RL
			categoryTitle      : 'Sivun luokkien määritys',                 //'Add/edit categories' //20.01.15 RL 
			category           : 'Etsi / luo uusi luokka (tyhjä kenttä listaa kaikki luokat):', //'Type text to search for or create a new category' //20.01.15 RL
            categorySelected   : 'Sivu lisätään luokkiin:',                //'Selected categories for the page:'  //20.01.15 RL
            selfromCategoryList: 'Valitse luokka listalta:',                  //'Select category for the page //20.01.15 RL
			categorySort       : 'Lajitteluavain luokan sisällä:',          //'Sortkey within category'
			noCategoryFound    : 'Luokkaa ei löydy, se on uusi',             //'no category found'			     //09.01.14 RL
            oneCategoryFound   : 'Yksi luokka löytyi',                       //'one category found',            //09.01.14 RL
            manyCategoryFound  : ' kpl',                                      //' categories found',			 //09.01.14 RL
			mouseOverUnknownObj: 'Tuplaklikkaa editoidaksesi arvoa',          //'Double-click to edit the value' //31.01.15 RL
			speSpecialTexts    : 'Tekstin tyyppi',                            //Special Texts 
			speOperation       : 'Valitse tyyppi / toiminta',                 //Select type / operation
			speRemoveTag       : 'Poista ohjaus',                             //Remove tag
			speAttrValue       : 'Atribuutin arvo'                            //Value of attribute   
		} //07.01.14 RL<-

	    MWpluginLang['fr'] = {
            invalidContent  : 'contenu invalide',
            searching       : 'recherche...',
            externalLink    : 'lien externe... pas de recherche',
            startTyping     : 'tapez dans le champ ci-dessus',
            stopTyping      : 'arrêtez de taper pour lancer la recherche',
            tooManyResults  : 'trop de résultats correspondants...',
            // image
            imgTitle        : 'Ajouter/modifier une image',
            fileName        : 'Nom de fichier image',
            fileNameExtUrl  : 'URL ou nom d’image',
            searchLabel     : 'Résultats de recherche (%s)',
            noImgFound      : 'aucune image trouvée',
            oneImgFound     : 'une image trouvée',
            manyImgFound    : ' images trouvées',
            caption         : 'Légende',
            imgType         : 'Encradement',
			imgTypeThumb    : 'Miniature',
			imgTypeFrame    : 'Cadre',
			imgTypeFrameless: 'Sans cadre',
			imgTypeBorder   : 'Bordure',
			img_baseline    : 'Ligne_de_base',     //31.12.14 RL->
			img_sub         : 'Indice',
			img_super       : 'Exposant',
			img_top         : 'Haut',
			img_text_top    : 'Haut-texte',
			img_middle      : 'Milieu',
			img_bottom      : 'Bas',
			img_text_bottom : 'Bas-texte',
			img_upright     : 'Redimensionner pour adapter (upright)',
			img_link_title  : 'Entrer la page cible',
			img_link_disable: 'Désactiver le lien',
			imgVertAlign    : 'Alignement (vert.)', //31.12.14 RL<-
			startSearchTitle: 'Liste d’images',
            // signature
            signature       : 'Signature',
            // special tags
            specialTags     : 'Balises spéciales',
            specialTagTitle : 'Balises spéciales',
            specialTagDef   : 'Définir une balise spéciale :',
            // link
            linkTitle       : 'Créer/éditer un lien',
			simplelink	    : 'Lien rapide',                                                         //27.08.14 Varlin
            noPageFound     : 'pas d’article trouvé',
            onePageFound    : 'un article trouvé',
            manyPageFound   : ' articles trouvés',
            emailLink       : 'e-mail... pas de recherche',
            anchorLink      : 'ancre... pas de recherche',
            linkAsRedirect  : 'Rediriger vers la cible (#REDIRECT)',
			linkAsRedirectTitle: 'Utiliser un seul #REDIRECT vers la cible au début de la page',
			linkAsMedia        : 'Lien interne vers une image ou un autre fichier [[Media:<lien>]]', //09.05.14 RL
			linkAsMediaTitle   : 'Lien interne vers une image ou un autre fichier [[Media:<lien>]]', 
			defineTarget       : 'Entrer la page cible:',
			defineTargetTitle  : 'Cible du lien',
            chooseTarget       : 'Choisissez la page :',
			chooseTargetTitle  : 'Liste de page',
			// references (citation)
			referenceTitle 	   : 'Ajouter/modifier une référence',
			refDefTxt    	   : 'Texte de la référence',
			refDefName         : 'Nom de la référence :',
			ref				   : 'Ajouter une référence',
			references		   : 'Ajouter le bloc des références',
			references_upd	   : 'Mise à jour des références',                            //08.07.16 RL
			references_noedit  : 'Ne pas mettre à jour les références ici.',               //08.07.16 RL
			// category        
			categorybtn		   : 'Ajouter/modifier une catégorie',
			categoryTitle	   : 'Ajouter/modifier une catégorie',
			category		   : 'Recherche',
			categorySelected   : 'Catégories sélectionnées pour la page:',
            selfromCategoryList: 'Sélectionner dans la liste:',			
			categorySort	   : 'categorySort',
			noCategoryFound    : 'Non trouvé, la catégorie est nouvelle',
            oneCategoryFound   : 'Une catégorie trouvée',
            manyCategoryFound  : ' catégories trouvées',
			mouseOverUnknownObj: 'Double-cliquer pour éditer',
            speSpecialTexts    : 'Textes spéciaux',
			speOperation       : 'Sélectionnez le type / opération',               //Select type / operation
			speRemoveTag       : 'Retirer la commande',                            //Remove tag
			speAttrValue       : 'Valeur des attributs'                     //Value of attribute 
	    }

        MWpluginLang['de'] = {
            invalidContent  : 'ungültiger Inhalt',
            searching       : 'suche...',
            externalLink    : 'externer Link... es wird nicht danach gesucht',
            startTyping     : 'Eingabe im oberen Feld',
            stopTyping      : 'Tippen beenden um zu suchen',
            tooManyResults  : 'zu viele Ergebnisse...',
            // image
            imgTitle        : 'Mediawiki Bild',
            fileName        : 'Dateiname',
            fileNameExtUrl  : 'Dateiname oder URL',
            searchLabel     : 'automatische Suchergebnisse (%s)',
            noImgFound      : 'keine Bilder gefunden',
            oneImgFound     : '1 Bild gefunden',
            manyImgFound    : ' Bilder gefunden',
            caption         : 'Beschreibung',
            imgType         : 'Bildtyp',
            imgTypeThumb    : 'Miniatur',                                                            //29.09.14 RL
            imgTypeFrame    : 'Rahmen',                                                              //29.09.14 RL 
            imgTypeFrameless: 'Rahmenlos',                                                           //29.09.14 RL 
            imgTypeBorder   : 'Linie',                                                               //29.09.14 RL
			img_baseline    : 'Grundlinie',     //31.12.14 RL->
			img_sub         : 'Tiefgestellt',
			img_super       : 'Hochgestellt',
			img_top         : 'Oben',
			img_text_top    : 'Text-oben',
			img_middle      : 'Mitte',
			img_bottom      : 'Unten',
			img_text_bottom : 'Text-unten',
			img_upright     : 'Automatisch angepasst (upright)',
			img_link_title  : 'Verweis',
			img_link_disable: 'Verweis deaktiviert',
			imgVertAlign    : 'Ausrichtung (vert.)', //31.12.14 RL<-
			startSearchTitle: 'image list',
            // signature
            signature       : 'Signatur',
            // special tags
            specialTags     : 'Spezial Tags',
            specialTagTitle : 'Spezial Tags Dialog',
            specialTagDef   : 'Definiere einen Spezialtag, ein magisches Wort oder eine Parserfunktion:',
            // link
            linkTitle       : 'Mediawiki Link',
			simplelink	    : 'Convert text to link',                                                //27.08.14 Varlin 
            noPageFound     : 'keinen Artikel gefunden',
            onePageFound    : '1 Artikel gefunden',
            manyPageFound   : ' Artikel gefunden',
            emailLink       : 'e-mail link... es wird nicht danach gesucht',
            anchorLink      : 'anchor link... es wird nicht danach gesucht',
            linkAsRedirect  : 'Umleitung auf Seite Ziel (#REDIRECT)',              //01.03.14 RL
            linkAsRedirectTitle : 'Verwenden Sie nur einen #REDIRECT verlinkten Seite als erstes Element auf Seite.',
			linkAsMedia         : 'Interner Link zu einem Bild oder eine Datei von anderen Arten [[Media:<link>]]', //09.05.14 RL
            linkAsMediaTitle    : 'Interner Link zu einem Bild oder eine Datei von anderen Arten [[Media:<link>]]',
            defineTarget        : 'Definiere eine Wikiseite als Linkziel:',
            defineTargetTitle   : 'Link-Ziel',
            chooseTarget        : 'Wähle eine existierende Wikiseite als Linkziel:',
            chooseTargetTitle   : 'Seitenliste',
            // references (citation)
            referenceTitle      : 'Referenz hinzufügen/bearbeiten',
            refDefTxt           : 'Text für Referenz',
            refDefName          : 'Name der Referenz',
            ref                 : 'Referenz hinzufügen',
            references          : 'Referenzblock hinzufügen',
			references_upd	    : 'Referenz aktualisierung',                         //08.07.16 RL
			references_noedit   : 'Ändern Sie nicht hier Referenzen.',                //08.07.16 RL
            // category
            categorybtn         : 'Neue Kategorie erstellen',
            categoryTitle       : 'Kategorie hinzufügen/bearbeiten',
            category            : 'Text nach dem gesucht oder um eine neue Kategorie zu erstellen:',
			categorySelected    : 'Ausgewählte Kategorien zur Seite:',
            selfromCategoryList : 'Aus Liste von Kategorien auswählen:',
            categorySort        : 'Sortierungsschlüssel innerhalb Kategorie',
            noCategoryFound     : 'Nicht gefunden, neue Kategorie',
            oneCategoryFound    : 'Eine Kategorie gefunden',
            manyCategoryFound   : ' Kategorien gefunden',
			mouseOverUnknownObj : 'Doppelklicken Sie auf den gewünschten Wert ein',  //'Double-click to edit the value' //31.01.15 RL
			speSpecialTexts     : 'Spezialtexte',                                    //Special Texts 
			speOperation        : 'Wählen die Art oder Tätigkeit',                   //Select type / operation
			speRemoveTag        : 'Entfernen die Kontrolle',                         //Remove tag
			speAttrValue        : 'Attribute, den Wert'                              //Value of attribute  			
        }

        // Define language for wysiwyg, editor.langCode is eq. to language of ckeditor
        if (typeof MWpluginLang[editor.langCode] != 'undefined' ) {
            editor.lang.mwplugin = MWpluginLang[editor.langCode];
		} else {
            editor.lang.mwplugin = MWpluginLang['en'];
		}

		// For some reason this does not work with (unminified) source files of CKeditor (may be some config error),
		// because fakeobjects is undefined. This works when running minified CKeditor.
		if (typeof CKEDITOR.lang[editor.langCode].fakeobjects  != 'undefined' ) {                             //25.10.15 RL
			// Change mouseover text 'Unknown Object'" to "Double-click to edit the value' with elements.
			CKEDITOR.lang[editor.langCode].fakeobjects['unknown'] = editor.lang.mwplugin.mouseOverUnknownObj; //31.01.15 RL
		}

        // define commands and dialogs

		//This overrides 'link' function of CKeditor, button is already on screen drawn by CKeditor
		//Works with CKeditor 3.6 and 4.3.3
        editor.addCommand( 'link', new CKEDITOR.dialogCommand( 'MWLink' ) );
        CKEDITOR.dialog.add( 'MWLink', this.path + 'dialogs/link.js' );

		//28.03.14 RL 'unlink' worked with CKeditor 3.6 without this override function,
		//             which is needed in CKeditor 4.3.3, otherwise button was grey all the time
		//             because link plugin was not activated for some reason (propabley because of
		//             overridden 'link' function abowe.
		editor.addCommand( 'unlink', unlinkCommand );    //28.03.14 RL

        editor.addCommand( 'image', new CKEDITOR.dialogCommand( 'MWImage' ) );
        CKEDITOR.dialog.add( 'MWImage', this.path + 'dialogs/image.js' );

        editor.addCommand( 'MWSpecialTags', new CKEDITOR.dialogCommand( 'MWSpecialTags' ) );
        CKEDITOR.dialog.add( 'MWSpecialTags', this.path + 'dialogs/special.js' );

		/*14.07.16 RL** Replaces by widgets refmarker and referencesmarker 
		editor.addCommand(   'MWRef', new CKEDITOR.dialogCommand( 'MWRef' ) ); //03.01.14 RL-> For references (citation)
        CKEDITOR.dialog.add( 'MWRef', this.path + 'dialogs/ref.js' );
		editor.ui.addButton( 'MWRef',
			{
				label : editor.lang.mwplugin.ref,
				command : 'MWRef',
				icon: this.path + 'images/icon_ref.gif'
			});
			
		editor.addCommand(   'MWReferences', referencesCommand);	
		editor.ui.addButton( 'MWReferences',
			{
				label : editor.lang.mwplugin.references,
				command : 'MWReferences',
				icon: this.path + 'images/icon_references.gif'
			});                                                               //03.01.14 RL<-
		******/	

		
		// Widget 'referencesmarker' for <references>
		editor.widgets.add( 'mwreferencesmarker', {
			//button:  'Create a references widget', //Do not use automatic registration because of button image.
			
			//template:                              //09.08.16 RL Widget is not using this template
			//	'<span class="fck_mw_references">' +
			//		'<references>&lt;references_tag&gt;</references>' +
			//	'</span>',

			//dialog: 'referencesCommand',           //09.08.16 RL Widget is not using dialog window.
			
			//requiredContent: 'span(fck_mw_references)',
			upcast: function(element) {
				return element.name == 'span' && element.hasClass('fck_mw_references') ; 
			}
		});		
		
		// Activate command of 'referencesmarker'
		editor.addCommand( 'mwreferencesmarker', referencesCommand ); 
		
		// Add button of 'referencesmarker' into toolbar
		editor.ui.addButton( 'MWReferencesmarker', {
			label: editor.lang.mwplugin.references,   //Create a references block
			command: 'mwreferencesmarker',
			icon: this.path + 'images/icon_references.gif'
			// Toolbar group name.
			//toolbar: 'insert'
		} );


		// Widget 'MWRefmarker' for <ref>. 
		// NOTE! The way widget is defined here is heavily customized solution, 
		// related dialog is also using widget in customized way.
		// If you want an example how widgets are supposed to work, see  
		// http://docs.ckeditor.com/#!/guide/widget_sdk_tutorial_1
		editor.widgets.add( 'mwrefmarker', {
			
			// Do not use automatic registration of button because of the image filename and location.
			// button:   'Create a ref widget', 
			
			// template: Dialog is not using this, new element will be created by dialog and initialized using editor.widgets.initOn.
				
			dialog: 'MWRefmarker',
			
			/*****
			allowedContent:
				'span(!fck_mw_ref); sup; ref(!fck_mw_ref)[title,fck_mw_reftagtext,name]',
			
			requiredContent: 				
				'span(!fck_mw_ref); sup; ref(!fck_mw_ref)[title,fck_mw_reftagtext,name]',
			*****/
		
			upcast: function(element) {
				return element.name == 'span' && element.hasClass('fck_mw_ref');
				//if ( element.name == 'span' && element.hasClass('fck_mw_ref') )
				//	return element;
			}
		} );
		
		// Register dialog file of widget 'MWRefmarker' ('this.path' is the path of the plugin folder).
		CKEDITOR.dialog.add('MWRefmarker', this.path + 'dialogs/ref.js');

		// Define an editor command 'MWRefmarker' that opens dialog.
		editor.addCommand('MWRefmarker', new CKEDITOR.dialogCommand('MWRefmarker') );
		/***
		, {
			// This needs some testing:
			//allowedContent:  'span[*](*);header[*](*);li[*];a[*];ref(*)[*];sup[*];p[*]',
			//requiredContent: 'span[*](*);header[*](*);li[*];a[*];ref(*)[*];sup[*];p[*]'
		}
		***/		
	
		// Add button of 'MWRefmarker'
		editor.ui.addButton( 'MWRefmarker', {
			label: editor.lang.mwplugin.ref,   //Create a reference
			command: 'MWRefmarker',
			//toolbar: 'basicstyles,1',
			icon: this.path + 'images/icon_ref.gif'
		} );

		
		// Button to renumber references and fill up references- block.
		editor.addCommand( 'MWReferencesUpd', referencesUpdCommand);         //08.07.16 RL

		editor.ui.addButton( 'MWReferencesUpd',                              //08.07.16 RL
			{
				label : editor.lang.mwplugin.references_upd,
				command : 'MWReferencesUpd',
				icon: this.path + 'images/icon_refupd.png'
			});			

		editor.addCommand( 'MWCategory', new CKEDITOR.dialogCommand( 'MWCategory' ) ); //07.01.14 RL
        CKEDITOR.dialog.add( 'MWCategory', this.path + 'dialogs/category.js' );        //07.01.14 RL

	
        editor.addCommand( 'MWSignature', signatureCommand);
		
		editor.ui.addButton( 'MWSignature',
			{
				label : editor.lang.mwplugin.signature,
				command : 'MWSignature',
                   icon: this.path + 'images/tb_icon_sig.gif'
			});
				

		editor.addCommand( 'MWSimpleLink', simplelinkCommand);    //05.09.14 RL

		if ( ! mw.config.get('is_special_elem_with_text_tags') ) {                                //Syntaxhighlight-Nowiki-Pre->       
			editor.addCommand( 'MWTextTags', new CKEDITOR.dialogCommand( 'MWTextTagsD' ) ); 
			CKEDITOR.dialog.add( 'MWTextTagsD', this.path + 'dialogs/texttags.js' ); 

			if ( editor.contextMenu ) {
				editor.addMenuGroup( 'MWTextTagsGroup' );
			
				editor.addMenuItem( 'MWTextTagsItem', {
					label: editor.lang.mwplugin.speSpecialTexts, //'Special Texts'
					//icon: this.path + 'icons/abbr.png',
					icon: this.path + 'images/icon_texttags.png',
					command: 'MWTextTags',
					group: 'MWTextTagsGroup'
				});

				editor.contextMenu.addListener( function( element ) {
					/***
					if ( element.hasAscendant( 'pre', true ) ) 
						alert(element.getAscendant( 'pre', true ).hasClass( 'fck_mw_syntaxhighlight' ) + ' ' +
							element.getAscendant( 'pre', true ).getName() + ' ' + element.getName()
							);
					***/
					if ( element.hasAscendant( 'pre', true ) ) {
						return { MWTextTagsItem: CKEDITOR.TRISTATE_OFF };
					}
				});
			}                                                                   //Syntaxhighlight-Nowiki-Pre<-
		}
	
        if (editor.addMenuItem) {
            // A group menu is required
            // order, as second parameter, is not required
            editor.addMenuGroup('mediawiki');
                // Create a menu item
                editor.addMenuItem('MWSpecialTags', {
                    label: editor.lang.mwplugin.specialTags,
                    command: 'MWSpecialTags',
                    group: 'mediawiki'
                });
        }
		if ( editor.ui.addButton )
		{
			if ( ! mw.config.get('is_special_elem_with_text_tags') ) {
				editor.ui.addButton( 'MWTextTags', {       //Syntaxhighlight-Nowiki-Pre->
					label: editor.lang.mwplugin.speSpecialTexts, //'Special Texts'
					command: 'MWTextTags',
					toolbar: 'insert',
					icon: this.path + 'images/icon_texttags.png'
				});                                        //Syntaxhighlight-Nowiki-Pre<-
			}

			editor.ui.addButton( 'MWSpecialTags',
				{
					label : editor.lang.mwplugin.specialTags,
					command : 'MWSpecialTags',
                    icon: this.path + 'images/tb_icon_special.gif'
				});

			editor.ui.addButton( 'MWCategory',    //07.01.14 RL
				{
					label : editor.lang.mwplugin.categoryTitle, //01.09.15 RL Was categorybtn
					command : 'MWCategory',
                    icon: this.path + 'images/icon_category.gif'
				});

			editor.ui.addButton( 'MWSimpleLink',  //27.08.14 Varlin 
                { 
                    label : editor.lang.mwplugin.simplelink, 
                    command : 'MWSimpleLink', 
                    icon: this.path + 'images/tb_icon_simplelink.gif' 
                }); 
		}
		
        // context menu
        if (editor.contextMenu) {
            editor.contextMenu.addListener(function(element, selection) {
                var name = element.getName();
                // fake image for some <span> with special tag
                if ( name == 'img' &&
                     element.getAttribute( 'class' ) &&
                     element.getAttribute( 'class' ).InArray( [
                        'FCK__MWSpecial',
                        'FCK__MWMagicWord',
                        'FCK__MWNowiki',
                        'FCK__MWIncludeonly',
                        'FCK__MWNoinclude',
                        'FCK__MWOnlyinclude',
						'FCK__MWSyntaxhighlight'                        //17.02.14 RL syntaxhighlight (earlier source)
                     ])
                   ) return {MWSpecialTags: CKEDITOR.TRISTATE_ON};
            });
        }
		
		editor.on( 'contentDom', function( evt )  // Necessary to get onMouseUp / onKeyUp events 
			{
		
				// 06.03.15 Varlin: To enable / disable unlink button, taken
				editor.document.on('keyup',    function() { linkbuttons_on_off( editor ) } ); 
				editor.document.on('mouseup',  function() { linkbuttons_on_off( editor ) } ); 
			
				// 08.07.16 RL: To disable edits of <ref> and <references> text based elements
				editor.document.on('keyup',    function() { reference_disable_sel( evt, editor ) } );
				editor.document.on('mouseup',  function() { reference_disable_sel( evt, editor ) } );
				
				// 08.07.16 RL: To get texts of references into <references> text based block 
				//editor.document.on('mouseup',  function() { references_build_list( evt, editor ) } ); // for debug purposes
				references_build_list( editor ); // when page is opened use this to update list
				
				//editor.editable().attachListener( editor.document, 'mouseup', function() { linkbuttons_on_off( editor ) } );
				//editor.editable().attachListener( editor.document, 'mouseup', function() { reference_disable_sel( evt, editor ) } );
				
				//var editable = editor.editable();
				//editable.attachListener( editable, 'mouseup', function() { linkbuttons_on_off( editor ) } );
				//editable.attachListener( editable, 'mouseup', function() { reference_disable_sel( evt, editor ) } );	
			}
		)	
		
        editor.on( 'doubleclick', function( evt )
			{					
			    var element = CKEDITOR.plugins.link.getSelectedLink( editor ) || evt.data.element;

				if ( element == null ) {
					element = selection.getStartElement();           //For <ref> as text based element, img element is not used
				}
				/****
				if ( element.hasAscendant( 'ref', true ) == true ) { //For <ref> as text based element, img element is not used
					evt.data.dialog = 'MWRef';	
				}
				
				else
				****/
				if ( element.hasAscendant( 'pre', true ) && ! mw.config.get('is_special_elem_with_text_tags') ) { //Syntaxhighlight-Nowiki-Pre 
					evt.data.dialog = 'MWTextTagsD';
				} 
				else if ( element.is( 'img' ) &&                      //07.01.14 RL->
				     element.hasAttribute( 'class' ) &&               //03.02.14 RL Added
					 element.getAttribute( 'class' ).InArray( [       //03.02.14 RL Modified to use InArray(..)
								'FCK__MWSignature'                    //20.07.16 RL
								// 'FCK__MWReferences',
								// 'FCK__MWMath'                      //19.11.14 RL Commented out
								])
				   ) {
				  // Do nothing, because otherwise doubleclick of math or reference object
				  // will open dialog for linking image to page.
				}
				//03.02.14 RL-> Dialog to edit template definitions is defined in ckeditor/plugins/mwtemplate/dialogs/teplate.js.
				//              ckeditor/plugins/mwtemplate/plugins.js has following code but for some reason it is not
				//              activated there on doubleclick of icon_template.gif, placing code here seems to solve the case.
				else if ( element.is( 'img' ) &&
						  element.getAttribute( 'class' ) &&
						  element.getAttribute( 'class' ) == 'FCK__MWTemplate' ) {
							evt.data.dialog = 'MWTemplate';
				} //03.02.14 RL<-
				else
				{                                                        //07.01.14 RL<-
					if ( element.is( 'a' ) || ( element.is( 'img' ) && element.getAttribute( '_cke_real_element_type' ) == 'anchor' ) )
						evt.data.dialog = 'MWLink';
					else if ( element.getAttribute( 'class' ) == 'fck_mw_category' )     //01.09.2015 RL For categories (28.07.2015)
						evt.data.dialog = 'MWCategory';                                  //01.09.2015 RL
					else if ( element.is( 'img' ) ) {
						/***                                                             **01.09.2015 RL (28.07.2015)
						if ( element.getAttribute( 'class' )  == 'FCK__MWCategory' )     //07.01.2014 RL For categories
							evt.data.dialog = 'MWCategory';                              //07.01.2014 RL
						else 
						***/
						/*14.07.16 RL****
						if ( element.getAttribute( 'class' )  == 'FCK__MWRef' )          ////For <ref> as img element
							evt.data.dialog = 'MWRef';                                   //04.01.2014 RL
						else 
						*****/	
						if ( element.getAttribute( 'class' ) &&                     //07.01.14 RL This was earlier one step below
							element.getAttribute( 'class' ).InArray( [
								'FCK__MWSpecial',
								'FCK__MWMagicWord',
								'FCK__MWNowiki',
								'FCK__MWIncludeonly',
								'FCK__MWNoinclude',
								'FCK__MWOnlyinclude',
								'FCK__MWMath',                                           //19.11.14 RL
								'FCK__MWSyntaxhighlight',                                //17.02.14 RL, 02.11.14 RL Earlier source
								'FCK__MWGallery'                                         //21.11.14 RL   
							])
						)
							evt.data.dialog = 'MWSpecialTags';
						else if ( !element.getAttribute( '_cke_real_element_type' ) )    //07.01.14 RL This was earlier one step abowe
							evt.data.dialog = 'MWImage';
					}
                }  //07.01.14 RL
            }
        )
		
		/**
		$(document).on('click', '.cke_button__source', function() //12.01.15 RL
			{
				showPageIsLoading(true, 'page_loading_wpTextbox1');
			}
		)		
		**/
		editor.on('beforeModeUnload', function (evt) 
			{
				showPageIsLoading(true, 'page_loading_wpTextbox1');		
			}
		)
		
		editor.on('mode', function( evt ) // Editor opened or source buttons pressed, selected editor mode is ready
			{
				// This is required by source button (source->wysiwyg).                     //12.01.15 RL 
				setSourceToggle( editor );
				
				// Remove tooltip (mouseover text) "Rich Text Editor, wpTextbox1" which is  //21.07.16 RL 
				// displayed in source mode editor view of wikitext mode
				// (based on core/editable.js at editor.on( 'mode') .. 'title'... 'ariaEditorHelpLabel').
				var editable = editor.editable();
				if ( editable  ) {
					var ariaLabel = editor.title; // = "Rich Text Editor, wpTextbox1"
					if ( ariaLabel ) {
						editable.changeAttr( 'title', '' );  
					}
				}
			}
		)
		
		editor.on( 'readOnly', function () // Event fired when the readOnly property changes.
			{
				setSourceToggle( editor ); // 12.01.15 RL: This is required by toggle link (wikieditor->wysiwyg).
			} 
		)
		
		editor.on( 'beforeSetMode', function () // Fired before the editor mode is set.
			{
				if ( editor.mode == 'source' ) {
					// 03.03.15 RL: 
					// Variable window.parent.editorSrcToWswTrigger (defined in CKeditor.body.php and set to true 
					// by event beforeSetMode or toggle link) is used to allow only one call of 
					// 'wfSajaxWikiToHTML' in function toHtml.
					//window.parent.editorSrcToWswTrigger = true;
					mw.config.set('editorSrcToWswTrigger', true);
				}
				
				// Release lock of wikitext=>wysiwyg conversion, conversion may now be activated.
				mw.config.set('wgCKeditortoDataFormatLocked', false); // 14.07.16 RL
			} 
		)		
		
		editor.on( 'toDataFormat', function( evt) { // 14.07.16 RL

			// Call of conv_toDataFormat has to be controlled because event toDataFormat may fire also when
			// wikitext => wysiwyg conversion is ready (this does not make any sence)
			// => use variable wgCKeditortoDataFormatLocked as locking flag for this:
			//  -plugins.js->editor.on( 'beforeSetMode'...  1. releasea lock wgCKeditortoDataFormatLocked = false 
			//  -ext.wysiwyg.func.js->ToggleCKEditor        1. releasea lock wgCKeditortoDataFormatLocked = false
			//  -plugins.js->conv_toHtml                    2. set lock of  wgCKeditortoDataFormatLocked = true
			//  -plugins.js->conv_toHtml=>loadHTMLFromAjax  3. end of wikitext->wysiwyg conversion triggers toDataFormat event, lock is not released here
			//  -plugins.js->editor.on( 'toDataFormat'...   4. test lock status, prevent unnecessary call of conv_toDataFormat triggered by event toDataFormat
			//  -CKeditor.body.php->
			//     (ext.wysiwyg.func.js):set_save_diff_preview_buttons
			//                                              5. release lock wgCKeditortoDataFormatLocked = false with save, preview and diff buttons of page
			
			/*****/
			if ( mw.config.get('wgCKeditortoDataFormatLocked') == false ) {
				
				mw.config.set('fck_mv_plg_strtr_span', []);  //06.11.16 RL

				//alert('toDataFormat start, estwt:' + mw.config.get('editorSrcToWswTrigger'));
	
				var data = evt.data.dataValue;   //14:evt.data.dataValue.getHtml(); 15:evt.data.dataValue;
		
				evt.data.dataValue = conv_toDataFormat( editor, data);
			}
			/****/
			
		}, null, null, 15 )	// 15 = data is available in an HTML string

		
		editor.on( 'toHtml', function( evt) { // 14.07.16 RL
	
			var data = evt.data.dataValue;
			evt.data.dataValue = conv_toHtml( editor, data, new CKEDITOR.htmlParser.filter());

		}, null, null, 4 )	// 0..4 = data is available in original string format	


		CKEDITOR.on( 'instanceReady', function ( evt ) //12.01.15 RL
			{
				//instanceReady fires when page is opened in wysiwyg or if browser is refreshed.
				//editor = evt.editor; //This is from CKeditor example of read-only mode...does not work ok here.				
				editor.setReadOnly( false );	//24.02.16 RL
			} 
		)
		
		
		// When opening a dialog, its "definition" is created for it, for
		// each editor instance. The "dialogDefinition" event is then
		// fired. We should use this event to make customizations to the
		// definition of existing dialogs.
		CKEDITOR.on( 'dialogDefinition', function( evt ) {   //19.10.15 RL
		
			// Take the dialog name and its definition from the event data.
			var dialogName = evt.data.name;
			var dialogDefinition = evt.data.definition;
			var lang = editor.lang.about;
			
			// Hide advanced- tab of table- dialog
			if ( ( dialogName == 'table' ) || ( dialogName == 'tableProperties' ) ) { // 11.06.16 RL
				dialogDefinition.removeContents('advanced');
			}     			
			
			// Check if the definition is from the "About" dialog and version info of WYSIWYG in it.
			if ( dialogName == 'about' && evt.editor.name == 'wpTextbox1' ) {			

				// Make dialog little higher
				dialogDefinition.minHeight = dialogDefinition.minHeight + 50;

				// Add text 'WYSIWYG' into title of dialog
				dialogDefinition.title = dialogDefinition.title + ' / WYSIWYG ...';			
			
				// Get a reference to the existing tab.
				var infoTab = dialogDefinition.getContents( 'tab1' );

				// Set label for exisiting 'tab1' element in CKeditor About dialog (original value '')
				//infoTab.label = "CKeditor";
				
				// Add a version text of WYSIWYG into the existing "tab1" of About- dialog.
				infoTab.add(
					{
						type: 'html',
						html:
							'<div class="cke_about_container">' +
							'<p>' +
							'<strong>WYSIWYG ' + window.parent.WYSIWYGversion + '</strong><br>' +
							'</p>' +
							'<p>' +
							lang.help.replace( '$1', '<a target="_blank" href="https://www.mediawiki.org/wiki/Extension:WYSIWYG">' + 'MediaWiki Extension:WYSIWYG' + '</a>' ) +
							'</p>' +
							'<p>' +
							'Github: <a target="_blank" href="https://github.com/Mediawiki-wysiwyg/WYSIWYG-CKeditor">https://github.com/Mediawiki-wysiwyg/WYSIWYG-CKeditor</a>' +
							'</p>' +
							'</div>'				
					}
				);								
			}
		});		
    }
});

/**
function printObject(o) { //For debug purposes
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}
**/



function reference_disable_sel( evt, editor ) { // 08.07.16 RL
	// Try to disable editing of <ref> and <references> elements, img elements are not used.
	// NOTE! Attr. contenteditable="false" would work ok with IE but not with FF or Chrome

	var sel = editor.getSelection(),
		element = null;
		
	if ( typeof(sel) != 'undefined' ) {
		element = sel.getStartElement();	
		if ( typeof element != 'undefined' && element.hasAscendant( 'ref', true ) == true || element.hasAscendant( 'references', true ) == true ) {
			sel.scrollIntoView();
		}
	}
	/****
    var ranges = editor.getSelection().getRanges();
    if (ranges.length == 1) {
        var parent = ranges[0].startContainer.getParent();

        // is the cursor is inside element
        //if (parent && parent.getAttribute('data-tab') == 'true') {
		if ( parent.hasAscendant( 'ref', true ) == true || parent.hasAscendant( 'references', true ) == true ) { 	
            var newRange = editor.createRange();
            newRange.setStartAfter(parent);
            newRange.setEndAfter(parent);
            // move the cursor after element
            editor.getSelection().selectRanges([newRange]);
        }
    }
	****/
}
				

function references_build_list( editor ) { // 08.07.16 RL
	// "editor.document.$" is the native DOM document object for "editor.document" 
	var arr = editor.document.$.getElementsByTagName("*"),  
		h = 0, i = 0, j = 0, k = 0, m = 0, num = 0, refid_num = 0,
		refs = [], refs_name = [], 
		refid = '', sstr = '', text_of_ref = '';	
		
	for ( i = 0; i < arr.length; i++ ) {
		if ( arr[i].tagName == 'REF' ) {
			/**
			alert('<ref> ind:' + i + ' tagname:' + arr[i].tagName + ' has fck_mw_reftagtext:' + 
				  arr[i].hasAttribute('fck_mw_reftagtext') + ' :' + arr[i].getAttribute('fck_mw_reftagtext')
				);
			**/
			refid_num += 1;
			refid = 'cite_ref-' +  refid_num; //refid_num (=count of all <ref>'s) is not same as (h + j + 1) (=count of unic <ref>'s
			
			if ( arr[i].hasAttribute('fck_mw_reftagtext') && arr[i].getAttribute('fck_mw_reftagtext') != '_' )
				text_of_ref = arr[i].getAttribute('fck_mw_reftagtext');
			else 
				text_of_ref = '';
			
			name_of_ref = '';
			
			if ( arr[i].hasAttribute('name') ) {
				name_of_ref = arr[i].getAttribute('name');
				if ( refs_name[ name_of_ref ] == null ) {
					num = j + 1;  // Number displayed on reference text and on list
					
					// Remember name and reference pair, at this point reference text may be undefined
					// depending on place of named reference where text is defined.
					refs.push( {reftxt:  text_of_ref,
								refname: name_of_ref
								} );

					// For list of reference texts in <references> tag.
					refs_name[ name_of_ref ] = {
						refids:  [refid],
						nbr:     num,
						qty:     1,
						reftxt:  text_of_ref
					};
					
					// Set tooltip for "mouseover"
					arr[i].setAttribute( 'title', '[' + name_of_ref + ']: ' + refs_name[ name_of_ref ][ 'reftxt' ] );
					
					/***
					alert('ref_name:' + arr[i].getAttribute('name') 
							+ ' fck_mw_reftagtext:' + text_of_ref 
							+ ' tulos:'   + refs_name[arr[i].getAttribute('name')]['reftxt']
							+ ' refids[0]:' + refs_name[ name_of_ref ][ 'refids' ][0]
						
						);
					***/

					j += 1;      //for next loop
				}
				else {
					num = refs_name[ name_of_ref ]['nbr'];            // Use earlier defined number for this reference
					refs_name[ name_of_ref ][ 'qty'    ] += 1;        // Qty of references to this named reference 
					refs_name[ name_of_ref ][ 'refids' ].push(refid); // Build list of id's of places where this named reference is used

					/***
					//This fixes missing tooltip with later <ref>'s which are using same "name"
					if ( refs_name[ name_of_ref ]['reftxt'] != '_' ) {
						arr[i].setAttribute( 'title', '[' + name_of_ref + ']: ' + refs_name[ name_of_ref ][ 'reftxt' ] );
					}
					***/
					
					// Fix tooltip for "mouseover" when <ref>'s using name=".."
					arr[i].setAttribute( 'title', '[' + name_of_ref + ']: ' + text_of_ref );
					
					// Update reference text in our lists, in case it has not yet been defined.
					if ( text_of_ref != '' && 
						 refs_name[ name_of_ref ]['reftxt'] == '' ) {
						/***
						alert('3fixing prev. name,' 
								+ nmb:' + refs_name[ name_of_ref ]['reftxt'] 
								+ ' :'  + refs_name[ name_of_ref ]['nbr'] 
								+ ' :'  + refs_name[ name_of_ref ]['refids'][0] );
						***/
							 
						refs_name[ name_of_ref ]['reftxt']                    = text_of_ref;
						refs[refs_name[ name_of_ref ]['nbr'] - 1][ 'reftxt' ] = text_of_ref;	
						
						/***
						// This fixes tooltip in earlier places where this named reference has been used.
						for ( m = 0; m < refs_name[ name_of_ref ][ 'refids' ].length; m++) {
							
						}
						***/
					}
				}
			} else {
				num = j + 1;  // Number displayed on reference text and on list
				refs.push( {reftxt:  text_of_ref, // For list of references
							refname: ''
						   } );
				arr[i].setAttribute( 'title', text_of_ref );   // Set tooltip for "mouseover"
					
				j += 1;       // for next loop
			}

			arr[i].setAttribute( 'id', refid );                                                          // F.ex id="cite_ref-1"
			
			//arr[i].innerHTML = '<a href="#cite_note-' + (h + num) + '">&#91;' + (num) + '&#93;</a>';   // <a href="#cite_note-1">[1]</a>
			arr[i].innerHTML = '&#91;' + (num) + '&#93;';
			//arr[i].innerHTML = '&#91;' + (num + (name_of_ref != '' ? '.' + (refs_name[ name_of_ref ][ 'qty' ] - 1) : '' )) + '&#93;';  
		} 
		else if ( arr[i].tagName == 'REFERENCES') { 
			//alert('<references> ind:' + i + ' tagname:' + arr[i].tagName + ' class:' + arr[i].getAttribute('class'));

			/**
			for ( k = 0; k < refs.length; k++ ) {
				if ( refs[k]['refname'] != '' )
				alert('ref:' + refs[k]['reftxt'] + ' refname:' + refs[k]['refname'] 
						+ ' refids[0]' + refs_name[ refs[k]['refname'] ]['refids'][0]
						+ ' qty:'    + refs_name[ refs[k]['refname'] ]['qty']
						+ ' nbr:'    + refs_name[ refs[k]['refname'] ]['nbr']
						);
			}
			**/
			
			arr[i].setAttribute( 'title', editor.lang.mwplugin.references_noedit ); // Tooltip: "Do not modify references here."
			arr[i].innerHTML = '';
						
			if ( refs.length == 0 ) {                                // Remove unnecessary <references> element.
				arr[i].innerHTML = 'References_remove_tag';          // In case remove fails, so we can see placeholder on page
				
				 // <..parenttag..><span -childtag- ><refereces>...  <R>- text based element
				//arr[i].parentNode.parentNode.removeChild( arr[i].parentNode );
				
				 // <..parenttag..><span -childtag- > <span -childtag- ><refereces>... <R>- widget has addition parent <span> tag
				arr[i].parentNode.parentNode.parentNode.removeChild( arr[i].parentNode.parentNode );
			} else {
				//arr[i].innerHTML = 'References2';
				/***/
				for ( k = 0; k < refs.length; k++ ) {
					if ( arr[i].innerHTML.length > 0 ) arr[i].innerHTML += '<br>';
					
					// If we have named reference, build list of these numbers in sstr, f.ex. "4.0  4.1  4.2"
					sstr = '';
					if ( refs[k]['refname'] != '' && refs_name[ refs[k]['refname'] ]['qty'] > 0 ) {
						for ( m=0; m < refs_name[ refs[k]['refname'] ]['qty']; m++ ) {
							sstr += refs_name[ refs[k]['refname'] ]['nbr'] + '.' + m + '&nbsp;&nbsp;';	
						}
						sstr = '<font color="blue"><sup>' + sstr + '[' + refs[k]['refname'] + ']&nbsp;&nbsp;</sup></font>';
					} else sstr = '';

					// Numbered list of references. 
					// NOTE! For some reason href- links between reference number and reference text on list did not work inside CKeditor window
					// <span id="cite_note-1">1. <a href="#cite_ref-1">↑</a> xxxxxxxxxx</span><br/>
					// arr[i].innerHTML += '<span id="cite_note-' + (h + k + 1) + '">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + ( k + 1 ) + '. <a href="#cite_ref-' + (h + k + 1) + '">&uarr;</a> ' + refs[k] + '</span>';
					arr[i].innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + ( k + 1 ) + '. <font color="blue">↑</font> ' + sstr + refs[k]['reftxt']; //&uarr;
				}
				/***/
			}
			// Reset variables for next <references> tag
			refs_name = [];
			refs = [];
			h = j;     //Link id's (href="...") are numbered sequentially over all <references> tags.
			j = 0;
		}
	}	

	// Update the "CKEDITOR.dom.document" object based on the native DOM object.
	// http://ckeditor.com/forums/CKEditor-3.x/Traversing-NodesElements-CKEditors-Content
	editor.updateElement();  
}


function linkbuttons_on_off( editor ) {

	// To enable / disable unlink button, taken from 
	// http://docs.cksource.com/ckeditor_api/symbols/src/plugins_link_plugin.js.html 
	// 06.03.15 Varlin: 
	// Event editor.on( 'selectionChange' is fired only on selection change (and not within a same <p>)
	// Enabling/disabling link buttons moved from event "editor.on( 'selectionChange'...)" here,
	// which test all kind of selections. 

	if ( editor.readOnly ) return; 
	

	var sel = editor.getSelection(), 
		cmd_unlink = editor.getCommand( 'unlink' ), 
		cmd_MWSimpleLink = editor.getCommand( 'MWSimpleLink' );

	// get html in selection and search for links (can't be donne with sel) 
	// 08.07.16 RL:-> Replaced by "editor.document.$"
	// var iframe2 = document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0]; 
	// var sel2 = iframe2.contentDocument.getSelection(); 
	
	var sel2 = editor.document.$.getSelection();  // 08.07.16 RL:<- "editor.document.$" = native DOM document object for "editor.document"
	if (sel2.rangeCount > 0) var clonedSelection = sel2.getRangeAt(0).cloneContents(); 

	cmd_MWSimpleLink.setState( CKEDITOR.TRISTATE_DISABLED );     //Disable Simplelink 

	// if selection is inside a link or has a link inside...      
	if ( typeof clonedSelection != 'undefined' && ( editor.elementPath().contains('a') || clonedSelection.querySelectorAll('a').length > 0 ) ) 
		cmd_unlink.setState( CKEDITOR.TRISTATE_OFF );            //Enable Unlink 
	else { 
		cmd_unlink.setState( CKEDITOR.TRISTATE_DISABLED ); 		 //Disable Unlink 
		// if selection is a text (not an element), at least one character 
		if ( typeof sel != 'undefined' && sel.getType() != CKEDITOR.SELECTION_ELEMENT && sel.getSelectedText().length > 0 ) 
		cmd_MWSimpleLink.setState( CKEDITOR.TRISTATE_OFF );      //Enable Simplelink 					
	} 
} 


function setSourceToggle( editor ) { //12.01.15 RL: Enable/disable source button and toggle link

	var objId = 'wpTextbox1',
		oToggleLink = document.getElementById( 'toggle_' + objId );				
	// CKEDITOR.instances[objId ].commands.source.enable(); //At this point already enabled by CKeditor
	if ( oToggleLink ) {
		if ( editor.mode == 'wysiwyg' ) {
			oToggleLink.innerHTML = mw.config.get('editorMsgOff');
		} else {  
			oToggleLink.innerHTML = mw.config.get('editorMsgOn');
		}
		// Prolonged disable of toggle link with editorForceReadOnly.		
		if ( editor.mode == 'wysiwyg' && mw.config.get('editorForceReadOnly') == false ) {
			oToggleLink.style.visibility = 'visible'; //Show toggle link in wysiwyg mode
		} else {
			oToggleLink.style.visibility = 'hidden';  //Hide toggle link source mode
		}
	}
	// Prolonged disable of source button with editorForceReadOnly.
	// We are waiting for html conversion to be ready, disable source button when menu and editor is ready 
	// in wysiwyg mode but when source button is still enabled despite of read-only mode.
	if ( editor.mode == 'wysiwyg' && mw.config.get('editorForceReadOnly') == true ) { 
		editor.commands.source.disable();
	} 
	if ( editor.mode == 'source' ) {
		showPageIsLoading( false, 'page_loading_' + objId );
	}
}


function toggleReadOnly( isReadOnly ) { //12.01.15 RL 
	// Change the read-only state of the editor.
	// http://docs.ckeditor.com/#!/api/CKEDITOR.editor-method-setReadOnly
		
	var objId = 'wpTextbox1',
	    editor = CKEDITOR.instances[objId],
		command,
		oToggleLink = document.getElementById( 'toggle_' + objId ),
		mode = editor.mode;		

	if ( mode == '' ) mode = 'wysiwyg'; //In source->wysiwyg direction wysiwyg may not be ready yet => force mode

	
	for ( var name in editor.commands ) {
		command = editor.commands[name];
		//command.disable();  //command.enable();
		isReadOnly ? command.disable() : command[ command.modes[ mode ] ? 'enable' : 'disable' ]();
	}

	//In read-only mode source button seems still to be enabled, so disable it
	if ( isReadOnly == true ) {
		showPageIsLoading( true, 'page_loading_' + objId );
		mw.config.set('editorForceReadOnly',true);
		editor.commands.source.disable(); //This is here on purpose
		editor.setReadOnly( true );
		if ( oToggleLink ) {
			oToggleLink.style.visibility = 'hidden';
		}
	} else {	
		mw.config.set('editorForceReadOnly',false);
		editor.commands.source.enable(); //This is here on purpose			
		
		//editor.setReadOnly( false ); //This seems to crash for some reason! => other plugins will not react to cancel of read-only mode
		editor.readOnly = false;                           //...use this as temporary fix, but ...	
		if ( typeof editor.undoManager !== 'undefined' ) { //.. in case undo plugin is enabled we have to manually... //10.02.15 RL->
			editor.undoManager.enabled = true;             //...enable undo/redo functions after canceling of read-only mode... 
			editor.undoManager.reset();                    //...and clear old undo snapshots. //10.02.15 RL<-
		}

		if ( oToggleLink ) {
			oToggleLink.style.visibility = '';
			if ( editor.mode == 'wysiwyg' ) 
				oToggleLink.innerHTML = mw.config.get('editorMsgOff');
			else  
				oToggleLink.innerHTML = mw.config.get('editorMsgOn');
		}
		showPageIsLoading( false, 'page_loading_' + objId );
	}	
	editor.focus(); //Set focus to editor to get elements of menu activated.
}


function showPageIsLoading( disp, loadingId ) { //12.01.15 RL
	// Message "please wait, page is loading..." does not fully work:
	// -browser issues: works better in FF than IE (=text is not always displayed and required use of toggle link first)
	//  =>is now in use only in case toggle link is enabled (because of location of text)
	var objId = 'wpTextbox1',
		//loadingId = 'page_loading_' + objId,
		loadingLoc = null,
		loading = document.createElement( 'div' ),
		loadingObj = document.getElementById( loadingId );
	
	if ( !loadingLoc ) loadingLoc = document.getElementById( 'toggle_' + objId ); //toggle_wpTextbox1
	//if ( !loadingLoc ) loadingLoc = document.getElementById( 'toolbar' ); //toolbar
	//if ( !loadingLoc ) loadingLoc = document.getElementById( objId ); //SRCtextarea
	//if ( !loadingLoc ) loadingLoc = document.getElementById( 'editform' ); //editform
	
	if ( !loadingObj && loadingLoc ) {
		loadingLoc.parentNode.insertBefore( loading, loadingLoc );
		loading.innerHTML = '<a class="fckPageLoading" id="' + loadingId  
			+ '" style="display:inline;visibility:hidden;position:absolute;right:5px;font-size:0.8em" href="javascript:void(0)" onclick="">' 
			+ mw.config.get('editorWaitPageLoad') +'</a> ';
		loadingObj = document.getElementById( loadingId );
	} 

	if ( loadingObj && loadingLoc ) {

		if ( disp ) {
			loadingObj.style.visibility = 'visible';
		} else {	
			loadingObj.style.visibility = 'hidden';	
		}	
	}
}

function joinObjArrays(obj1, obj2) {  // 01.07.16 RL
	// join two assosiative array objects into one
    var a_arr = [], p;
    for (p in obj1)
        a_arr[p] = obj1[p];
	for (p in obj2)
        a_arr[p] = obj2[p];
    return a_arr;
}

function fck_mv_plg_addToStrtr( text, replaceLineBreaks ) { //16.01.15 RL 
	// For html->wikitext, based on fck_addToStrtr.
	// Store "text" to be replaced into array [key1:"text1", key2:"text2", ...] 
	// and return "key" which is used to replace the original text.
	
	// Create key
	_fck_mv_plg_strtr_span_counter = mw.config.get('fck_mv_plg_strtr_span_counter');
	key = 'Fckmw' + _fck_mv_plg_strtr_span_counter + 'fckmw'; 
	mw.config.set('fck_mv_plg_strtr_span_counter', _fck_mv_plg_strtr_span_counter + 1);

	// Store new text in assosiative array
	var new_span = [];
	var _fck_mv_plg_strtr_span = [];
	
	if( replaceLineBreaks ) { 
		new_span[key] = text.replace( array( "\r\n", "\n", "\r" ), 'fckLR');
	} else {
		new_span[key] = text;
	}
	
	_fck_mv_plg_strtr_span = joinObjArrays(mw.config.get('fck_mv_plg_strtr_span'), new_span); // 01.07.16 RL
	mw.config.set('fck_mv_plg_strtr_span', _fck_mv_plg_strtr_span );

	return key;
}

function remove_htmlhead(text) { //14.07.16 RL 
	// _getNodeFromHtml switched from "text/xml" to "text/html" 
	// =>this leaves extra <html><head></head> tags as first
	//   and </html> as last elements => remove them.
	text = text.replace(/^<html><head><\/head>/, ''); // ^ = starting "<html><head></head>" //11.08.16 RL Removed \n
	text = text.replace(/<\/html>$/, '');             // $ = ending   "</html>"             //11.08.16 RL Removed \n
	return text;	
}

function fck_mv_plg_revertEncapsulatedString(text) { //16.01.15 RL 
	// For html->wikitext, based on revertEncapsulatedString.
	// Restore original texts into page from array [key1:"text1", key2:"text2", ...]

	if (matches = text.match(/Fckmw\d+fckmw/g)) { //Are there keys to be replaced.
		is = matches.length;
		//alert('comments_qty:' + is + ' 1.key:' + matches[0] + ' value:' + mw.config.get('fck_mv_plg_strtr_span')[matches[0]]);			
		for (i = 0; i < is; i++ ) { // Replace each key with original text.
			// comments are directly in the main key FckmwXfckmw
			_fck_mv_plg_strtr_span = mw.config.get('fck_mv_plg_strtr_span');
			//alert('comments_qty:' + (i + 1) + '/' + is + ' key:' + matches[i] + ' value:' + _fck_mv_plg_strtr_span[matches[i]]);						
			if ( (typeof _fck_mv_plg_strtr_span[matches[i]] != 'undefined' ) &&
				 (_fck_mv_plg_strtr_span[matches[i]].substr(0, 4) == '<!--') ) {
				text = text.replace( matches[i],
									 _fck_mv_plg_strtr_span[matches[i]]);
			}			
			else if (typeof _fck_mv_plg_strtr_span['href="' + matches[i] + '"'] != 'undefined') {
				text = text.replace( matches[i],
									 substr(_fck_mv_plg_strtr_span['href="' + matches[i] + '"'], 6, -1) );
			}
		}
	}	
	return text;
}

function fck_mw_plg_replaceHTMLcomments( text ) { //16.01.15 RL 
	// For html->wikitext, based on fck_replaceHTMLcomments.

	//mw.config.set('fck_mv_plg_strtr_span', []);  //06.11.16 RL
	mw.config.set('fck_mv_plg_strtr_span_counter', 0);
	
	while( ( start = text.indexOf( '<!--' ) ) != -1 ) {
	
		end = text.indexOf( '-->', start + 4 );	
		if ( end == -1 ) {
			// Unterminated comment; bail out
			break;
		}

		end += 3;
				
		// Trim space and newline if the comment is both
		// preceded and followed by a newline
		spaceStart = Math.max( start - 1, 0 );
		spaceLen = end - spaceStart;

		while( text.substr( spaceStart, 1 ) == ' ' && spaceStart > 0 ) {
			spaceStart--;
			spaceLen++;
		}
		while( text.substr( spaceStart + spaceLen, 1 ) == ' ' )
			spaceLen++;

		if( text.substr( spaceStart, 1 ) == "\n" && text.substr( spaceStart + spaceLen, 1 ) == "\n" ) {
			// Remove the comment, leading and trailing spaces, and leave only one newline.
			replacement = fck_mv_plg_addToStrtr( text.substr( spaceStart, spaceLen + 1 ), false );
			// text = text.replace( replacement + "\n", spaceStart, spaceLen + 1 ); // From php -code
			text = text.substr(0,spaceStart) + replacement + "\n" + text.substr(spaceStart + spaceLen + 1) ;
		} else {
			// Remove just the comment.
			replacement = fck_mv_plg_addToStrtr( text.substr( start, end - start ), false );
			// text = text.replace( replacement, start, end - start ); // From php -code
			text = text.substr(0,start) + replacement + text.substr(end) ;
		}
		//alert('fck_mw_plg_replaceHTMLcomments fck_mv_plg_strtr_span_counter:' + fck_mv_plg_strtr_span_counter + ' replacement:' + replacement + ' text:' + text );		
	}
	return text;
}


/*
 * 14.07.16 RL: Following function has earlier been inside custom dataprocessor definitions.
 * conv_toHtml:
 */ 
function conv_toHtml ( editor, data, dataFilter, fixForBody ) {

	// Set lock ofor wikitext=>wysiwyg conversion, conversion may not be activated, 
	// because we are doing conversion in other direction.
	// See editor.on( 'toDataFormat'... for some details about wgCKeditortoDataFormatLocked.
	mw.config.set('wgCKeditortoDataFormatLocked', true); // 14.07.16 RL
	//alert('conv_toHtml start, etdfl:' + mw.config.get('wgCKeditortoDataFormatLocked'));
		
	var loadHTMLFromAjax = function( result ){
		// We are here (2.) when async responce from server has been received and
		// wikitext data has been converted to wysiwyg mode.
		
		/*27.06.16 RL Not supported****
		if ( window.parent.popup &&
			 window.parent.popup.parent.wgCKeditorInstance &&
			 window.parent.popup.parent.wgCKeditorCurrentMode != 'wysiwyg' ) {

			if (typeof result.responseText != 'undefined') //22.02.16 RL MW1.26, change with ajax call
				window.parent.popup.parent.wgCKeditorInstance.setData(result.responseText);
			else
				window.parent.popup.parent.wgCKeditorInstance.setData(result);

			 window.parent.popup.parent.wgCKeditorCurrentMode = 'wysiwyg';
		}
		else 
		*****/
		if (  mw.config.get('wgCKeditorInstance') &&
			 (mw.config.get('wgCKeditorCurrentMode') != 'wysiwyg' ) ) {

			if (typeof result.responseText != 'undefined') //22.02.16 RL MW1.26, change with ajax call
				mw.config.get('wgCKeditorInstance').setData(result.responseText);
			else
				mw.config.get('wgCKeditorInstance').setData(result);

			mw.config.set('wgCKeditorCurrentMode', 'wysiwyg');
			toggleReadOnly( false ); //12.01.15 RL
			
			// 14.07.15 RL:
			// For some reason after this step event toDataFormat will be activated, which does not 
			// make any sence because we just did wikitext->wysiwyg conversion which is ready after this step.
			// For this reason keep wgCKeditortoDataFormatLocked locked so that it will prevent call of function
			// conv_toDataFormat by event.
			// mw.config.set('wgCKeditortoDataFormatLocked', false); // true=keep locked, do not release here.
			
			//alert('toHtml 2 loadHTMLFromAjax set, edtfl:' + mw.config.get('wgCKeditortoDataFormatLocked'));
		}
	}

    // Prevent double transformation because of some weird issue.
	// 12.01.15 RL, 03.03.15 RL:
	//   There are two calls of "toHtml" when source button or toggle link is pressed in source mode.
	//   Rule below tests when page still has wikitext and is in source mode.
	//   Variable window.parent.editorSrcToWswTrigger (defined in CKeditor.body.php and set to true 
	//   by event beforeSetMode or toggle link) is used to allow only one call of 'wfSajaxWikiToHTML' below.
	//
    // if ( !(data.indexOf('<p>') == 0 && //12.01.15 RL->Commented out
    //        data.match(/<.*?_fck_mw/) || 
	//        data.match(/class="fck_mw_\w+"/i)) ) { //12.01.15 RL<-
	//
	// if ( (data.match('<p>') == null) && //03.03.15 RL->Commented out
	//	    (data.match(/<.*?_fck_mw/) == null) &&
	//	    (data.match(/class="fck_mw_\w+"/i) == null) &&     //03.03.15 RL<-		
	if ( mw.config.get('editorSrcToWswTrigger') == true && //03.03.15 RL
		 mw.config.get('wgCKeditorInstance') &&                //Because of TransformTextSwitcher plugin
		 mw.config.get('wgCKeditorCurrentMode') != 'wysiwyg' ) //Because of TransformTextSwitcher plugin
	{			
		//alert('toHtml 1 if,  emode:' + editor.mode + ' data:' + data);
		
		// We are here (1.) when in wikitext- mode source- button or toggle- link has been pressed and we have "first" pass of toHtml.
		mw.config.set('editorSrcToWswTrigger', false); //03.03.15 RL
		toggleReadOnly( true );                        //12.01.15 RL
		
		// Use Ajax to transform the Wikitext to HTML
		/*27.06.16 RL Not supported****
		if( window.parent.popup ){
			window.parent.popup.parent.FCK_sajax( 'wfSajaxWikiToHTML', [data, window.parent.popup.wgPageName], loadHTMLFromAjax );
		} else {
		***/	
			window.parent.FCK_sajax( 'wfSajaxWikiToHTML', [data, mw.config.get('wgPageName')], loadHTMLFromAjax );
		/*}*/
		return '<a class="fckPageLoading"><i>' + mw.config.get('editorWaitPageLoad') + '</i></a>'; // 24.03.16 RL  Show text "page is loading..."
	}
	else { // 24.03.16 RL  Added 'else {' and '}'
		//alert('toHtml 3, else,  emode:' + editor.mode);
		
		// We are here (3.) in case page is opened for editing for the first time or
		// when in wikitext- mode source- button or toggle- link has been pressed and we have "second" pass of toHtml.
		var fragment = CKEDITOR.htmlParser.fragment.fromHtml( data, fixForBody ),
			writer = new CKEDITOR.htmlParser.basicWriter();
	
		fragment.writeHtml( writer, dataFilter ); //this.dataFilter
		data = writer.getHtml( true );
		return data; // Show wikipage in html format...
	}	
}


/*
 * 14.07.16 RL: Following function has earlier been inside custom dataprocessor definitions.
 *              See editor.on( 'toDataFormat'... for some details.
 * Converts a DOM (sub-)tree to a string in the data format.
 *     @param {Object} rootNode The node that contains the DOM tree to be
 *            converted to the data format.
 *     @param {Boolean} excludeRoot Indicates that the root node must not
 *            be included in the conversion, only its children.
 *     @param {Boolean} format Indicates that the data must be formatted
 *            for human reading. Not all Data Processors may provide it.
 */
function conv_toDataFormat(editor, data, fixForBody) {
	
	if ( (mw.config.exists('showFCKEditor') &&
		!(mw.config.get('showFCKEditor') & mw.config.get('RTE_VISIBLE'))) )
		return window.parent.document.getElementById(mw.config.get('wgCKeditorInstance').name).value;
	
	if (mw.config.exists('wgCKeditorCurrentMode'))
		mw.config.set('wgCKeditorCurrentMode', 'source');
	/*27.06.16 RL Not supported****
		else if (window.parent.popup && window.parent.popup.parent.wgCKeditorCurrentMode)
			window.parent.popup.parent.wgCKeditorCurrentMode = 'source';
	****/		
	
	if (CKEDITOR.env.ie) {
		data = this.ieFixHTML(data, false); //this.ieFixHTML
	}
	
	//data = '<body xmlns:x="http://excel">' + data.htmlEntities() + '</body>';              //14.07.16 RL
	data = '<?xml version="1.0" encoding="UTF-8"?><body>' + data.htmlEntities() + '</body>'; //14.07.16 RL
	//data = '<!DOCTYPE html><html><head></head>' + data.htmlEntities() + '</html>;
	
	// fix <img> tags
	data = data.replace(/(<img[^>]*)([^/])>/gi, '$1$2/>' );
	// fix <hr> and <br> tags
	data = data.replace(/<(hr|br)>/gi, '<$1/>' );
	// and the same with attributes
	data = data.replace(/<(hr|br)([^>]*)([^/])>/gi, '<$1$2$3/>' );
	// remove some unncessary br tags that are followed by a </p> or </li>
	data = data.replace(/<br\/>(\s*<\/(p|li|h1|h2|h3|h4|h5|h6)>)/gi, '$1');  //09.01.14 RL Added h1,h2,h3,h4,h5,h6 to keep edit link on same line as header
	// also remove <br/> before nested lists
	data = data.replace(/<br\/>(\s*<(ol|ul)>)/gi, '$1');
	// in IE the values of the class and alt attribute are not quoted
	data = data.replace(/class=([^\"].*?)\s/gi, 'class="$1" ');
	data = data.replace(/alt=([^\"].*?)\s/gi, 'alt="$1" ');
	
	// Fix1:
	//  When pasting data from excel there may be an unmatched <col> elements left, which should be removed,
	//  this happens at least with IE => remove them:
	//    data = data.replace(/<col[^>]*>/gi, '' );
	// Fix2, 27.06.16 RL:
	//  Problem with prev. reg.ex. /<col[^>]*>/gi is that it matches also <colgroup> elements in unbalanced way
	//  corrupting data;
	//    -prev. works with this: ...<col width="64" style="width;48pt;">... by removing it completely,
	//     but it corrupts this:  ...<colgroup><col width="64" style="width;48pt;"></colgroup>... by leaving ending tag </colgroup> left
	//  =>following two lines will strip first only <colgroup> tags and after that <col> tags:
	//    data = data.replace(/<colgroup>.*<\/colgroup>/gi, '' );
	//    data = data.replace(/<col[^>]*>/gi, '' );                
	// Fix3, 01.07.16 RL:
	//  Previous may strip valid <colgroup> tags
	//  =>following will strip first all starting <col> tags and then possible closing </col> tags: 
	//  step1:    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx      yyyyyyyzzzzz       mmmmmnnnnnooooo
	//  step2:                                                                                          qqqqqq
	//  ----------                                              ------                                        -----------
	//  <colgroup><col width="64" style="width;48pt;">aaaaaaaaaa<tag1><col>  <col></tag1><col><col><col></col></colgroup>
	data = data.replace(/<col[ >][^<\/]*/gi, '' ); // 01.07.16 RL
	data = data.replace(/<\/col>/gi, '' );         // 01.07.16 RL
	
	// 06.04.14 Varlin: remove <wbr> tags that causes parser to crash
	data = data.replace(/<wbr>/gi, '' );
	
	// Replace html comments by "Fckmw<id>fckmw" -keys (where <id>=0,1,2..) 
	// so that possible incomplete xml structure of commented block
	// will not prevent page handling (f.ex <!-- 1. incomplete html comment -- <!-- 2. complete html comment -->)
	// MW seems to work like this with wikitext -> html conversion.	
	data = fck_mw_plg_replaceHTMLcomments( data ); //16.01.14 RL
	
	/***
	var hsrt = data;
	while( hsrt && hsrt.length > 0 ) {
		if (hsrt.length > 160) {
			console.log (hsrt.substring(0,160));
			hsrt = hsrt.substring(160);
		} else {
			console.log (hsrt);
			hsrt = '';
		}	
	}
	****/
	
	var rootNode = this._getNodeFromHtml( data ); //this.
	
	if ( !rootNode ) return false; //16.01.14 RL IE catches some exeptions with page
	
	// rootNode is <body>.
	// Normalize the document for text node processing (except IE - #1586).
	if ( !CKEDITOR.env.ie ) {
		rootNode.normalize();
	}

	var stringBuilder = new Array();
	this._AppendNode( editor, rootNode, stringBuilder, '' );  //this.
	
	// 14.07.16 RL _getNodeFromHtml switched from "text/xml" to "text/html" 
	// =>variable "data" contains extra <html><head></head> tags as first
	//   and </html> as last elementa => remove them.
	var data2 =  remove_htmlhead(stringBuilder.join( '' ).Trim());                    //14.07.16 RL
	
	// Restore original html comments from "Fckmw<id>fckmw" -keys.
	return fck_mv_plg_revertEncapsulatedString( data2 );                              //14.07.16 RL
	// return fck_mv_plg_revertEncapsulatedString( stringBuilder.join( '' ).Trim() ); //16.01.15 RL
	// return stringBuilder.join( '' ).Trim();                                        //16.01.15 RL
	
}


// 14.07.16 RL Custom dataprocessor is not used anymore, 
// replaced by events toDataFormat and toHtml, needed only for debug/testing purposes.
CKEDITOR.customprocessor = function( editor )
{
   this.editor = editor;
   this.writer = new CKEDITOR.htmlWriter();
   this.dataFilter = new CKEDITOR.htmlParser.filter();
   this.htmlFilter = new CKEDITOR.htmlParser.filter(); 
};

// 14.07.16 RL Custom dataprocessor is not used anymore, 
// replaced by events toDataFormat and toHtml, needed only for debug/testing purposes.
CKEDITOR.customprocessor.prototype =
{
   _inPre    : false,
   _inLSpace : false,
 
   toHtml : function( data, fixForBody )
   {	   
		return conv_toHtml(this.editor, data, fixForBody, this.dataFilter);
   },

	/*
	 * Converts a DOM (sub-)tree to a string in the data format.
	 *     @param {Object} rootNode The node that contains the DOM tree to be
	 *            converted to the data format.
	 *     @param {Boolean} excludeRoot Indicates that the root node must not
	 *            be included in the conversion, only its children.
	 *     @param {Boolean} format Indicates that the data must be formatted
	 *            for human reading. Not all Data Processors may provide it.
	 */
	toDataFormat : function( data, fixForBody ){
		mw.config.set('fck_mv_plg_strtr_span', []);  //06.11.16 RL
		return conv_toDataFormat( this.editor, data, fixForBody);
	}
};


// 14.07.16 RL:
// Following functions have earlier been inside custom dataprocessor definitions.
// After using toDataFormat and toHtml listenr events, they were moved outside of it
{
	/*** Testing effects of prototype definition for "xmlDoc=parser.parseFromString();" ***
	(function(DOMParser) {  
		"use strict";  
		var DOMParser_proto = DOMParser.prototype  
		, real_parseFromString = DOMParser_proto.parseFromString;
	
		// Firefox/Opera/IE throw errors on unsupported types  
		try {  
			// WebKit returns null on unsupported types  
			if ((new DOMParser).parseFromString("", "text/html")) {  
				// text/html parsing is natively supported  
				return;  
			}  
		} catch (ex) {}  
	
		DOMParser_proto.parseFromString = function(markup, type) {  
		
			if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {  
				var doc = document.implementation.createHTMLDocument("")
				, doc_elt = doc.documentElement
				, first_elt;
	
				doc_elt.innerHTML = markup;
				first_elt = doc_elt.firstElementChild;
	
				if (doc_elt.childElementCount === 1
					&& first_elt.localName.toLowerCase() === "html") {  
					doc.replaceChild(first_elt, doc_elt);  
				}  
	
				return doc;  
			} else {  
				return real_parseFromString.apply(this, arguments);  
			}  
		};  
	}(DOMParser));	
	********/

	this._inLSpace = false;
	this._inPre    = false;
	
	// Collection of element definitions:
	//		0 : Prefix
	//		1 : Suffix
	//		2 : Ignore children
	this._BasicElements = {
		body	: [ ],
		b		: [ "'''", "'''" ],
		strong	: [ "'''", "'''" ],
		i		: [ "''", "''" ],
		em		: [ "''", "''" ],
		p		: [ '\n', '\n' ],
		h1		: [ '\n= ', ' =\n' ],
		h2		: [ '\n== ', ' ==\n' ],
		h3		: [ '\n=== ', ' ===\n' ],
		h4		: [ '\n==== ', ' ====\n' ],
		h5		: [ '\n===== ', ' =====\n' ],
		h6		: [ '\n====== ', ' ======\n' ],
		br		: [ '<br/>', null, true ],
		hr		: [ '\n----\n', null, true ]
	};
	
	
	_getNodeFromHtml = function( data ) {

		// 14.07.16 RL 
		// Originally, custom dataprocessor used format "text/xml" (with all browsers) but
		// dataprocessor of CKeditor (=listener event toDataFormat, CKeditor >=4.1) fails with this, 
		// because toDataFormat event takes place at different stage compared to custom dataprocessor.
		// With listeners of events 'toDataFormat' (and toHtml):
		//  -"text/xml" fails fails with all browsers (wysiwyg->wikitext)
		//  -FF and Chrome work with "text/html" but not IE
		//  -FF, Chrome and IE parses ok with "application/xml" but fails otherwise
		//  -IE works ok with application/xhtml+xml (NOTE! compatibility mode is forced to IE9)
		var xmlform = 'text/html';
		
		if (CKEDITOR.env.ie) 
			xmlform = 'application/xhtml+xml';

        if (window.DOMParser) {  // all other browsers, except IE before version 9 (<=IE8)	
            parser=new DOMParser();
            try {         // 16.01.15 RL	
                var xmlDoc=parser.parseFromString(data,xmlform); //14.07.16 RL Was "text/xml"
            } catch (e) { // 16.01.15 RL
                // not well-formed text raises an exception in IE from version 9, others let it continue
                alert ("XML parsing error [ plugin.js->_getNodeFromHtml (if) ]");
                //return false;
			};
        }
        else // Internet Explorer before version 9    
		{
            data = this.ieFixHTML(data); //this.ieFixHTML(data);	
			try {         // 16.01.15 RL
                var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            } catch (e) { // 16.01.15 RL
                alert ("XML parsing error [ plugin.js->_getNodeFromHtml (else) ]");
                return false;                
            }
			xmlDoc.async="false";
            xmlDoc.loadXML(data);
        }

		/****
		alert ("Parsing status check:" + xmlDoc);
		var errorMsg = null;
		if (xmlDoc.parseError && xmlDoc.parseError.errorCode != 0) {
			errorMsg = "XML Parsing Error: " + xmlDoc.parseError.reason
					+ " at line " + xmlDoc.parseError.line
					+ " at position " + xmlDoc.parseError.linepos;
		}
		else {
			if (xmlDoc.documentElement) {
				if (xmlDoc.documentElement.nodeName == "parsererror") {
					errorMsg = xmlDoc.documentElement.childNodes[0].nodeValue;
				}
			}
			else {
				errorMsg = "XML Parsing Error!";
			}
		}
		
		if (errorMsg) {
			alert (errorMsg);
			return false;
		}
		alert ("Parsing was successful!");
		*****/
    	
        var rootNode = xmlDoc.documentElement;
        return rootNode;
    };
	
	ieFixHTML = function(html, convertToLowerCase){
		var zz = html;
        zz = zz.replace( /\s+data-cke-expando=".*?"/g, '' ); //09.02.14 RL: In IE8, we need to remove the expando attributes.	
		var z = zz.match(/<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/g);
		if (z) {
			for (var i = 0; i < z.length; i++) {
				var y, zSaved = z[i], attrRE = /\=[a-zA-Z\.\:\[\]_\(\)\&\$\%#\@\!0-9]+[?\s+|?>]/g;
				z[i] = z[i].replace(/(<?\w+)|(<\/?\w+)\s/, function(a){
					return a.toLowerCase();
				});
				y = z[i].match(attrRE);//deze match
				if (y) {
					var j = 0, len = y.length
					while (j < len) {
						var replaceRE = /(\=)([a-zA-Z\.\:\[\]_\(\)\&\$\%#\@\!0-9]+)?([\s+|?>])/g, replacer = function(){
							var args = Array.prototype.slice.call(arguments);
							return '="' + (convertToLowerCase ? args[2].toLowerCase() : args[2]) + '"' + args[3];
						};
						z[i] = z[i].replace(y[j], y[j].replace(replaceRE, replacer));
						j++;
					}
				}
				zz = zz.replace(zSaved, z[i]);
			}
		}
		return zz;
	};


	// This function is based on FCKXHtml._AppendNode.
	_AppendNode = function( editor, htmlNode, stringBuilder, prefix ){
		if ( !htmlNode )
			return;
		
		switch ( htmlNode.nodeType ){
			// Element Node.
			case 1 :

				// Mozilla insert custom nodes in the DOM.
				if ( CKEDITOR.env.gecko && htmlNode.hasAttribute( '_moz_editor_bogus_node' ) )
					return;
                // Avoid any firebug nodes in the code, This also applies to Mozilla only
				if ( CKEDITOR.env.gecko && htmlNode.hasAttribute( 'firebugversion' ) )
					return;

                // get real element from fake element
	            if ( htmlNode.getAttribute( 'data-cke-realelement' ) ) {
                    this._AppendNode( editor,this._getRealElement( htmlNode ), stringBuilder, prefix ); //this._AppendNode this._getRealElement
                    return;
                }

				// Get the element name.
				var sNodeName = htmlNode.tagName.toLowerCase();

				if ( CKEDITOR.env.ie ){
					// IE doens't include the scope name in the nodeName. So, add the namespace.
					if ( htmlNode.scopeName && htmlNode.scopeName != 'HTML' && htmlNode.scopeName != 'FCK' )
						sNodeName = htmlNode.scopeName.toLowerCase() + ':' + sNodeName;
				} else {
					if ( sNodeName.StartsWith( 'fck:' ) )
						sNodeName = sNodeName.Remove( 0, 4 );
				}

				// Check if the node name is valid, otherwise ignore this tag.
				// If the nodeName starts with a slash, it is a orphan closing tag.
				// On some strange cases, the nodeName is empty, even if the node exists.
				if ( sNodeName == "" || sNodeName.substring(0, 1) == '/' || sNodeName == "style")
					return;

				if ( sNodeName == 'br' && ( this._inPre || this._inLSpace ) ){ 
					stringBuilder.push( "\n" );
					if ( this._inLSpace ) 
						stringBuilder.push( " " );
					return;
				}

				// Remove the <br> if it is a bogus node.
				// if ( CKEDITOR.env.gecko && sNodeName == 'br' && htmlNode.getAttribute( 'type', 2 ) == '_moz' )
				//	return;
				if ( CKEDITOR.env.gecko && sNodeName == 'br' && htmlNode.getAttribute( 'type' ) == '_moz' )
					return;

                // Translate the <br fckLR="true"> into \n
				if ( sNodeName == 'br' && htmlNode.getAttribute( 'fcklr' ) == 'true' ) {
                    stringBuilder.push("\n");
					return;
                }

				// The already processed nodes must be marked to avoid then to be duplicated (bad formatted HTML).
				// So here, the "mark" is checked... if the element is Ok, then mark it.
                /*
				if ( htmlNode._fckxhtmljob && htmlNode._fckxhtmljob == FCKXHtml.CurrentJobNum )
					return;
                */
				var basicElement = this._BasicElements[ sNodeName ]; //this.

				if ( basicElement ){
				
					var basic0 = basicElement[0];
					var basic1 = basicElement[1];

                    // work around for text alignment, fix bug 12043
                    if (sNodeName == 'p') {
                        try {
                            var style = htmlNode.getAttribute('style') || '',
                                alignment = style.match(/text-align:\s*(\w+);?/i);
                            if ( alignment[1].toLowerCase().IEquals("right", "center", "justify" ) ) {
                                this._AppendTextNode( editor, htmlNode, stringBuilder, sNodeName, prefix); //this.
                                return;
                            }
                        } catch (e) {};
                    }

					if ( ( basicElement[0] == "''" || basicElement[0] == "'''" ) && stringBuilder.length > 2 ){
						var pr1 = stringBuilder[stringBuilder.length-1];
						var pr2 = stringBuilder[stringBuilder.length-2];

						if ( pr1 + pr2 == "'''''") {
							if ( basicElement[0] == "''" ){
								basic0 = '<i>';
								basic1 = '</i>';
							}
							if ( basicElement[0] == "'''" ){
								basic0 = '<b>';
								basic1 = '</b>';
							}
						}
					}

					if ( basic0 )
						stringBuilder.push( basic0 );

					var len = stringBuilder.length;

					if ( !basicElement[2] ){
						this._AppendChildNodes( editor, htmlNode, stringBuilder, prefix ); //this.
						// only empty element inside, remove it to avoid quotes
						if ( ( stringBuilder.length == len || ( stringBuilder.length == len + 1 && !stringBuilder[len].length ) )
							&& basicElement[0] && basicElement[0].charAt(0) == "'" ){
							stringBuilder.pop();
							//stringBuilder.pop(); // 01.11.2015 RL: Commented out, fix by VA when pasting copied table cell into other cell
							return;
						}
					}

					if ( basic1 )
						stringBuilder.push( basic1 );
					
				} else {
					switch ( sNodeName ){
						case 'ol' :
						case 'ul' :

							var isFirstLevel = !htmlNode.parentNode.nodeName.toLowerCase().IEquals( 'ul', 'ol', 'li', 'dl', 'dt', 'dd' ), // 09.11.16 RL Added toLowerCase()
                                listStyle = htmlNode.getAttribute('style') || '',
                                startNum = htmlNode.getAttribute('start') || '';

							this.preserveLiNode = (listStyle && !listStyle.match(/list-style-type:\s*decimal;/i) || startNum && startNum != '1'); //this.
                            if (this.preserveLiNode) {  
                                stringBuilder.push('<' + sNodeName);
                                if (startNum)
                                    stringBuilder.push(' start="' + startNum + '"');
                                if (listStyle)
                                    stringBuilder.push(' style="' + listStyle + '"');
                                stringBuilder.push('>\n');
                            }

							this._AppendChildNodes( editor, htmlNode, stringBuilder, prefix ); //this.

                            if (this.preserveLiNode) 
                                stringBuilder.push('</' + sNodeName + '>');

							if ( isFirstLevel && stringBuilder[ stringBuilder.length - 1 ] != "\n" ) {
								stringBuilder.push( '\n' );
							}

							break;

						case 'li' :

                            if (this.preserveLiNode) {  
                                stringBuilder.push('<li>');
                                this._AppendChildNodes( editor, htmlNode, stringBuilder, prefix ); //this.
                                stringBuilder.push('</li>\n');
                                break;
                            }

							if( stringBuilder.length > 1 ){
								var sLastStr = stringBuilder[ stringBuilder.length - 1 ];
								if ( sLastStr != ";" && sLastStr != ":" && sLastStr != "#" && sLastStr != "*" )
 									stringBuilder.push( '\n' + prefix );
								else 
									stringBuilder.push( '\n' ); //25.11.14 RL For empty lines of numbered and bulleted lists
							} 

							var parent = htmlNode.parentNode;
							var listType = "*";

							while ( parent ){
								if ( parent.nodeName.toLowerCase() == 'ul' ){
									listType = "*";
									break;
								} else if ( parent.nodeName.toLowerCase() == 'ol' ){
									listType = "#";
									break;
								}
								else if ( parent.nodeName.toLowerCase() != 'li' )
									break;

								parent = parent.parentNode;
							}

							stringBuilder.push( listType );
							this._AppendChildNodes( editor, htmlNode, stringBuilder, prefix + listType ); //this.

							break;

						case 'a' :
                            // if there is no inner HTML in the Link, do not add it to the wikitext
                            if (! this._GetNodeText(htmlNode).Trim() ) break; //this.

							var pipeline = true;
							// Get the actual Link href.
							var href = htmlNode.getAttribute( '_cke_saved_href' );
							var hrefType = htmlNode.getAttribute( '_cke_mw_type' ) || '';

                            // this is still the old style, thats used in the parser (should be fixed soon)
                            if ( href == null ) {
                                href = htmlNode.getAttribute( '_fcksavedurl' );
                                hrefType = htmlNode.getAttribute( '_fck_mw_type' ) || '';
                            }

							if ( href == null ) {
								href = htmlNode.getAttribute( 'href' ) || '';
							}
							
							href = decodeURIComponent(href); //26.11.14 RL Decode here because hrefTypeRegexp below does not always work with optional url encoded chars in the middle.

							//fix: Issue 14792 - Link with anchor is changed
							//hrefType is a substring of href from the beginning until the colon.
							//it consists only of alphanumeric chars and optional url encoded chars in the middle.
							var hrefTypeRegexp = /^(\w+(?:%\d{0,3})*\w*):/i;
                            var matches = href.match(hrefTypeRegexp) || ''; //26.11.14 RL Added || ''
							if(hrefType == '' && matches) {
								hrefType = matches[1];
							}

							//if ( hrefType == '' && href.indexOf(':') > -1) {
							//	hrefType = href.substring(0, href.indexOf(':')).toLowerCase();
							//}

							var isWikiUrl = true;
						
							if ( hrefType != "" &&
                                 hrefType != "http" &&
                                 hrefType != "https" &&
                                 hrefType != "mailto" &&
                                 //!href.StartsWith(hrefType.FirstToUpper() + ':') )  //26.11.14 RL->
								 !href.toLowerCase().StartsWith(hrefType.toLowerCase() + ':') ) {
								//stringBuilder.push( '[[' + hrefType.FirstToUpper() + ':' );
								stringBuilder.push( '[[' + hrefType.toLowerCase().FirstToUpper() + ':' ); //26.11.14 RL<-
							}	
							else if ( htmlNode.className == "extiw" ){
								stringBuilder.push( '[[' );
								isWikiUrl = true;
							} else { 
								//20.10.14 RL '[//www.x.y]' is external link
								//26.11.14 RL '{{' should propably start href because variables inside link names => added ^ in test below
								isWikiUrl = !( href.StartsWith( 'mailto:' ) || /^\w+:\/\//.test( href ) || /^\{\{[^\}]*\}\}/.test( href ) || href.StartsWith( '//' ) );
								stringBuilder.push( isWikiUrl ? '[[' : '[' );
							}
							// #2223
							if( htmlNode.getAttribute( '_fcknotitle' ) && htmlNode.getAttribute( '_fcknotitle' ) == "true" ){
								var testHref = decodeURIComponent(htmlNode.getAttribute('href'));
								var testInner = this._GetNodeText(htmlNode) || ''; //this.
								if ( href.toLowerCase().StartsWith( 'category:' ) )
									testInner = 'Category:' + testInner;
								if ( testHref.toLowerCase().StartsWith( 'rtecolon' ) )
									testHref = testHref.replace( /rtecolon/, ":" );
								testInner = testInner.replace( /&amp;/, "&" );
								if ( testInner == testHref )
									pipeline = false;
							}
							if( href.toLowerCase().StartsWith( 'rtecolon' ) ){ // change 'rtecolon=' => ':' in links
								stringBuilder.push(':');
								href = href.substring(8);
							}

                            //if ( isWikiUrl ) href = decodeURIComponent(href); //26.11.14 RL Already done above
							if ( !isWikiUrl ) href = href.replace(/ /g,'%20');  //24.01.15 RL http link may contain spaces, keep them.
							else href = href.replace(/ /g,'_');                 //24.01.15 RL Internal links spaces are converted to underscores. 
								
							stringBuilder.push( href );

                            var innerHTML = this._GetNodeText(htmlNode); //this.
							if ( pipeline && innerHTML != '[n]' && ( !isWikiUrl || href != innerHTML || !href.toLowerCase().StartsWith( "category:" ) ) ){
								stringBuilder.push( isWikiUrl? '|' : ' ' );
								this._AppendChildNodes( editor, htmlNode, stringBuilder, prefix ); //this.
							}
							stringBuilder.push( isWikiUrl ? ']]' : ']' );

							break;

						case 'dl' :

							this._AppendChildNodes( editor, htmlNode, stringBuilder, prefix ); //this.
							var isFirstLevel = !htmlNode.parentNode.nodeName.toLowerCase().IEquals( 'ul', 'ol', 'li', 'dl', 'dd', 'dt' );  // 09.11.16 RL Added toLowerCase()
							if ( isFirstLevel && stringBuilder[ stringBuilder.length - 1 ] != "\n" )
								stringBuilder.push( '\n' );

							break;

						case 'dt' :

							if( stringBuilder.length > 1 ){
								var sLastStr = stringBuilder[ stringBuilder.length - 1 ];
								if ( sLastStr != ";" && sLastStr != ":" && sLastStr != "#" && sLastStr != "*" )
 									stringBuilder.push( '\n' + prefix );
							}
							stringBuilder.push( ';' );
							this._AppendChildNodes( editor, htmlNode, stringBuilder, prefix + ";" ); //this.

							break;

						case 'dd' :

							if( stringBuilder.length > 1 ){
								var sLastStr = stringBuilder[ stringBuilder.length - 1 ];
								if ( sLastStr != ";" && sLastStr != ":" && sLastStr != "#" && sLastStr != "*" )
 									stringBuilder.push( '\n' + prefix );
							}
							stringBuilder.push( ':' );
							this._AppendChildNodes( editor, htmlNode, stringBuilder, prefix + ":" ); //this.

							break;

						case 'table' :

							var attribs = this._GetAttributesStr( htmlNode ); //this.

							// start table definition of MW, format is: '{|'..
							stringBuilder.push( '\n{|' );
							if ( attribs.length > 0 )
								stringBuilder.push( attribs );
							stringBuilder.push( '\n' );

                            // iterate over child tags: <caption>,<tr>,<th>,<img> ...
                            var currentNode = (htmlNode.childNodes.length > 0) ? htmlNode.childNodes[0] : null;
                            var level = 0;

							while (currentNode) {
                                // reset the tagname, needed later when finding next nodes
                                var currentTagName = null;
                                // we found an element node
                                if (currentNode.nodeType == 1) {
                                    // remember the tag name
                                    currentTagName = currentNode.tagName.toLowerCase();
									// we have a caption tag of table
									if ( currentTagName == "caption" ){  // 30.10.15 RL Moved here from above, fixed and added attribute support
										// start caption definition of MW, format is: ..'|+'..
										stringBuilder.push( '|+ ' );										
										// caption may also have attributes defined, format is: ..'atributes |'..
										attribs = this._GetAttributesStr( currentNode ); //this.
										if ( attribs.length > 0 ) {
											stringBuilder.push( attribs + '|');
										}
										// append text of caption, format is: ..'formatted text of caption'..
										this._AppendChildNodes( editor, currentNode, stringBuilder, prefix ); //this.
										stringBuilder.push( '\n' );
									}
                                    // we have a table row tag
                                    else if (currentTagName == "tr") {
                                        attribs = this._GetAttributesStr( currentNode ) ; //this.

                                        stringBuilder.push( '|-' ) ;  // new row
                                        if ( attribs.length > 0 )
                                            stringBuilder.push( attribs ) ;
                                        stringBuilder.push( '\n' ) ;

										// var cell = currentNode.firstElementChild;
                                        var cell = currentNode.firstChild;

										if ( typeof cell != 'undefined' ) {      //20.07.16 RL (with tables)
											while ( cell && cell.nextSibling ) { //20.07.16 RL Added && cell.nextSibling, removes creation of last extra column 
												attribs = this._GetAttributesStr( cell ) ; //this.

												if (typeof cell.nodeValue != 'string') {                      //20.07.16 RL removes creation of first extra column
													if ( cell.tagName && cell.tagName.toLowerCase() == "th" ) //20.07.16 RL "cell.tagName &&"
														stringBuilder.push( '!' ) ; //header row
													else
														stringBuilder.push( '|' ) ; //normal row, "td"	
	
													if ( attribs.length > 0 )
														stringBuilder.push( attribs + ' |' ) ; //attributes of row
	
													stringBuilder.push( ' ' ) ;
												}                                                             //20.07.16 RL
	
												this._IsInsideCell = true ;  
												this._AppendChildNodes( editor, cell, stringBuilder, prefix ) ; //this.
												this._IsInsideCell = false ;
												
												if (typeof cell.nodeValue != 'string')                        //20.07.16 RL removes creation of empty line
													stringBuilder.push( '\n' ) ;
												
												// cell = cell.nextElementSibling;
												cell = cell.nextSibling;
											}
										}
									}
                                    // not a <tr> found, then we only accept templates and special functions
                                    // which then probably build the table row in the wiki text
                                    else if (currentTagName == "img") {
                                        //alert('class: ' + currentNode.className);
                                        switch (currentNode.className) {
                                            case "FCK__MWSpecial" :
                                            case "FCK__MWTemplate" :
                                            case "FCK__SMWquery" :

                                                stringBuilder.push( '|-\n' ) ;
                                                this._IsInsideCell = true ;
                                                this._AppendNode( editor, currentNode, stringBuilder, prefix ) ; //this.
                                                this._IsInsideCell = false ;
                                                stringBuilder.push( '\n' ) ;
                                        }
                                    }
                                }
                                // find children if we are not inside table row.
                                // because the content of rows is handled directly above
                                if (currentNode.childNodes.length > 0 &&
                                    currentTagName != "tr") {
                                    level++;
                                    currentNode = currentNode.childNodes[0];
                                } else {
                                    var nextNode = currentNode.nextSibling;
                                    if (nextNode == null && level > 0) {
                                        while (level > 0) {
                                            currentNode = currentNode.parentNode;
                                            level--;
                                            nextNode = currentNode.nextSibling;
                                            if (nextNode) break;
                                        }
                                    }
                                    currentNode = nextNode;
                                }
                            }

							stringBuilder.push( '|}\n' ) ;

							break;

						case 'img' :

							//19.11.14 RL Commented out
							//var formula = htmlNode.getAttribute( '_fck_mw_math' ); //07.01.14 RL Was unknown: '_cke_mw_math'
                            //
							//if ( formula && formula.length > 0 ){
							//	stringBuilder.push( '<math>' );
							//	stringBuilder.push( formula );
							//	stringBuilder.push( '</math>' );
							//	return;
							//}
							
                            // external image?
                            var src = htmlNode.getAttribute( 'src' );
                            if (src != null && //30.10.14 RL Test null (by Wingsofcourage)
							    src.toLowerCase().match(/^https?:\/\//) &&
								! src.toLowerCase().match(/noimage.png/) ) { //23.12.14 RL Link to nonexisting image=>force internal link                            
								stringBuilder.push( src );
                                return;
                            }
							var imgName		= htmlNode.getAttribute( '_fck_mw_filename' ) || htmlNode.getAttribute( '_cke_mw_filename' ) || '';
							var imgCaption	= htmlNode.getAttribute( 'alt' ) || '';
							var imgType		= htmlNode.getAttribute( '_fck_mw_type' ) || htmlNode.getAttribute( '_cke_mw_type' ) || '';
							var imgLocation	= htmlNode.getAttribute( '_fck_mw_location' ) || '';
							var imgWidth	= '';  //htmlNode.getAttribute( '_fck_mw_width' ) || '';  //30.12.14 RL
							var imgHeight	= '';  //htmlNode.getAttribute( '_fck_mw_height' ) || ''; //30.12.14 RL
							var imgRealWidth	= ( htmlNode.getAttribute( 'width' ) || '' ) + '';
							var imgRealHeight	= ( htmlNode.getAttribute( 'height' ) || '' ) + '';

                            var imgStyle    = htmlNode.getAttribute( 'style' ) || '';
                            var match = /(?:^|\s)width\s*:\s*(\d+)/i.exec( imgStyle ),
                                imgStyleWidth = match && match[1] || 0;
                            match = /(?:^|\s)height\s*:\s*(\d+)/i.exec( imgStyle );
                            var imgStyleHeight = match && match[1] || 0;

                            var imgNolink = ( htmlNode.getAttribute( 'no-link' ) || '' ) + '';
                            var imgLink = ( htmlNode.getAttribute( 'link' ) || '' ) + '';

							//match = /(?:^|\s)vertical-align\s*:\s*([\w\-]*)/i.exec( imgStyle );       //31.12.14 RL->  
							//var imgVLocation = match && match[1] || 0;
							var imgVLocation = htmlNode.getAttribute( '_fck_mw_vertical-align' ) || ''; 
							var imgUpright   = htmlNode.getAttribute( '_fck_mw_upright' ) || '';        //31.12.14 RL<-

							stringBuilder.push( '[[File:' );
							stringBuilder.push( imgName );

							if ( imgStyleWidth.length > 0 )
								imgWidth = imgStyleWidth;
							else if ( imgRealWidth.length > 0 )  //30.12.14 RL
								imgWidth = imgRealWidth;

							if ( imgStyleHeight.length > 0 )
								imgHeight = imgStyleHeight;
							else if ( imgRealHeight.length > 0 ) //30.12.14 RL
								imgHeight = imgRealHeight;

							if ( imgType.length > 0 )
								stringBuilder.push( '|' + imgType );

							if ( imgLocation.length > 0 )
								stringBuilder.push( '|' + imgLocation );  //Horizontal position

							if ( imgVLocation.length > 0 ) //31.12.14 RL->
								stringBuilder.push( '|' + imgVLocation ); //Vertical position
								
							if ( imgUpright.length > 0 ) {
								stringBuilder.push( '|upright' ); //Size: upright
							} else if ( imgWidth.length > 0 || imgHeight.length > 0 ){ //31.12.14 RL<-
								stringBuilder.push( '|' );
								if ( imgWidth.length > 0 )
									stringBuilder.push( imgWidth );
								if ( imgHeight.length > 0 )
									stringBuilder.push( 'x' + imgHeight );
								stringBuilder.push( 'px' );
							}

							if ( imgCaption.length > 0 ) {
								//stringBuilder.push( '|' + imgCaption ); //15.08.16 RL
								
								// imgCaption is text string and may contain html formats like bold, italic etc.
								// =>parse it using conv_toDataFormat so that we get html=>wikitext conversion with text of caption.
								// This is related to EscapeIntExtLinkChars and RestoreIntExtLinkChars,
								// which escapes/restores link  [[, ]], [ and ] inside caption of images.
								stringBuilder.push( '|' + conv_toDataFormat(editor, imgCaption) ); //15.08.16 RL
							}
							
                            if ( imgNolink )
                                stringBuilder.push( '|link=' );
                            else if ( imgLink )
                                stringBuilder.push( '|link=' + imgLink );

							stringBuilder.push( ']]' );

							break;

						case 'span' :
                            var eClassName = htmlNode.getAttribute('class');
							switch ( eClassName ){
								case 'fck_mw_syntaxhighlight' :                  //02.11.14 RL Was source
									var refLang = htmlNode.getAttribute( 'lang' );

									stringBuilder.push( '<syntaxhighlight' );    //02.11.14 RL Was source
									stringBuilder.push( ' lang="' + refLang + '"' );
									stringBuilder.push( '>' );
									stringBuilder.push( this._GetNodeText(htmlNode).htmlDecode().replace(/fckLR/g,'\r\n').replace(/fckSPACE/g,' ') ); //this. //30.10.14 RL fckSPACE
									stringBuilder.push( '</syntaxhighlight>' );  //02.11.14 RL Was source
									return;

								case 'fck_mw_ref' :

									var nodeChild = htmlNode.firstChild;             //08.07.16 RL <ref>
									var nodeChild2 = nodeChild.firstChild;           //08.07.16 RL <ref>
								
									var refName = nodeChild2.getAttribute( 'name' ); //08.07.16 RL <ref> htmlNode.

									stringBuilder.push( '<ref' );

									if ( refName && refName.length > 0 ) {
										stringBuilder.push( ' name="' + refName + '"' );
									}
									
									if ( !nodeChild2.hasAttribute('fck_mw_reftagtext') || 
										 (nodeChild2.getAttribute('fck_mw_reftagtext').length == 0) ||           //08.07.16 RL <ref> ( this._GetNodeText(htmlNode).length == 0 )
										 (refName && (nodeChild2.getAttribute('fck_mw_reftagtext') == '_') ) ) { //08.07.16 RL 
										stringBuilder.push( ' />' );
									}
									else {
										stringBuilder.push( '>' );
										stringBuilder.push( nodeChild2.getAttribute('fck_mw_reftagtext') );      //08.07.16 RL <ref> ( this._GetNodeText(htmlNode) );
										stringBuilder.push( '</ref>' );
									}

									return;

								case 'fck_mw_references' :
									stringBuilder.push( '<references />' );
									return;

								case 'fck_mw_signature' :
									stringBuilder.push( editor.config.WikiSignature ); //this.editor
									return;

								case 'fck_mw_template' :
                                case 'fck_smw_query' :
                                    var inner= this._GetNodeText(htmlNode).htmlDecode().replace(/fckLR/g,'\r\n'); //this.
                                    if (inner == '{{!}}')
                                        stringBuilder.push( '\n' );
                                    stringBuilder.push( inner );
									return;
                                case 'fck_smw_webservice' :
                                case 'fck_smw_rule' :
									stringBuilder.push( this._GetNodeText(htmlNode).htmlDecode().replace(/fckLR/g,'\r\n') ); //this.
									return;
								case 'fck_mw_magic' :
                                    var magicWord = htmlNode.getAttribute( '_fck_mw_tagname' ) || '';
                                    if ( magicWord ) stringBuilder.push( '__' + magicWord + '__' ); //04.02.15 RL Was + '__\n' = unnecessary extra line break
									return;

                                case 'fck_mw_special' :
                                    var tagType = htmlNode.getAttribute( '_fck_mw_tagtype' ) || '';
                                    var tagName = htmlNode.getAttribute( '_fck_mw_tagname' ) || '';
								    switch (tagType) {
								        case 't' :
                                            var attribs = this._GetAttributesStr( htmlNode ) ; //this.
                							stringBuilder.push( '<' + tagName ) ;

                                            if ( attribs.length > 0 )
                                                stringBuilder.push( attribs ) ;

                							stringBuilder.push( '>' ) ;
                                			stringBuilder.push( this._GetNodeText(htmlNode).htmlDecode().replace(/fckLR/g,'\r\n').replace(/_$/, '').replace(/fckSPACE/g,' ') ); // this. //04.02.15 RL fckSPACE
                                            stringBuilder.push( '<\/' + tagName + '>' ) ;

								            break;
								        case 'c' :
								            stringBuilder.push( '__' + tagName + '__\n' );
								            break;
								        case 'v' :
								        case 'w' :
								            stringBuilder.push( '{{' + tagName + '}}' );
								            break;
								        case 'p' :
								            stringBuilder.push( '{{' + tagName );
								            if (this._GetNodeText(htmlNode).length > 0) //this.
								                stringBuilder.push( ':' + this._GetNodeText(htmlNode).htmlDecode().replace(/fckLR/g,'\r\n').replace(/_$/, '').replace(/fckSPACE/g,' ') ); //this. //04.02.15 RL fckSPACE
								            stringBuilder.push( '}}');
								            break;
                                        case 'sf' :
                                            stringBuilder.push( this._GetNodeText(htmlNode).htmlDecode().replace(/fckLR/g,'\r\n').replace(/fckSPACE/g,' ') ); //this. //04.02.15 RL fckSPACE
                                            break;
								    }
								    return;


								case 'fck_mw_nowiki' :
									sNodeName = 'nowiki';
									break;

								case 'fck_mw_html' :
									sNodeName = 'html';
									break;

								case 'fck_mw_includeonly' :
									sNodeName = 'includeonly';
									break;

								case 'fck_mw_noinclude' :
									sNodeName = 'noinclude';
									break;

								case 'fck_mw_gallery' :
									sNodeName = 'gallery';
									break;

								case 'fck_mw_onlyinclude' :
									sNodeName = 'onlyinclude';
									break;
								case 'fck_mw_property' :
								case 'fck_mw_category' :
									stringBuilder.push( this._formatSemanticValues( htmlNode ) ) ; //this.
									return ;
							}

							// Change the node name and fell in the "default" case.
							if ( htmlNode.getAttribute( '_fck_mw_customtag' ) )
								sNodeName = htmlNode.getAttribute( '_fck_mw_tagname' );
                            this._AppendTextNode( editor, htmlNode, stringBuilder, sNodeName, prefix ); //this.
							break;
						case 'pre' :
							var attribs = this._GetAttributesStr( htmlNode );        //this.
                            var eClassName = htmlNode.getAttribute('class');

							if ( eClassName == "fck_mw_nowiki" ){ //Syntaxhighlight-Nowiki-Pre
							    // Edit text directly on page: <pre><nowiki>....</nowiki></pre>
								//var nodeChild = htmlNode.firstChild;
								stringBuilder.push( '<nowiki>' );
								stringBuilder.push( this._GetNodeText(htmlNode) ); //.htmlDecode() //this.
								stringBuilder.push( '</nowiki>\n' ); 
							}							
							else if ( eClassName == "fck_mw_syntaxhighlight" ){ //Syntaxhighlight-Nowiki-Pre
							    // Edit text directly on page: <pre><syntaxhighlight lang="xxx">....</syntaxhighlight></pre>
								var nodeChild = htmlNode.firstChild, refLang = null;
								if ( typeof nodeChild != 'undefined' && nodeChild.hasAttribute( 'lang' ) ) refLang = nodeChild.getAttribute( 'lang' );
								else refLang = 'unknown';  //14.07.16 RL
								stringBuilder.push( '<syntaxhighlight' );
								stringBuilder.push( ' lang="' + refLang + '"' );
								stringBuilder.push( '>' );
								stringBuilder.push( this._GetNodeText(htmlNode) ); //.htmlDecode() //this.
								stringBuilder.push( '</syntaxhighlight>\n' ); //26.03.16 RL Added \n 
							}
							else if ( eClassName == "_fck_mw_lspace" ){ //MW special <pre> block which is indicated by space at peginning of line
								stringBuilder.push( "\n " );            //Add one space because MW html has one space less than what is in wikitext code
								this._inLSpace = true;
								this._AppendChildNodes( editor, htmlNode, stringBuilder, prefix ); //this.
								this._inLSpace = false;
								var len = stringBuilder.length;
								if ( len > 1 ) {
									var tail = stringBuilder[len-2] + stringBuilder[len-1];	 
									if ( len > 2 ) {
										tail = stringBuilder[len-3] + tail;
									}
									if (tail.EndsWith("\n ")) { 
										//Remove extra space added because of setting this._inLSpace = true above
										stringBuilder[len-1] = stringBuilder[len-1].replace(/ $/, "");
									} else if ( !tail.EndsWith("\n") ) {
										stringBuilder.push( "\n" );
									}
								}
							} else {
								stringBuilder.push( '<' );
								stringBuilder.push( sNodeName );
								if ( attribs.length > 0 )
									stringBuilder.push( attribs );
								if( this._GetNodeText(htmlNode) == '' ) //this.
									stringBuilder.push( ' />' );
								else {
									stringBuilder.push( '>' );
									this._inPre = true;
									this._AppendChildNodes( editor, htmlNode, stringBuilder, prefix ); //this.
									this._inPre = false;

									stringBuilder.push( '<\/' );
									stringBuilder.push( sNodeName );
									stringBuilder.push( '>' );

									stringBuilder.push( "\n" );  //04.02.14 RL Required by sequential pre- tags.
								}
							}
							break;
						default :
                            this._AppendTextNode( editor, htmlNode, stringBuilder, sNodeName, prefix ); //this.
							break;
					}
				}

				//htmlNode._fckxhtmljob = FCKXHtml.CurrentJobNum;
				return;

			// Text Node.
			case 3 :

				var parentIsSpecialTag = htmlNode.parentNode.getAttribute( '_fck_mw_customtag' );
				var textValue = htmlNode.nodeValue;
				if ( !parentIsSpecialTag ){
					
					/**** 29.11.15 RL -> *********
					if ( CKEDITOR.env.ie && this._inLSpace ) {
						textValue = textValue.replace( /\r/g, "\r " );
						if (textValue.EndsWith( "\r " )) {
							textValue = textValue.replace( /\r $/, "\r" );
						}
					}
					if ( !CKEDITOR.env.ie && this._inLSpace ) {
						textValue = textValue.replace( /\n(?! )/g, "\n " );
					}
					****/

					// If we are inside space activated <pre> block, html code has one space less than what is
					// in wikitext code => add one space with all browsers, not just with IE.
					if ( this._inLSpace ) {
						textValue = textValue.replace( /\r\n/g, "\n"  );
						textValue = textValue.replace( /\r/g,   "\n"  );
						textValue = textValue.replace( /\n/g,   "\n " );        // All "\n" has to be replaced 
					}                                                           // 29.11.15 RL <-
					
					if (!this._inLSpace && !this._inPre) {
						textValue = textValue.replace( /[\n\t]/g, ' ' );
					}

                    // remove the next line to prevent that XML gets encoded
					//textValue = CKEDITOR.tools.htmlEncode( textValue );
					textValue = textValue.replace( /\u00A0/g, '&nbsp;' );

					if ( ( !htmlNode.previousSibling ||
					( stringBuilder.length > 0 && stringBuilder[ stringBuilder.length - 1 ].EndsWith( '\n' ) ) ) && !this._inLSpace && !this._inPre ){
						textValue = textValue.replace(/^\s*/, ''); // Ltrim
					}

					if ( !htmlNode.nextSibling && !this._inLSpace && !this._inPre && ( !htmlNode.parentNode || !htmlNode.parentNode.nextSibling ) )
						textValue = textValue.replace(/\s*$/, ''); // Rtrim

					if( !this._inLSpace && !this._inPre && htmlNode.parentNode.tagName.toLowerCase() != 'a' ) {
						textValue = textValue.replace( / {2,}/g, ' ' );
						// 24.04.16 RL Issue with [[../SomePage|LinkText]] (in wysiwyg mode) 
						// => _EscapeWikiMarkup seems to convert in wrong direction, 
						// because here we are converting from html to wikitext, after call of _EscapeWikiMarkup we got: 
						//   &#x5B;&#x5B;../SomePage|LinkText&#x5D;&#x5D;
                        // textValue = this._EscapeWikiMarkup(textValue); //24.04.16 RL Commented out. //this.
                    }

					if ( this._inLSpace && textValue.length == 1 && textValue.charCodeAt(0) == 13 )
						textValue = textValue + " ";

					if ( !this._inLSpace && !this._inPre && textValue == " " ) {
						var len = stringBuilder.length;
						if( len > 1 ) {
							var tail = stringBuilder[len-2] + stringBuilder[len-1];
							if ( tail.toString().EndsWith( "\n" ) )
								textValue = '';
						}
					}

					if ( this._IsInsideCell ) {
						var result, linkPattern = new RegExp( "\\[\\[.*?\\]\\]", "g" );
						while( result = linkPattern.exec( textValue ) ) {
							textValue = textValue.replace( result, result.toString().replace( /\|/g, "<!--LINK_PIPE-->" ) );
						}
						textValue = textValue.replace( /\|/g, '&#124;' );
						textValue = textValue.replace( /<!--LINK_PIPE-->/g, '|' );
					}
				} else {
					textValue = textValue.htmlDecode().replace(/fckLR/g,'\r\n');
				}
				stringBuilder.push( textValue );
				return;

			// Comment
			case 8 :
				// IE catches the <!DOTYPE ... > as a comment, but it has no
				// innerHTML, so we can catch it, and ignore it.
				if ( CKEDITOR.env.ie && !this._GetNodeText(htmlNode) ) //this.
					return;

				stringBuilder.push( "<!--"  );

				try	{
					stringBuilder.push( htmlNode.nodeValue );
				} catch( e ) { /* Do nothing... probably this is a wrong format comment. */ }

				stringBuilder.push( "-->" );							
				return;
		}
	};

	_AppendChildNodes = function( editor, htmlNode, stringBuilder, listPrefix ){
		var child = htmlNode.firstChild;
		while ( child ){
			this._AppendNode( editor, child, stringBuilder, listPrefix ); //this.
			child = child.nextSibling;
		}
	};

	_AppendTextNode = function( editor, htmlNode, stringBuilder, sNodeName, prefix ) {
    	var attribs = this._GetAttributesStr( htmlNode ) ; //this.

		stringBuilder.push( '<' ) ;
		stringBuilder.push( sNodeName ) ;

    	if ( attribs.length > 0 )
			stringBuilder.push( attribs ) ;

		stringBuilder.push( '>' ) ;
		this._AppendChildNodes( editor, htmlNode, stringBuilder, prefix ) ;  //this.
		stringBuilder.push( '<\/' ) ;
		stringBuilder.push( sNodeName ) ;
		stringBuilder.push( '>' ) ;
    };

	_GetAttributesStr = function( htmlNode ){
		var attStr = '';
		var aAttributes = htmlNode.attributes;

		if ( !aAttributes ) { return attStr; }; //20.07.16 RL FF does not work with test "typeof aAttributes != 'undefined'" (with tables)

		for ( var n = 0; n < aAttributes.length; n++ ){
			var oAttribute = aAttributes[n];

			if ( oAttribute.specified ){
				var sAttName = oAttribute.nodeName.toLowerCase();
				var sAttValue;

				// Ignore any attribute starting with "_fck" or "_cke".
				if ( sAttName.StartsWith( '_fck' ) || sAttName.StartsWith( '_cke' ) )
					continue;
				// There is a bug in Mozilla that returns '_moz_xxx' attributes as specified.
				else if ( sAttName.indexOf( '_moz' ) == 0 )
					continue;
				// For "class", nodeValue must be used.
				else if ( sAttName == 'class' ){
					// Get the class, removing any fckXXX and ckeXXX we can have there.
					sAttValue = oAttribute.nodeValue.replace( /(^|\s*)(fck|cke)\S+/, '' ).Trim();

					if ( sAttValue.length == 0 )
						continue;
//				} else if ( sAttName == 'style' && CKEDITOR.env.ie ) {
				} else if (CKEDITOR.env.ie ) {
//					sAttValue = htmlNode.style.cssText.toLowerCase();
					sAttValue = oAttribute.nodeValue.toLowerCase();
				} else if ( sAttName == 'style' && CKEDITOR.env.gecko ) {
                    // the Mozilla leave style attributes such as -moz in the text, remove them
                    var styleVals = oAttribute.nodeValue.split(/;/),
                        styleAtts = [];
                    for (var i = 0; i < styleVals.length; i++) {
                        var styleVal = styleVals[i].Trim();
                        if ( ( !styleVal ) || (styleVal.indexOf('-moz') == 0) ) continue;

                        styleAtts.push( styleVals[i] );
                    }
                    sAttValue = styleAtts.join('; ');
				}
				// XHTML doens't support attribute minimization like "CHECKED". It must be trasformed to cheched="checked".
				else if ( oAttribute.nodeValue === true )
					sAttValue = sAttName;
				else {
//					sAttValue = htmlNode.getAttribute( sAttName, 2 );	// We must use getAttribute to get it exactly as it is defined.
					sAttValue = htmlNode.getAttribute( sAttName );	// We must use getAttribute to get it exactly as it is defined.
				}

				// leave templates
				if ( sAttName.StartsWith( '{{' ) && sAttName.EndsWith( '}}' ) ) {
					attStr += ' ' + sAttName;
				} else {
					attStr += ' ' + sAttName + '="' + String(sAttValue).replace( '"', '&quot;' ) + '"';
				}
			}
		}
		return attStr;
	};
	
    // in FF htmlNode.textContent is set, while IE needs htmlNode.text;
    _GetNodeText = function( htmlNode ) {
        var text = '';
        /*06.02.14 RL->*To make category work with IE11 and maintaining backwards compatibility***
        if (CKEDITOR.env.ie)
            text = htmlNode.text;
        else
            text = htmlNode.textContent;
        *******/
        if (typeof htmlNode.textContent != 'undefined') text = htmlNode.textContent;
        else text = htmlNode.text;
        /*06.02.14 RL<-*/
		return (typeof text == 'undefined') ? '' : text;
    };

	// Property and Category values must be of a certain format. Otherwise this will break
	// the semantic annotation when switching between wikitext and WYSIWYG view
	_formatSemanticValues = function(htmlNode) {
		var text = this._GetNodeText(htmlNode).htmlDecode(); //05.12.14 RL Added htmlDecode //this.

		// remove any &nbsp;
		text = text.replace('&nbsp;', ' ');
		// remove any possible linebreaks
		text = text.replace('<br>', ' ');
        // and trim leading and trailing whitespaces
		text = text.Trim();

		// no value set, then add an space to fix problems with [[prop:val| ]]
		if (text.length == 0)
			text = " ";
		// regex to check for empty value
		var emptyVal = /^\s+$/;
        var eClassName = htmlNode.getAttribute('class');
		switch (eClassName) {
			case 'fck_mw_property' :
				var name = ''; //12.12.14 RL 
				if ( htmlNode.hasAttribute('property') ) { //12.12.14 RL 
					name = htmlNode.getAttribute('property').htmlDecode() || ''; //05.12.14 RL Added htmlDecode
				}
				if (name.indexOf('::') != -1) {
                    var ann = name.substring(name.indexOf('::') + 2);
					if ( emptyVal.exec( ann ) ) return '';
                    if ( ann.Trim() == text.Trim())
                        return '[[' + name + ']]';
					return '[[' + name + '|' + text + ']]' ;
				}
				else {
					if (emptyVal.exec(text)) return '';
					return '[[' + name + '::' + text + ']]' ;
				}
			case 'fck_mw_category' :
				var sort = '', //12.12.14 RL 
				  //labelCategory = smwContentLangForFCK('Category') || 'Category:',
					labelCategory = 'Category';
				if ( htmlNode.hasAttribute('sort') ) { //12.12.14 RL
					sort = htmlNode.getAttribute('sort').htmlDecode() || ''; //05.12.14 RL Added htmlDecode 
				}
				sort = sort.trim();  //12.12.14 RL->
                if ( (sort == '') || //Was if (sort == text)
				     (sort.substr(0,1).toUpperCase() == mw.config.get('wgPageName').trim().substr(0,1).toUpperCase()) ) {
					sort = null;  
				}  //12.12.14 RL<-	
				if (sort) {
					if (emptyVal.exec(sort)) sort = ' ';
					return '[[' + labelCategory + ':' + text + '|' + sort + ']]';
				}
				if (emptyVal.exec(text)) return '';
				return '[[' + labelCategory + ':' + text + ']]'
		}
	};
	
    // Get real element from a fake element.
    _getRealElement = function( element ) {

        var attributes = element.attributes;
        var realHtml = attributes && attributes.getNamedItem('data-cke-realelement');
		var realNode = realHtml && decodeURIComponent( realHtml.nodeValue );
        var realElement = realNode && this._getNodeFromHtml( realNode ); //this.

 	    // If we have width/height in the element, we must move it into
 	    // the real element.
 	    if ( realElement && element.attributes._cke_resizable ) {
            var style = element.attributes.style;
            if ( style ) {
                // Get the width from the style.
 	            var match = /(?:^|\s)width\s*:\s*(\d+)/i.exec( style ),
                    width = match && match[1];

 	            // Get the height from the style.
 	            match = /(?:^|\s)height\s*:\s*(\d+)/i.exec( style );
 	            var height = match && match[1];

 	            if ( width )
                    realElement.attributes.width = width;

                if ( height )
                    realElement.attributes.height = height;
 	        }
 	    }

 	    return realElement;
    };

    _EscapeWikiMarkup = function (text) {

        // wiki links
        var result, pattern = new RegExp( "\\[\\[.*?\\]\\]", "g" );
		while( result = pattern.exec( text ) ) {
            text = text.replace( result, result.toString().replace( /\[/g, "&#x5B;" ).replace( /\]/g, "&#x5D;") );
        }
        // parameter names (that are written with three curly brackets)
        pattern = new RegExp( "\\{{3}.*?\\}{3}", "g" );
		while( result = pattern.exec( text ) ) {
            text = text.replace( result, result.toString().replace( /\{/g, "&#x7B;" ).replace( /\}/g, "&#x7D;") );
        }
        // all two curly brackets (used for template calls and parser functions)
        while (true) {
            var z = text.match(/\{{2}(.*?)\}{2}/g);
            if (z) {
                for (var i = 0; i < z.length; i++) {
                    text = text.replace(z[i], '&#x7B;&#x7B;' + z[i].substr(2, z[i].length-4) + '&#x7D;&#x7D;');
                }
            }
            else break;
        }
        // escape <> of any html or wiki tag
        text = text.replace( /<(\/?[^>]+)>/g, "&lt;$1&gt;")
        // replace any __MAGICWORD__ with &#95;&#95;MAGICWORD&#95;&#95; - check first if there is any
        if (text.match(/__[A-Z]+__/)) {
            for (var i = 0; i < window.parent.wgCKeditorMagicWords.magicwords.length; i++) {
                pattern = new RegExp('__(' + window.parent.wgCKeditorMagicWords.magicwords[i] + ')__', 'g');
                text = text.replace( pattern, "&#95;&#95;$1&#95;&#95;")
            }
        }

        return text;
    };
}


if (!String.prototype.InArray) {
	String.prototype.InArray = function(arr) {
		for(var i=0;i<arr.length;i++) {
            if (arr[i] == this)
                return true;
        }
		return false;
	}
}

if (!String.prototype.StartsWith) {
    String.prototype.StartsWith = function(str)
    {return (this.match("^"+str)==str)}
}

if (!String.prototype.EndsWith) {
    String.prototype.EndsWith = function(str)
    {return (this.match(str+"$")==str)}
}

if (!String.prototype.Trim) {
    String.prototype.Trim = function()
    {return this.replace(/^\s*/, '').replace(/\s*$/, '')}
}
if (!String.prototype.IEquals) {
    String.prototype.IEquals = function() {
        for (i = 0; i < String.prototype.IEquals.arguments.length; i++) {
            if (String.prototype.IEquals.arguments[i] == this ) return true;
        }
        return false;
    }
}
if (!String.prototype.FirstToUpper) {
    String.prototype.FirstToUpper = function() {
        string = this;
        return string.substr(0,1).toUpperCase() + string.substr(1);
    }
}

if (!String.prototype.htmlDecode) {
    String.prototype.htmlDecode = function() {
        var entities = new Array ('amp', 'quot', '#039', 'lt', 'gt' );
        var chars = new Array ('&', '"', '\'', '<', '>');
        string = this;
        for (var i = 0; i < entities.length; i++) {
            myRegExp = new RegExp();
            myRegExp.compile('&' + entities[i]+';','g');
            string = string.replace (myRegExp, chars[i]);
        }
        return string;
    }
}

if (!String.prototype.htmlEntities) {
  String.prototype.htmlEntities = function() {
    /**** 
    var chars = new Array (
	                     //'&','<','>',
	                       'à','á','â','ã','ä','å','†',
						   'æ','ç','è','é','ê','ë','ì',
						   'í','î','ï','ð','ñ','ò','ó',
						   'ô','õ','ö','ø','ù','ú','û',
						   'ü','ý','þ','ÿ','À','Á','Â',
						   'Ã','Ä','Å','Æ','Ç','È','É',
						   'Ê','Ë','Ì','Í','Î','Ï','Ð',
						   'Ñ','Ò','Ó','Ô','Õ','Ö','Ø',
						   'Ù','Ú','Û','Ü','Ý','Þ','€',
						   '\"','ß','¢','£','¤','¥','¦',
						   '§','¨','©','ª','«','¬','­',
						   '®','¯','°','±','²','³','´',
						   'µ','¶','·','¸','¹','º','»',
						   '¼','½','¾','–','—','˜ ','‡', //22.11.16 RL: 3-4, 07.01.17 RL: 5-7
						   'š','Š','Ÿ','œ','Œ','ƒ','ˆ', //07.01.17 RL->
						   '‘','’','‚','“','”','„','•', 
                           '…','‰','′','″','‹','›','‾',
						   '€','™','←','↑','→','↓','↔',
						   '↵','⌈','⌉','⌊','⌋','◊','♠',
						   '♣','♥','♦' 	                //07.01.17 RL<-
						   );

    var entities = new Array (
	                        //'amp','lt','gt',
	                          'agrave','aacute','acirc' ,'atilde','auml'  ,'aring' ,'dagger',
                              'aelig' ,'ccedil','egrave','eacute','ecirc' ,'euml'  ,'igrave',
                              'iacute','icirc' ,'iuml'  ,'eth'   ,'ntilde','ograve','oacute',
                              'ocirc' ,'otilde','ouml'  ,'oslash','ugrave','uacute','ucirc',
                              'uuml'  ,'yacute','thorn' ,'yuml'  ,'Agrave','Aacute','Acirc',
                              'Atilde','Auml'  ,'Aring' ,'AElig' ,'Ccedil','Egrave','Eacute',
                              'Ecirc' ,'Euml'  ,'Igrave','Iacute','Icirc' ,'Iuml'  ,'ETH',
							  'Ntilde','Ograve','Oacute','Ocirc' ,'Otilde','Ouml'  ,'Oslash',
							  'Ugrave','Uacute','Ucirc' ,'Uuml'  ,'Yacute','THORN' ,'euro',
							  'quot'  ,'szlig' ,'cent'  ,'pound' ,'curren','yen'   ,'brvbar',
							  'sect'  ,'uml'   ,'copy'  ,'ordf'  ,'laquo' ,'not'   ,'shy',
							  'reg'   ,'macr'  ,'deg'   ,'plusmn','sup2'  ,'sup3'  ,'acute',
							  'micro' ,'para'  ,'middot','cedil' ,'sup1'  ,'ordm'  ,'raquo',
							  'frac14','frac12','frac34','ndash' ,'mdash' ,'tilde' ,'Dagger', //22.11.16 RL: 3-4, 07.01.17 RL: 5-7
							  'scaron','Scaron','Yuml'  ,'oelig' ,'OElig' ,'fnof'  ,'circ',   //07.01.17 RL->
							  'lsquo' ,'rsquo' ,'sbquo' ,'ldquo' ,'rdquo' ,'bdquo' ,'bull',   
                              'hellip','permil','prime' ,'Prime' ,'lsaquo','rsaquo','oline',
							  'euro'  ,'trade' ,'larr'  ,'uarr'  ,'rarr'  ,'darr'  ,'harr',
							  'crarr' ,'lceil' ,'rceil' ,'lfloor','rfloor','loz'   ,'spades',
							  'clubs' ,'hearts','diams'                                       //07.01.17 RL<-
							  );
    ******/
 
  
 
    var chars = new Array ( //07.01.17 RL-> http://www.freeformatter.com/html-entities.html
	  '\"',       //                                            'quot',
	  '·',        //                                            'middot',
      'À',        // #192;	Capital a with grave accent         'Agrave',         
      'Á',        // #193;	Capital a with acute accent         'Aacute',         
      'Â',        // #194;	Capital a with circumflex accent    'Acirc',          
      'Ã',        // #195;	Capital a with tilde                'Atilde',         
      'Ä',        // #196;	Capital a with umlaut               'Auml',           
      'Å',        // #197;	Capital a with ring                 'Aring',          
      'Æ',        // #198;	Capital ae                          'AElig',          
      'Ç',        // #199;	Capital c with cedilla              'Ccedil',         
      'È',        // #200;	Capital e with grave accent         'Egrave',         
      'É',        // #201;	Capital e with acute accent         'Eacute',         
      'Ê',        // #202;	Capital e with circumflex accent    'Ecirc',          
      'Ë',        // #203;	Capital e with umlaut               'Euml',           
      'Ì',        // #204;	Capital i with grave accent         'Igrave',         
      'Í',        // #205;	Capital i with accute accent        'Iacute',         
      'Î',        // #206;	Capital i with circumflex accent    'Icirc',          
      'Ï',        // #207;	Capital i with umlaut               'Iuml',           
      'Ð',        // #208;	Capital eth (Icelandic)             'ETH',            
      'Ñ',        // #209;	Capital n with tilde                'Ntilde',         
      'Ò',        // #210;	Capital o with grave accent         'Ograve',         
      'Ó',        // #211;	Capital o with accute accent        'Oacute',         
      'Ô',        // #212;	Capital o with circumflex accent    'Ocirc',          
      'Õ',        // #213;	Capital o with tilde                'Otilde',         
      'Ö',        // #214;	Capital o with umlaut               'Ouml',           
      'Ø',        // #216;	Capital o with slash                'Oslash',         
      'Ù',        // #217;	Capital u with grave accent         'Ugrave',         
      'Ú',        // #218;	Capital u with acute accent         'Uacute',         
      'Û',        // #219;	Capital u with circumflex accent    'Ucirc',          
      'Ü',        // #220;	Capital u with umlaut               'Uuml',           
      'Ý',        // #221;	Capital y with acute accent         'Yacute',         
      'Þ',        // #222;	Capital thorn (Icelandic)           'THORN',          
      'ß',        // #223;	Lowercase sharp s (German)          'szlig',          
      'à',        // #224;	Lowercase a with grave accent       'agrave',         
      'á',        // #225;	Lowercase a with acute accent       'aacute',         
      'â',        // #226;	Lowercase a with circumflex accent  'acirc',          
      'ã',        // #227;	Lowercase a with tilde              'atilde',         
      'ä',        // #228;	Lowercase a with umlaut             'auml',           
      'å',        // #229;	Lowercase a with ring               'aring',          
      'æ',        // #230;	Lowercase ae                        'aelig',          
      'ç',        // #231;	Lowercase c with cedilla            'ccedil',         
      'è',        // #232;	Lowercase e with grave accent       'egrave',         
      'é',        // #233;	Lowercase e with acute accent       'eacute',         
      'ê',        // #234;	Lowercase e with circumflex accent  'ecirc',          
      'ë',        // #235;	Lowercase e with umlaut             'euml',           
      'ì',        // #236;	Lowercase i with grave accent       'igrave',         
      'í',        // #237;	Lowercase i with acute accent       'iacute',         
      'î',        // #238;	Lowercase i with circumflex accent  'icirc',          
      'ï',        // #239;	Lowercase i with umlaut             'iuml',           
      'ð',        // #240;	Lowercase eth (Icelandic)           'eth',            
      'ñ',        // #241;	Lowercase n with tilde              'ntilde',         
      'ò',        // #242;	Lowercase o with grave accent       'ograve',         
      'ó',        // #243;	Lowercase o with acute accent       'oacute',         
      'ô',        // #244;	Lowercase o with circumflex accent  'ocirc',          
      'õ',        // #245;	Lowercase o with tilde              'otilde',         
      'ö',        // #246;	Lowercase o with umlaut             'ouml',           
      'ø',        // #248;	Lowercase o with slash              'oslash',         
      'ù',        // #249;	Lowercase u with grave accent       'ugrave',         
      'ú',        // #250;	Lowercase u with acute accent       'uacute',         
      'û',        // #251;	Lowercase u with circumflex accent  'ucirc',          
      'ü',        // #252;	Lowercase u with umlaut             'uuml',           
      'ý',        // #253;	Lowercase y with acute accent       'yacute',         
      'þ',        // #254;	Lowercase thorn (Icelandic)         'thorn',          
      'ÿ',        // #255;	Lowercase y with umlaut             'yuml',           
      '¡',        // #161;	Inverted exclamation mark           'iexcl',          
      '¢',        // #162;	Cent                                'cent',           
      '£',        // #163;	Pound                               'pound',          
      '¤',        // #164;	Currency                            'curren',         
      '¥',        // #165;	Yen                                 'yen',            
      '¦',        // #166;	Broken vertical bar                 'brvbar',         
      '§',        // #167;	Section                             'sect',           
      '¨',        // #168;	Spacing diaeresis                   'uml',            
      '©',        // #169;	Copyright                           'copy',           
      'ª',        // #170;	Feminine ordinal indicator          'ordf',           
      '«',        // #171;	Opening/Left angle quotation mark   'laquo',          
      '¬',        // #172;	Negation                            'not',            
      '­',        // #173;	Soft hyphen                         'shy',            
      '®',        // #174;	Registered trademark                'reg',            
      '¯',        // #175;	Spacing macron                      'macr',           
      '°',        // #176;	Degree                              'deg',            
      '±',        // #177;	Plus or minus                       'plusmn',         
      '²',        // #178;	Superscript 2                       'sup2',           
      '³',        // #179;	Superscript 3                       'sup3',           
      '´',        // #180;	Spacing acute                       'acute',          
      'µ',        // #181;	Micro                               'micro',          
      '¶',        // #182;	Paragraph                           'para',           
      '¸',        // #184;	Spacing cedilla                     'cedil',          
      '¹',        // #185;	Superscript 1                       'sup1',           
      'º',        // #186;	Masculine ordinal indicator         'ordm',           
      '»',        // #187;	Closing/Right angle quotation mark  'raquo',          
      '¼',        // #188;	Fraction 1/4                        'frac14',         
      '½',        // #189;	Fraction 1/2                        'frac12',         
      '¾',        // #190;	Fraction 3/4                        'frac34',         
      '¿',        // #191;	Inverted question mark              'iquest',         
      '×',        // #215;	Multiplication                      'times',          
      '÷',        // #247;	Divide                              'divide',         
      '∀',       // #8704;	For all                             'forall',         
      '∂',        // #8706;	Part                                'part',           
      '∃',       // #8707;	Exist                               'exist',          
      '∅',        // #8709;	Empty                               'empty',          
      '∇',       // #8711;	Nabla                               'nabla',          
      '∈',       // #8712;	Is in                               'isin',           
      '∉',        // #8713;	Not in                              'notin',          
      '∋',       // #8715;	Ni                                  'ni',             
      '∏',        // #8719;	Product                             'prod',           
      '∑',        // #8721;	Sum                                 'sum',            
      '−',        // #8722;	Minus                               'minus',          
      '∗',        // #8727;	Asterisk (Lowast)                   'lowast',         
      '√',        // #8730;	Square root                         'radic',          
      '∝',       // #8733;	Proportional to                     'prop',           
      '∞',        // #8734;	Infinity                            'infin',          
      '∠',       // #8736;	Angle                               'ang',            
      '∧',       // #8743;	And                                 'and',            
      '∨',       // #8744;	Or                                  'or',             
      '∩',        // #8745;	Cap                                 'cap',            
      '∪',       // #8746;	Cup                                 'cup',            
      '∫',        // #8747;	Integral                            'int',            
      '∴',       // #8756;	Therefore                           'there4',         
      '∼',        // #8764;	Similar to                          'sim',            
      '≅',        // #8773;	Congurent to                        'cong',           
      '≈',        // #8776;	Almost equal                        'asymp',          
      '≠',        // #8800;	Not equal                           'ne',             
      '≡',        // #8801;	Equivalent                          'equiv',          
      '≤',        // #8804;	Less or equal                       'le',             
      '≥',        // #8805;	Greater or equal                    'ge',             
      '⊂',       // #8834;	Subset of                           'sub',            
      '⊃',       // #8835;	Superset of                         'sup',            
      '⊄',        // #8836;	Not subset of                       'nsub',           
      '⊆',       // #8838;	Subset or equal                     'sube',           
      '⊇',       // #8839;	Superset or equal                   'supe',           
      '⊕',        // #8853;	Circled plus                        'oplus',          
      '⊗',        // #8855;	Circled times                       'otimes',         
      '⊥',       // #8869;	Perpendicular                       'perp',           
      '⋅',        // #8901;	Dot operator                        'sdot',           
      'Α',        // #913;	Alpha                               'Alpha',          
      'Β',        // #914;	Beta                                'Beta',           
      'Γ',        // #915;	Gamma                               'Gamma',          
      'Δ',        // #916;	Delta                               'Delta',          
      'Ε',        // #917;	Epsilon                             'Epsilon',        
      'Ζ',        // #918;	Zeta                                'Zeta',           
      'Η',        // #919;	Eta                                 'Eta',            
      'Θ',        // #920;	Theta                               'Theta',          
      'Ι',        // #921;	Iota                                'Iota',           
      'Κ',        // #922;	Kappa                               'Kappa',          
      'Λ',        // #923;	Lambda                              'Lambda',         
      'Μ',        // #924;	Mu                                  'Mu',             
      'Ν',        // #925;	Nu                                  'Nu',             
      'Ξ',        // #926;	Xi                                  'Xi',             
      'Ο',        // #927;	Omicron                             'Omicron',        
      'Π',        // #928;	Pi                                  'Pi',             
      'Ρ',        // #929;	Rho                                 'Rho',            
      'Σ',        // #931;	Sigma                               'Sigma',          
      'Τ',        // #932;	Tau                                 'Tau',            
      'Υ',        // #933;	Upsilon                             'Upsilon',        
      'Φ',        // #934;	Phi                                 'Phi',            
      'Χ',        // #935;	Chi                                 'Chi',            
      'Ψ',        // #936;	Psi                                 'Psi',            
      'Ω',        // #937;	Omega                               'Omega',          
      'α',        // #945;	alpha                               'alpha',          
      'β',        // #946;	beta                                'beta',           
      'γ',        // #947;	gamma                               'gamma',          
      'δ',        // #948;	delta                               'delta',          
      'ε',        // #949;	epsilon                             'epsilon',        
      'ζ',        // #950;	zeta                                'zeta',           
      'η',        // #951;	eta                                 'eta',            
      'θ',        // #952;	theta                               'theta',          
      'ι',        // #953;	iota                                'iota',           
      'κ',        // #954;	kappa                               'kappa',          
      'λ',        // #955;	lambda                              'lambda',         
      'μ',        // #956;	mu                                  'mu',             
      'ν',        // #957;	nu                                  'nu',             
      'ξ',        // #958;	xi                                  'xi',             
      'ο',        // #959;	omicron                             'omicron',        
      'π',        // #960;	pi                                  'pi',             
      'ρ',        // #961;	rho                                 'rho',            
      'ς',        // #962;	sigmaf                              'sigmaf',         
      'σ',        // #963;	sigma                               'sigma',          
      'τ',        // #964;	tau                                 'tau',            
      'υ',        // #965;	upsilon                             'upsilon',        
      'φ',        // #966;	phi                                 'phi',            
      'χ',        // #967;	chi                                 'chi',            
      'ψ',        // #968;	psi                                 'psi',            
      'ω',        // #969;	omega                               'omega',          
      'ϑ',        // #977;	Theta symbol                        'thetasym',       
      'ϒ',        // #978;	Upsilon symbol                      'upsih',          
      'ϖ',        // #982;	Pi symbol                           'piv',            
      'Œ',        // #338;	Uppercase ligature OE               'OElig',          
      'œ',        // #339;	Lowercase ligature OE               'oelig',          
      'Š',        // #352;	Uppercase S with caron              'Scaron',         
      'š',        // #353;	Lowercase S with caron              'scaron',         
      'Ÿ',        // #376;	Capital Y with diaeres              'Yuml',           
      'ƒ',        // #402;	Lowercase with hook                 'fnof',           
      'ˆ',        // #710;	Circumflex accent                   'circ',           
      '˜ ',        // #732;	Tilde                               'tilde',          
      ' ',        // #8194;	En space                            'ensp',           
      ' ',        // #8195;	Em space                            'emsp',           
      ' ',        // #8201;	Thin space                          'thinsp',         
      '–',        // #8211;	En dash                             'ndash',          
      '—',        // #8212;	Em dash                             'mdash',          
      '‘',        // #8216;	Left single quotation mark          'lsquo',          
      '’',        // #8217;	Right single quotation mark         'rsquo',          
      '‚',        // #8218;	Single low-9 quotation mark         'sbquo',          
      '“',        // #8220;	Left double quotation mark          'ldquo',          
      '”',        // #8221;	Right double quotation mark         'rdquo',          
      '„',        // #8222;	Double low-9 quotation mark         'bdquo',          
      '†',        // #8224;	Dagger                              'dagger',         
      '‡',        // #8225;	Double dagger                       'Dagger',         
      '•',        // #8226;	Bullet                              'bull',           
      '…',        // #8230;	Horizontal ellipsis                 'hellip',         
      '‰',        // #8240;	Per mille                           'permil',         
      '′',        // #8242;	Minutes (Degrees)                   'prime',          
      '″',        // #8243;	Seconds (Degrees)                   'Prime',          
      '‹',        // #8249;	Single left angle quotation         'lsaquo',         
      '›',        // #8250;	Single right angle quotation        'rsaquo',         
      '‾',        // #8254;	Overline                            'oline',          
      '€',        // #8364;	Euro                                'euro',           
      '™',        // #8482;	Trademark                           'trade',          
      '←',        // #8592;	Left arrow                          'larr',           
      '↑',        // #8593;	Up arrow                            'uarr',           
      '→',        // #8594;	Right arrow                         'rarr',           
      '↓',        // #8595;	Down arrow                          'darr',           
      '↔',        // #8596;	Left right arrow                    'harr',           
      '↵',        // #8629;	Carriage return arrow               'crarr',          
      '⌈',        // #8968;	Left ceiling                        'lceil',          
      '⌉',        // #8969;	Right ceiling                       'rceil',          
      '⌊',        // #8970;	Left floor                          'lfloor',         
      '⌋',        // #8971;	Right floor                         'rfloor',         
      '◊',        // #9674;	Lozenge                             'loz',            
      '♠',        // #9824;	Spade                               'spades',         
      '♣',        // #9827;	Club                                'clubs',          
      '♥',        // #9829;	Heart                               'hearts',         
      '♦'         // #9830;	Diamond                             'diams'           
    );
    
    var entities = new Array (
	  'quot',
	  'middot',
      'Agrave',         // #192;	Capital a with grave accent
      'Aacute',         // #193;	Capital a with acute accent
      'Acirc',          // #194;	Capital a with circumflex accent
      'Atilde',         // #195;	Capital a with tilde
      'Auml',           // #196;	Capital a with umlaut
      'Aring',          // #197;	Capital a with ring
      'AElig',          // #198;	Capital ae
      'Ccedil',         // #199;	Capital c with cedilla
      'Egrave',         // #200;	Capital e with grave accent
      'Eacute',         // #201;	Capital e with acute accent
      'Ecirc',          // #202;	Capital e with circumflex accent
      'Euml',           // #203;	Capital e with umlaut
      'Igrave',         // #204;	Capital i with grave accent
      'Iacute',         // #205;	Capital i with accute accent
      'Icirc',          // #206;	Capital i with circumflex accent
      'Iuml',           // #207;	Capital i with umlaut
      'ETH',            // #208;	Capital eth (Icelandic)
      'Ntilde',         // #209;	Capital n with tilde
      'Ograve',         // #210;	Capital o with grave accent
      'Oacute',         // #211;	Capital o with accute accent
      'Ocirc',          // #212;	Capital o with circumflex accent
      'Otilde',         // #213;	Capital o with tilde
      'Ouml',           // #214;	Capital o with umlaut
      'Oslash',         // #216;	Capital o with slash
      'Ugrave',         // #217;	Capital u with grave accent
      'Uacute',         // #218;	Capital u with acute accent
      'Ucirc',          // #219;	Capital u with circumflex accent
      'Uuml',           // #220;	Capital u with umlaut
      'Yacute',         // #221;	Capital y with acute accent
      'THORN',          // #222;	Capital thorn (Icelandic)
      'szlig',          // #223;	Lowercase sharp s (German)
      'agrave',         // #224;	Lowercase a with grave accent
      'aacute',         // #225;	Lowercase a with acute accent
      'acirc',          // #226;	Lowercase a with circumflex accent
      'atilde',         // #227;	Lowercase a with tilde
      'auml',           // #228;	Lowercase a with umlaut
      'aring',          // #229;	Lowercase a with ring
      'aelig',          // #230;	Lowercase ae
      'ccedil',         // #231;	Lowercase c with cedilla
      'egrave',         // #232;	Lowercase e with grave accent
      'eacute',         // #233;	Lowercase e with acute accent
      'ecirc',          // #234;	Lowercase e with circumflex accent
      'euml',           // #235;	Lowercase e with umlaut
      'igrave',         // #236;	Lowercase i with grave accent
      'iacute',         // #237;	Lowercase i with acute accent
      'icirc',          // #238;	Lowercase i with circumflex accent
      'iuml',           // #239;	Lowercase i with umlaut
      'eth',            // #240;	Lowercase eth (Icelandic)
      'ntilde',         // #241;	Lowercase n with tilde
      'ograve',         // #242;	Lowercase o with grave accent
      'oacute',         // #243;	Lowercase o with acute accent
      'ocirc',          // #244;	Lowercase o with circumflex accent
      'otilde',         // #245;	Lowercase o with tilde
      'ouml',           // #246;	Lowercase o with umlaut
      'oslash',         // #248;	Lowercase o with slash
      'ugrave',         // #249;	Lowercase u with grave accent
      'uacute',         // #250;	Lowercase u with acute accent
      'ucirc',          // #251;	Lowercase u with circumflex accent
      'uuml',           // #252;	Lowercase u with umlaut
      'yacute',         // #253;	Lowercase y with acute accent
      'thorn',          // #254;	Lowercase thorn (Icelandic)
      'yuml',           // #255;	Lowercase y with umlaut
      'iexcl',          // #161;	Inverted exclamation mark
      'cent',           // #162;	Cent
      'pound',          // #163;	Pound
      'curren',         // #164;	Currency
      'yen',            // #165;	Yen
      'brvbar',         // #166;	Broken vertical bar
      'sect',           // #167;	Section
      'uml',            // #168;	Spacing diaeresis
      'copy',           // #169;	Copyright
      'ordf',           // #170;	Feminine ordinal indicator
      'laquo',          // #171;	Opening/Left angle quotation mark
      'not',            // #172;	Negation
      'shy',            // #173;	Soft hyphen
      'reg',            // #174;	Registered trademark
      'macr',           // #175;	Spacing macron
      'deg',            // #176;	Degree
      'plusmn',         // #177;	Plus or minus
      'sup2',           // #178;	Superscript 2
      'sup3',           // #179;	Superscript 3
      'acute',          // #180;	Spacing acute
      'micro',          // #181;	Micro
      'para',           // #182;	Paragraph
      'cedil',          // #184;	Spacing cedilla
      'sup1',           // #185;	Superscript 1
      'ordm',           // #186;	Masculine ordinal indicator
      'raquo',          // #187;	Closing/Right angle quotation mark
      'frac14',         // #188;	Fraction 1/4
      'frac12',         // #189;	Fraction 1/2
      'frac34',         // #190;	Fraction 3/4
      'iquest',         // #191;	Inverted question mark
      'times',          // #215;	Multiplication
      'divide',         // #247;	Divide
      'forall',         // #8704;	For all
      'part',           // #8706;	Part
      'exist',          // #8707;	Exist
      'empty',          // #8709;	Empty
      'nabla',          // #8711;	Nabla
      'isin',           // #8712;	Is in
      'notin',          // #8713;	Not in
      'ni',             // #8715;	Ni
      'prod',           // #8719;	Product
      'sum',            // #8721;	Sum
      'minus',          // #8722;	Minus
      'lowast',         // #8727;	Asterisk (Lowast)
      'radic',          // #8730;	Square root
      'prop',           // #8733;	Proportional to
      'infin',          // #8734;	Infinity
      'ang',            // #8736;	Angle
      'and',            // #8743;	And
      'or',             // #8744;	Or
      'cap',            // #8745;	Cap
      'cup',            // #8746;	Cup
      'int',            // #8747;	Integral
      'there4',         // #8756;	Therefore
      'sim',            // #8764;	Similar to
      'cong',           // #8773;	Congurent to
      'asymp',          // #8776;	Almost equal
      'ne',             // #8800;	Not equal
      'equiv',          // #8801;	Equivalent
      'le',             // #8804;	Less or equal
      'ge',             // #8805;	Greater or equal
      'sub',            // #8834;	Subset of
      'sup',            // #8835;	Superset of
      'nsub',           // #8836;	Not subset of
      'sube',           // #8838;	Subset or equal
      'supe',           // #8839;	Superset or equal
      'oplus',          // #8853;	Circled plus
      'otimes',         // #8855;	Circled times
      'perp',           // #8869;	Perpendicular
      'sdot',           // #8901;	Dot operator
      'Alpha',          // #913;	Alpha
      'Beta',           // #914;	Beta
      'Gamma',          // #915;	Gamma
      'Delta',          // #916;	Delta
      'Epsilon',        // #917;	Epsilon
      'Zeta',           // #918;	Zeta
      'Eta',            // #919;	Eta
      'Theta',          // #920;	Theta
      'Iota',           // #921;	Iota
      'Kappa',          // #922;	Kappa
      'Lambda',         // #923;	Lambda
      'Mu',             // #924;	Mu
      'Nu',             // #925;	Nu
      'Xi',             // #926;	Xi
      'Omicron',        // #927;	Omicron
      'Pi',             // #928;	Pi
      'Rho',            // #929;	Rho
      'Sigma',          // #931;	Sigma
      'Tau',            // #932;	Tau
      'Upsilon',        // #933;	Upsilon
      'Phi',            // #934;	Phi
      'Chi',            // #935;	Chi
      'Psi',            // #936;	Psi
      'Omega',          // #937;	Omega
      'alpha',          // #945;	alpha
      'beta',           // #946;	beta
      'gamma',          // #947;	gamma
      'delta',          // #948;	delta
      'epsilon',        // #949;	epsilon
      'zeta',           // #950;	zeta
      'eta',            // #951;	eta
      'theta',          // #952;	theta
      'iota',           // #953;	iota
      'kappa',          // #954;	kappa
      'lambda',         // #955;	lambda
      'mu',             // #956;	mu
      'nu',             // #957;	nu
      'xi',             // #958;	xi
      'omicron',        // #959;	omicron
      'pi',             // #960;	pi
      'rho',            // #961;	rho
      'sigmaf',         // #962;	sigmaf
      'sigma',          // #963;	sigma
      'tau',            // #964;	tau
      'upsilon',        // #965;	upsilon
      'phi',            // #966;	phi
      'chi',            // #967;	chi
      'psi',            // #968;	psi
      'omega',          // #969;	omega
      'thetasym',       // #977;	Theta symbol
      'upsih',          // #978;	Upsilon symbol
      'piv',            // #982;	Pi symbol
      'OElig',          // #338;	Uppercase ligature OE
      'oelig',          // #339;	Lowercase ligature OE
      'Scaron',         // #352;	Uppercase S with caron
      'scaron',         // #353;	Lowercase S with caron
      'Yuml',           // #376;	Capital Y with diaeres
      'fnof',           // #402;	Lowercase with hook
      'circ',           // #710;	Circumflex accent
      'tilde',          // #732;	Tilde
      'ensp',           // #8194;	En space
      'emsp',           // #8195;	Em space
      'thinsp',         // #8201;	Thin space
      'ndash',          // #8211;	En dash
      'mdash',          // #8212;	Em dash
      'lsquo',          // #8216;	Left single quotation mark
      'rsquo',          // #8217;	Right single quotation mark
      'sbquo',          // #8218;	Single low-9 quotation mark
      'ldquo',          // #8220;	Left double quotation mark
      'rdquo',          // #8221;	Right double quotation mark
      'bdquo',          // #8222;	Double low-9 quotation mark
      'dagger',         // #8224;	Dagger
      'Dagger',         // #8225;	Double dagger
      'bull',           // #8226;	Bullet
      'hellip',         // #8230;	Horizontal ellipsis
      'permil',         // #8240;	Per mille
      'prime',          // #8242;	Minutes (Degrees)
      'Prime',          // #8243;	Seconds (Degrees)
      'lsaquo',         // #8249;	Single left angle quotation
      'rsaquo',         // #8250;	Single right angle quotation
      'oline',          // #8254;	Overline
      'euro',           // #8364;	Euro
      'trade',          // #8482;	Trademark
      'larr',           // #8592;	Left arrow
      'uarr',           // #8593;	Up arrow
      'rarr',           // #8594;	Right arrow
      'darr',           // #8595;	Down arrow
      'harr',           // #8596;	Left right arrow
      'crarr',          // #8629;	Carriage return arrow
      'lceil',          // #8968;	Left ceiling
      'rceil',          // #8969;	Right ceiling
      'lfloor',         // #8970;	Left floor
      'rfloor',         // #8971;	Right floor
      'loz',            // #9674;	Lozenge
      'spades',         // #9824;	Spade
      'clubs',          // #9827;	Club
      'hearts',         // #9829;	Heart
      'diams'           // #9830;	Diamond							  
    );                  // 07.01.17 RL<-
  
    string = this;
    for (var i = 0; i < entities.length; i++) {
      myRegExp = new RegExp();
      myRegExp.compile('&' + entities[i]+';','g');
      string = string.replace (myRegExp, chars[i]);
    }
	
	// use numeric values with these entities because otherwise they will disappear from text
    string = string.replace(/&nbsp;/g, '&#160;' );  // Non-breaking space
	string = string.replace(/&zwnj;/g, '&#8204;' ); // Zero width non-joiner // 07.01.17 RL->
	string = string.replace(/&zwj;/g,  '&#8205;' ); // Zero width joiner
	string = string.replace(/&lrm;/g,  '&#8206;' ); // Left-to-right mark
	string = string.replace(/&rlm;/g,  '&#8207;' ); // Right-to-left mark    // 07.01.17 RL<- 
	return string;
  }
}
	