/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "sourcearea" plugin. It registers the "source" editing
 *		mode, which displays the raw data being edited in the editor.
 */

CKEDITOR.plugins.add( 'mediawiki',
{

	requires : [ 'fakeobjects', 'htmlwriter', 'dialog' ],

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
			'img.FCK__MWRef' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_ref.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 18px !important;' +
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
			'img.FCK__MWCategory' +     //07.01.14 RL New element
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_category.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 18px !important;' +
				'height: 15px !important;' +
			'}\n' +
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
			/***
			'span.fck_mw_category' +    //07.01.14 RL Original element
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/icon_category.gif' ) + ');' +
				'background-position: 0 center;' +
				'background-repeat: no-repeat;' +
                'background-color: #94b0f3;' +
				'border: 1px solid #a9a9a9;' +
				'padding-left: 18px;' +
			'}\n' +
			****/
			'pre' +  //08.02.15 RL For paragraph format "Formatted" of CKeditor which is using <pre> -tag
			'{' +
				'background-color:rgb(245,245,245);' + 
				'border: 1px solid rgb(224,224,224);' +
			'}\n';
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
                            case 'fck_mw_ref' :
                                if (className == null)
                                    className = 'FCK__MWRef';
                            case 'fck_mw_references' :
                                if ( className == null )
                                    className = 'FCK__MWReferences';
                            case 'fck_mw_category' :                 //07.01.14 RL->
                               if ( className == null )              
                                    className = 'FCK__MWCategory';   //07.01.14 RL<-
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

        var dataProcessor = editor.dataProcessor = new CKEDITOR.customprocessor( editor );
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
            }
        };
        //28.03.14 RL<-

        //03.01.14 RL->For references (citation)
		var referencesCommand =
    	{
        	canUndo : false,    // The undo snapshot will be handled by 'insertElement'.
            exec : function( editor ) {
                var ref = '<span class="fck_mw_references">_</span>',
                    element = CKEDITOR.dom.element.createFromHtml(ref, editor.document),
                    newFakeObj = editor.createFakeElement( element, 'FCK__MWReferences', 'span' );
                editor.insertElement( newFakeObj );
            }
        };
        //03.01.14 RL<-

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
            } 
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
			linkAsMedia     : 'Internal link to an image or a file of other types, [[Media:<link>]]', //09.05.14 RL
            defineTarget    : 'Define the wiki page for the link target:',        
            chooseTarget    : 'Choose an existing wikipage for the link target:',
			// references (citation)
			referenceTitle 	    : 'Add/edit reference (citation)',                //03.01.14 RL
			refDefTxt  		    : 'Reference text',                               //03.01.14 RL
			refDefName          : 'Name of reference (if same text is referenced at multible places on page, if not, leave empty):',
			ref				    : 'Add a reference',                              //03.01.14 RL
			references		    : 'Add references block',                         //03.01.14 RL
            // category
			categorybtn         : 'Create new category',                          //20.01.15 RL   'Ajouter'
			categoryTitle       : 'Add/edit categories',                          //20.01.15 RL
			category            : 'Type text to search for or to create a new category:', //20.01.15 RL 'Recherche'
			categorySelected    : 'Selected categories for the page:',            //20.01.15 RL
            selfromCategoryList : 'Select category for the page:',                 //20.01.15 RL			
			categorySort        : 'Sortkey within category',                      //07.01.14 RL
			noCategoryFound     : 'Not found, category is new',                   //09.01.14 RL
            oneCategoryFound    : 'One category found',						      //09.01.14 RL
            manyCategoryFound   : ' categories found',                            //09.01.14 RL
			mouseOverUnknownObj : 'Double-click to edit the value'                //31.01.15 RL
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
			linkAsMedia     : 'Sisäinen linkki kuvaan tai muun tyyppiseen tiedostoon, [[Media:<link>]]',            //09.05.14 RL
            defineTarget    : 'Määritä wikin sivu linkin kohteeksi',          //'Define the wiki page for the link target:',
            chooseTarget    : 'Valitse wikin sivu linkin kohteeksi',          //Choose an existing wikipage for the link target:',
			// references (citation)
			referenceTitle 	: 'Lisää viite / muuta viitettä',                 //'Add/edit reference (citation)',
			refDefTxt  		: 'Viitteen teksti',                              //'Reference text',
			refDefName      : 'Viitteen nimi (anna nimi vain jos samaan viitetekstiin viitataan useasta paikasta):', //'Name of reference'
			ref				: 'Viite',                                        //'Add a reference' for button of menu
			references		: 'Lista viitteistä',                             //'Add references block' for button of menu
            // category
			categorybtn    	    : 'Luo uusi luokka',                          //'Create new category' //20.01.15 RL
			categoryTitle       : 'Sivun luokkien määritys',                  //'Add/edit categories' //20.01.15 RL 
			category            : 'Etsi / luo uusi luokka (tyhjä kenttä listaa kaikki luokat):', //'Type text to search for or create a new category' //20.01.15 RL
            categorySelected    : 'Sivu lisätään luokkiin:',                  //'Selected categories for the page:'  //20.01.15 RL
            selfromCategoryList : 'Valitse luokka listalta:',                 //'Select category for the page //20.01.15 RL
			categorySort        : 'Lajitteluavain luokan sisällä:',           //'Sortkey within category'
			noCategoryFound     : 'Luokkaa ei löydy, se on uusi',             //'no category found'			     //09.01.14 RL
            oneCategoryFound    : 'Yksi luokka löytyi',                       //'one category found',            //09.01.14 RL
            manyCategoryFound   : ' kpl',                                     //' categories found',			 //09.01.14 RL
			mouseOverUnknownObj : 'Tuplaklikkaa editoidaksesi arvoa'          //'Double-click to edit the value' //31.01.15 RL
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
			img_upright     : 'Redimensionner pour se adapter (upright)',
			img_link_title  : 'Entrer la page cible',
			img_link_disable: 'Un lien est désactivée',
			imgVertAlign    : 'Alignement (vert.)', //31.12.14 RL<-
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
			linkAsMedia     : 'Lien interne vers une image ou un autre fichier [[Media:<lien>]]', //09.05.14 RL
			defineTarget    : 'Entrer la page cible:',
            chooseTarget    : 'Choisissez la page :',
			// references (citation)
			referenceTitle 	: 'Ajouter/modifier une référence',
			refDefTxt    	: 'Texte de la référence',
			refDefName      : 'Nom de la référence :',
			ref				: 'Ajouter une référence',
			references		: 'Ajouter le bloc des références',
			// category
			categorybtn		: 'Ajouter',
			categoryTitle	: 'Ajouter/modifier une catégorie',
			category		: 'Recherche',
			categorySelected : 'Catégories sélectionnées pour la page:',
            selfromCategoryList : 'Sélectionner dans la liste:',			
			categorySort	: 'categorySort',
			noCategoryFound     : 'Non trouvé, la catégorie est nouvelle',
            oneCategoryFound    : 'Une catégorie trouvée',
            manyCategoryFound   : ' catégories trouvées',
			mouseOverUnknownObj : 'Double-cliquer pour éditer'
	    }

        MWpluginLang['de'] = {
            invalidContent  : 'invalid content',
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
            // signature
            signature       : 'Signatur',
            // special tags
            specialTags     : 'Spezial Tags',
            specialTagTitle : 'Spezial Tags Dialog',
            specialTagDef   : 'Definiere einen Spezialtag, ein magisches Wort oder eine Parserfunktion:',
            // link
            linkTitle       : 'Mediawiki Link',
			simplelink	    : 'Convert text to link',                                                //27.08.14 Varlin 
			linkAsMedia     : 'Internal link to an image or a file of other types [[Media:<link>]]', //09.05.14 RL
            noPageFound     : 'keinen Artikel gefunden',
            onePageFound    : '1 Artikel gefunden',
            manyPageFound   : ' Artikel gefunden',
            emailLink       : 'e-mail link... es wird nicht danach gesucht',
            anchorLink      : 'anchor link... es wird nicht danach gesucht',
            defineTarget    : 'Definiere eine Wikiseite als Linkziel:',
            chooseTarget    : 'Wähle eine existierende Wikiseite als Linkziel:',
            // references (citation)
            referenceTitle      : 'Referenz hinzufügen/bearbeiten',
            refDefTxt           : 'Text für Referenz',
            refDefName          : 'Name der Referenz',
            ref                 : 'Referenz hinzufügen',
            references          : 'Referenzblock hinzufügen',
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
			mouseOverUnknownObj : 'Double-cliquez sur pour modifier la valeur' //'Double-click to edit the value' //31.01.15 RL			
        }

        // Define language for wysiwyg, editor.langCode is eq. to language of ckeditor
        if (typeof MWpluginLang[editor.langCode] != 'undefined' ) {
            editor.lang.mwplugin = MWpluginLang[editor.langCode];
		} else {
            editor.lang.mwplugin = MWpluginLang['en'];
		}
		
		// Change mouseover text 'Unknown Object'" to "Double-click to edit the value' with elements.
		CKEDITOR.lang[editor.langCode].fakeobjects['unknown'] = editor.lang.mwplugin.mouseOverUnknownObj; //31.01.15 RL

        // define commands and dialogues

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

		editor.addCommand( 'MWRef', new CKEDITOR.dialogCommand( 'MWRef' ) ); //03.01.14 RL For references (citation)
        CKEDITOR.dialog.add( 'MWRef', this.path + 'dialogs/ref.js' );        //03.01.14 RL
		editor.addCommand( 'MWReferences', referencesCommand);               //03.01.14 RL

		editor.addCommand( 'MWCategory', new CKEDITOR.dialogCommand( 'MWCategory' ) ); //07.01.14 RL
        CKEDITOR.dialog.add( 'MWCategory', this.path + 'dialogs/category.js' );        //07.01.14 RL

        editor.addCommand( 'MWSignature', signatureCommand);

		editor.addCommand( 'MWSimpleLink', simplelinkCommand);    //05.09.14 RL
	
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
			editor.ui.addButton( 'MWSpecialTags',
				{
					label : editor.lang.mwplugin.specialTags,
					command : 'MWSpecialTags',
                    icon: this.path + 'images/tb_icon_special.gif'
				});

            //03.01.14 RL->For references (citation)
			editor.ui.addButton( 'MWRef',
				{
					label : editor.lang.mwplugin.ref,
					command : 'MWRef',
                    icon: this.path + 'images/icon_ref.gif'
				});
			editor.ui.addButton( 'MWReferences',
				{
					label : editor.lang.mwplugin.references,
					command : 'MWReferences',
                    icon: this.path + 'images/icon_references.gif'
				});
            //03.01.14 RL<-

			editor.ui.addButton( 'MWSignature',
				{
					label : editor.lang.mwplugin.signature,
					command : 'MWSignature',
                    icon: this.path + 'images/tb_icon_sig.gif'
				});

			editor.ui.addButton( 'MWCategory',    //07.01.14 RL
				{
					label : editor.lang.mwplugin.categorybtn,
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

		editor.on( 'selectionChange', function( evt )                   //28.03.14 RL For overridden 'unlink' button
  			{
				//To enable / disable unlink button, taken from
				//http://docs.cksource.com/ckeditor_api/symbols/src/plugins_link_plugin.js.html
  				if ( editor.readOnly )
  					return;

  				/*
  				 * Despite our initial hope, document.queryCommandEnabled() does not work
  				 * for this in Firefox. So we must detect the state by element paths.
  				 */
  				var cmd_unlink = editor.getCommand( 'unlink' ),
                    cmd_MWSimpleLink = editor.getCommand( 'MWSimpleLink' ),  //05.09.14 RL
  					element = evt.data.path.lastElement && evt.data.path.lastElement.getAscendant( 'a', true );
  				if ( element && element.getName() == 'a' && element.getAttribute( 'href' ) && element.getChildCount() ) {
  					cmd_unlink.setState( CKEDITOR.TRISTATE_OFF );            //Enable
                    cmd_MWSimpleLink.setState( CKEDITOR.TRISTATE_DISABLED ); //05.09.14 RL
                }    
  				else {
  					cmd_unlink.setState( CKEDITOR.TRISTATE_DISABLED );       //Disable 
                    cmd_MWSimpleLink.setState( CKEDITOR.TRISTATE_OFF );      //05.09.14 RL  
                }    
  			} )

        editor.on( 'doubleclick', function( evt )
			{
			    var element = CKEDITOR.plugins.link.getSelectedLink( editor ) || evt.data.element;

				if ( element.is( 'img' ) &&                             //07.01.14 RL->
				     element.getAttribute( 'class' ) &&                 //03.02.14 RL Added
					 element.getAttribute( 'class' ).InArray( [         //03.02.14 RL Modified to use InArray(..)
								'FCK__MWReferences'   
								/**,'FCK__MWMath'**/                    //19.11.14 RL Commented out
								])
				   ) {
				  /*Do nothing, because otherwise doubleclick of math or reference object
				    will open dialog for linking image to page.
				  */
				}
				//03.02.14 RL-> Dialog to edit template definitions is defined in ckeditor/plugins/mwtemplate/dialogs/teplate.js.
				//              ckeditor/plugins/mwtemplate/plugins.js has following code but for some reason it is not
				//              activated there on doubleclick of icon_template.gif, placing code here seems to solve the case.
				else if ( element.is( 'img' ) &&
                     element.getAttribute( 'class' ) &&
                     element.getAttribute( 'class' ) == 'FCK__MWTemplate' )
					evt.data.dialog = 'MWTemplate';
				//03.02.14 RL<-
				else
                {                                                        //07.01.14 RL<-
					if ( element.is( 'a' ) || ( element.is( 'img' ) && element.getAttribute( '_cke_real_element_type' ) == 'anchor' ) )
						evt.data.dialog = 'MWLink';
					else if ( element.is( 'img' ) ) {
						if ( element.getAttribute( 'class' )      == 'FCK__MWCategory' ) //07.01.2014 RL For categories
							evt.data.dialog = 'MWCategory';                              //07.01.2014 RL
						else if ( element.getAttribute( 'class' ) == 'FCK__MWRef' )      //04.01.2014 RL For references (citation)
							evt.data.dialog = 'MWRef';                                   //04.01.2014 RL
						else if ( element.getAttribute( 'class' ) &&                     //07.01.14 RL This was earlier one step below
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
		
		editor.on('mode', function( evt ) //12.01.15 RL Editor opened or source buttons pressed, selected editor mode is ready
			{
				setSourceToggle( editor ); //This is required by source button (source->wysiwyg). 				
			} 
		)
		
		editor.on( 'readOnly', function () //12.01.15 RL: Event fired when the readOnly property changes.
			{
				setSourceToggle( editor ); //This is required by toggle link (wikieditor->wysiwyg).
			} 
		)
		
		CKEDITOR.on( 'instanceReady', function ( evt ) //12.01.15 RL
			{
				editor = evt.editor; //This is from CKeditor example of read-only mode.
			} 
		)

		/**
		editor.on( 'contentDom', function () //21.01.15 RL 
			{
				editor.editable().attachListener( this.fakeObj, 'click', function() {
						//alert('test');
					} 
				);
			} 
		)
		**/
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

function setSourceToggle( editor ) { //12.01.15 RL: Enable/disable source button and toggle link

	var objId = 'wpTextbox1',
		oToggleLink = document.getElementById( 'toggle_' + objId );				
	// CKEDITOR.instances[objId ].commands.source.enable(); //At this point already enabled by CKeditor
	if ( oToggleLink ) {
		if ( editor.mode == 'wysiwyg' ) {
			oToggleLink.innerHTML = window.parent.editorMsgOff;
		} else {  
			oToggleLink.innerHTML = window.parent.editorMsgOn;
		}
		// Prolonged disable of toggle link with editorForceReadOnly.		
		if ( editor.mode == 'wysiwyg' && window.parent.editorForceReadOnly == false ) {
			oToggleLink.style.visibility = 'visible'; //Show toggle link in wysiwyg mode
		} else {
			oToggleLink.style.visibility = 'hidden';  //Hide toggle link source mode
		}
	}
	// Prolonged disable of source button with editorForceReadOnly.
	// We are waiting for html conversion to be ready, disable source button when menu and editor is ready 
	// in wysiwyg mode but when source button is still enabled despite of read-only mode.
	if ( editor.mode == 'wysiwyg' && window.parent.editorForceReadOnly == true ) { 
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
		window.parent.editorForceReadOnly = true;
		editor.commands.source.disable(); //This is here on purpose
		editor.setReadOnly( true );
		if ( oToggleLink ) {
			oToggleLink.style.visibility = 'hidden';
		}
	} else {	
		window.parent.editorForceReadOnly = false;
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
				oToggleLink.innerHTML = window.parent.editorMsgOff;
			else  
				oToggleLink.innerHTML = window.parent.editorMsgOn;
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
			+ editorWaitPageLoad +'</a> ';
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

function fck_mv_plg_addToStrtr( text, replaceLineBreaks ) { //16.01.15 RL 
	// For html->wikitext, based on fck_addToStrtr.
	// Store "text" to be replaced into array [key1:"text1", key2:"text2", ...] 
	// and return "key" which is used to replace the original text.
	
	// Create key
	key = 'Fckmw' + window.parent.fck_mv_plg_strtr_span_counter + 'fckmw'; 
	window.parent.fck_mv_plg_strtr_span_counter++;

	// Store text in array
	if( replaceLineBreaks ) { 
		window.parent.fck_mv_plg_strtr_span[key] = text.replace( array( "\r\n", "\n", "\r" ), 'fckLR');
	} else {
		window.parent.fck_mv_plg_strtr_span[key] = text;
	}
	return key;
}

function fck_mv_plg_revertEncapsulatedString(text) { //16.01.15 RL 
	// For html->wikitext, based on revertEncapsulatedString.
	// Restore original texts into page from array [key1:"text1", key2:"text2", ...]

	if (matches = text.match(/Fckmw\d+fckmw/g)) { //Are there keys to be replaced.
		is = matches.length;
		//alert('commnets_qty:' + is + ' 1.key:' + matches[0] + ' value:' + window.parent.fck_mv_plg_strtr_span[matches[0]]);			
		for (i = 0; i < is; i++ ) { // Replace each key with original text.
			// comments are directly in the main key FckmwXfckmw
			if ( (typeof window.parent.fck_mv_plg_strtr_span[matches[i]] != 'undefined' ) &&
				 (window.parent.fck_mv_plg_strtr_span[matches[i]].substr(0, 4) == '<!--') ) {
				text = text.replace( matches[i],
									 window.parent.fck_mv_plg_strtr_span[matches[i]]);
			}			
			else if (typeof window.parent.fck_mv_plg_strtr_span['href="' + matches[i] + '"'] != 'undefined') {
				text = text.replace( matches[i],
									 window.parent.substr(fck_mv_plg_strtr_span['href="' + matches[i] + '"'], 6, -1) );
			}
		}
	}
	return text;
}

function fck_mw_plg_replaceHTMLcomments( text ) { //16.01.15 RL 
	// For html->wikitext, based on fck_replaceHTMLcomments.

	window.parent.fck_mv_plg_strtr_span = [];
	window.parent.fck_mv_plg_strtr_span_counter = 0;
	
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
			// Remove the comment, leading and trailing
			// spaces, and leave only one newline.
			replacement = fck_mv_plg_addToStrtr( text.substr( spaceStart, spaceLen + 1 ), false );
			// text = text.replace( replacement + "\n", spaceStart, spaceLen + 1 ); // From php -code
			text = text.substr(0,spaceStart) + replacement + "\n" + text.substr(spaceStart + spaceLen + 1) ;
		} else {
			// Remove just the comment.
			replacement = fck_mv_plg_addToStrtr( text.substr( start, end - start ), false );
			// text = text.replace( replacement, start, end - start ); // From php -code
			text = text.substr(0,start) + replacement + text.substr(end) ;
		}
	}
	return text;
}

CKEDITOR.customprocessor = function( editor )
{
   this.editor = editor;
   this.writer = new CKEDITOR.htmlWriter();
   this.dataFilter = new CKEDITOR.htmlParser.filter();
   this.htmlFilter = new CKEDITOR.htmlParser.filter();
};

CKEDITOR.customprocessor.prototype =
{
	_inPre : false,
	_inLSpace : false,

   toHtml : function( data, fixForBody )
   {  
        // all converting to html (like: data = data.replace( /</g, '&lt;' );)
        var loadHTMLFromAjax = function( result ){
			if ( window.parent.popup &&
				 window.parent.popup.parent.wgCKeditorInstance &&
				 window.parent.popup.parent.wgCKeditorCurrentMode != 'wysiwyg') {
				 window.parent.popup.parent.wgCKeditorInstance.setData(result.responseText);
				 window.parent.popup.parent.wgCKeditorCurrentMode = 'wysiwyg';
			}
			else if ( window.parent.wgCKeditorInstance &&
					  window.parent.wgCKeditorCurrentMode != 'wysiwyg' ) {
				window.parent.wgCKeditorInstance.setData(result.responseText);				
				window.parent.wgCKeditorCurrentMode = 'wysiwyg';
				toggleReadOnly( false ); //12.01.15 RL				
			}
		}

        // Prevent double transformation because of some weird runtime issues
        // with the event dataReady in the smwtoolbar plugin 
		// 12.01.15 RL-> 
		//   There are two calls to toHtml when source button or toggle link is pressed in wikitext mode.
		//   Rule below tries to test when page is in wikitext mode. Inserted html code inside page may make this test fail.
        //if (!(data.indexOf('<p>') == 0 && 
        //      data.match(/<.*?_fck_mw/) || data.match(/class="fck_mw_\w+"/i)) ) { //12.01.15 RL Commented out
		if ( (data.match('<p>') == null) && 
			 (data.match(/<.*?_fck_mw/) == null) &&
			 (data.match(/class="fck_mw_\w+"/i) == null) &&
			  window.parent.wgCKeditorInstance &&                //Because of TransformTextSwitcher plugin
			  window.parent.wgCKeditorCurrentMode != 'wysiwyg' ) //Because of TransformTextSwitcher plugin
		{				
			toggleReadOnly( true );                   //12.01.15 RL<-
			// Use Ajax to transform the Wikitext to HTML.
			if( window.parent.popup ){
				window.parent.popup.parent.FCK_sajax( 'wfSajaxWikiToHTML', [data, window.parent.popup.wgPageName], loadHTMLFromAjax );
			} else {
				window.parent.FCK_sajax( 'wfSajaxWikiToHTML', [data, window.parent.wgPageName], loadHTMLFromAjax );
			}
		}
		var fragment = CKEDITOR.htmlParser.fragment.fromHtml( data, fixForBody ),
		writer = new CKEDITOR.htmlParser.basicWriter();

		fragment.writeHtml( writer, this.dataFilter );
		data = writer.getHtml( true );

		return data;
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
		
        if ( (window.parent.showFCKEditor &&
             !(window.parent.showFCKEditor & window.parent.RTE_VISIBLE)) )
             return window.parent.document.getElementById(window.parent.wgCKeditorInstance.name).value;

        if (window.parent.wgCKeditorCurrentMode)
            window.parent.wgCKeditorCurrentMode = 'source';
        else if (window.parent.popup && window.parent.popup.parent.wgCKeditorCurrentMode)
            window.parent.popup.parent.wgCKeditorCurrentMode = 'source';

		if (CKEDITOR.env.ie) {
			data = this.ieFixHTML(data);
		}
		
        data = '<body xmlns:x="http://excel">' + data.htmlEntities()+ '</body>';
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
        // when inserting data with Excel an unmatched <col> element exists, thus remove it
        data = data.replace(/<col[^>]*>/gi, '' );
        // 06.04.14 Varlin: remove <wbr> tags that causes parser to crash
        data = data.replace(/<wbr>/gi, '' );

		// Replace html comments by "Fckmw<id>fckmw" -keys (where <id>=0,1,2..) 
		// so that possible incomplete xml structure of commented block
		// will not prevent page handling (f.ex <!-- 1. incomplete html comment -- <!-- 2. complete html comment -->)
		// MW seems to work like this with wikitext -> html conversion.
	    data = fck_mw_plg_replaceHTMLcomments( data ); //16.01.14 RL

        var rootNode = this._getNodeFromHtml( data );
		if ( !rootNode ) return false; //16.01.14 RL IE catches some exeptions with page

		// rootNode is <body>.
		// Normalize the document for text node processing (except IE - #1586).
		if ( !CKEDITOR.env.ie ) {
			rootNode.normalize();
        }

		var stringBuilder = new Array();
		this._AppendNode( rootNode, stringBuilder, '' );  

		// Restore original html comments from "Fckmw<id>fckmw" -keys.
		return fck_mv_plg_revertEncapsulatedString( stringBuilder.join( '' ).Trim() ); //16.01.15 RL
		// return stringBuilder.join( '' ).Trim();  //16.01.15 RL Commented out
	},

    _getNodeFromHtml : function( data ) {
        if (window.DOMParser) {  // all browsers, except IE before version 9
            parser=new DOMParser();
            try {         // 16.01.15 RL
                var xmlDoc=parser.parseFromString(data,"text/xml");
            } catch (e) { // 16.01.15 RL
                // not well-formed text raises an exception in IE from version 9, others let it continue
                alert ("XML parsing error [ plugin.js->_getNodeFromHtml (if) ]");
                return false;
			};
        }
        else // Internet Explorer before version 9
        {
            data = this.ieFixHTML(data);
			try {         // 16.01.15 RL
                var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            } catch (e) { // 16.01.15 RL
                alert ("XML parsing error [ plugin.js->_getNodeFromHtml (else) ]");
                return false;                
            }
			xmlDoc.async="false";
            xmlDoc.loadXML(data);
        }
        var rootNode = xmlDoc.documentElement;
        return rootNode;
    },

	// Collection of element definitions:
	//		0 : Prefix
	//		1 : Suffix
	//		2 : Ignore children
	_BasicElements : {
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
	} ,

	// This function is based on FCKXHtml._AppendNode.
	_AppendNode : function( htmlNode, stringBuilder, prefix ){
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
//			    if ( htmlNode.getAttribute( 'data-cke-realelement' ) ) {
	            if ( htmlNode.getAttribute( 'data-cke-realelement' ) ) {
                    this._AppendNode( this._getRealElement( htmlNode ), stringBuilder, prefix );
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
//				if ( CKEDITOR.env.gecko && sNodeName == 'br' && htmlNode.getAttribute( 'type', 2 ) == '_moz' )
//					return;
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
				var basicElement = this._BasicElements[ sNodeName ];
				if ( basicElement ){
					var basic0 = basicElement[0];
					var basic1 = basicElement[1];

                    // work around for text alignment, fix bug 12043
                    if (sNodeName == 'p') {
                        try {
                            var style = htmlNode.getAttribute('style') || '',
                                alignment = style.match(/text-align:\s*(\w+);?/i);
                            if ( alignment[1].toLowerCase().IEquals("right", "center", "justify" ) ) {
                                this._AppendTextNode( htmlNode, stringBuilder, sNodeName, prefix);
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
						this._AppendChildNodes( htmlNode, stringBuilder, prefix );
						// only empty element inside, remove it to avoid quotes
						if ( ( stringBuilder.length == len || ( stringBuilder.length == len + 1 && !stringBuilder[len].length ) )
							&& basicElement[0] && basicElement[0].charAt(0) == "'" ){
							stringBuilder.pop();
							stringBuilder.pop();
							return;
						}
					}

					if ( basic1 )
						stringBuilder.push( basic1 );
				} else {
					switch ( sNodeName ){
						case 'ol' :
						case 'ul' :
							var isFirstLevel = !htmlNode.parentNode.nodeName.IEquals( 'ul', 'ol', 'li', 'dl', 'dt', 'dd' ),
                                listStyle = htmlNode.getAttribute('style') || '',
                                startNum = htmlNode.getAttribute('start') || '';
                            this.preserveLiNode = (listStyle && !listStyle.match(/list-style-type:\s*decimal;/i) || startNum && startNum != '1');
                            if (this.preserveLiNode) {
                                stringBuilder.push('<' + sNodeName);
                                if (startNum)
                                    stringBuilder.push(' start="' + startNum + '"');
                                if (listStyle)
                                    stringBuilder.push(' style="' + listStyle + '"');
                                stringBuilder.push('>\n');
                            }

							this._AppendChildNodes( htmlNode, stringBuilder, prefix );

                            if (this.preserveLiNode)
                                stringBuilder.push('</' + sNodeName + '>');

							if ( isFirstLevel && stringBuilder[ stringBuilder.length - 1 ] != "\n" ) {
								stringBuilder.push( '\n' );
							}

							break;

						case 'li' :

                            if (this.preserveLiNode) {
                                stringBuilder.push('<li>');
                                this._AppendChildNodes( htmlNode, stringBuilder, prefix );
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
							this._AppendChildNodes( htmlNode, stringBuilder, prefix + listType );

							break;

						case 'a' :
                            // if there is no inner HTML in the Link, do not add it to the wikitext
                            if (! this._GetNodeText(htmlNode).Trim() ) break;

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
								var testInner = this._GetNodeText(htmlNode) || '';
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

                            var innerHTML = this._GetNodeText(htmlNode)
							if ( pipeline && innerHTML != '[n]' && ( !isWikiUrl || href != innerHTML || !href.toLowerCase().StartsWith( "category:" ) ) ){
								stringBuilder.push( isWikiUrl? '|' : ' ' );
								this._AppendChildNodes( htmlNode, stringBuilder, prefix );
							}
							stringBuilder.push( isWikiUrl ? ']]' : ']' );

							break;

						case 'dl' :

							this._AppendChildNodes( htmlNode, stringBuilder, prefix );
							var isFirstLevel = !htmlNode.parentNode.nodeName.IEquals( 'ul', 'ol', 'li', 'dl', 'dd', 'dt' );
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
							this._AppendChildNodes( htmlNode, stringBuilder, prefix + ";" );

							break;

						case 'dd' :

							if( stringBuilder.length > 1 ){
								var sLastStr = stringBuilder[ stringBuilder.length - 1 ];
								if ( sLastStr != ";" && sLastStr != ":" && sLastStr != "#" && sLastStr != "*" )
 									stringBuilder.push( '\n' + prefix );
							}
							stringBuilder.push( ':' );
							this._AppendChildNodes( htmlNode, stringBuilder, prefix + ":" );

							break;

						case 'table' :

							var attribs = this._GetAttributesStr( htmlNode );

							stringBuilder.push( '\n{|' );
							if ( attribs.length > 0 )
								stringBuilder.push( attribs );
							stringBuilder.push( '\n' );

							if ( htmlNode.caption && this._GetNodeText(htmlNode.caption).length > 0 ){
								stringBuilder.push( '|+ ' );
								this._AppendChildNodes( htmlNode.caption, stringBuilder, prefix );
								stringBuilder.push( '\n' );
							}

                            // iterate over children, normally <tr>
                            var currentNode = (htmlNode.childNodes.length > 0) ? htmlNode.childNodes[0] : null;
                            var level = 0;

							while (currentNode) {
                                // reset the tagname. Needed later when finding next nodes
                                var currentTagName = null;

                                // we found an element node
                                if (currentNode.nodeType == 1) {
                                    // remember the tag name
                                    currentTagName = currentNode.tagName.toLowerCase();
                                    // we have a table row tag
                                    if (currentTagName == "tr") {
                                        attribs = this._GetAttributesStr( currentNode ) ;

                                        stringBuilder.push( '|-' ) ;
                                        if ( attribs.length > 0 )
                                            stringBuilder.push( attribs ) ;
                                        stringBuilder.push( '\n' ) ;

//                                        var cell = currentNode.firstElementChild;
                                        var cell = currentNode.firstChild;
                                        while ( cell ) {
                                            attribs = this._GetAttributesStr( cell ) ;

                                            if ( cell.tagName.toLowerCase() == "th" )
                                                stringBuilder.push( '!' ) ;
                                            else
                                                stringBuilder.push( '|' ) ;

                                            if ( attribs.length > 0 )
                                                stringBuilder.push( attribs + ' |' ) ;

                                            stringBuilder.push( ' ' ) ;

                                            this._IsInsideCell = true ;
                                            this._AppendChildNodes( cell, stringBuilder, prefix ) ;
                                            this._IsInsideCell = false ;

                                            stringBuilder.push( '\n' ) ;
//                                            cell = cell.nextElementSibling;
                                            cell = cell.nextSibling;
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
                                                this._AppendNode( currentNode, stringBuilder, prefix ) ;
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

							if ( imgCaption.length > 0 )
								stringBuilder.push( '|' + imgCaption );
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
									stringBuilder.push( this._GetNodeText(htmlNode).htmlDecode().replace(/fckLR/g,'\r\n').replace(/fckSPACE/g,' ') ); //30.10.14 RL fckSPACE
									stringBuilder.push( '</syntaxhighlight>' );  //02.11.14 RL Was source
									return;

								case 'fck_mw_ref' :
									var refName = htmlNode.getAttribute( 'name' );

									stringBuilder.push( '<ref' );

									if ( refName && refName.length > 0 )
										stringBuilder.push( ' name="' + refName + '"' );

									if ( this._GetNodeText(htmlNode).length == 0 )
										stringBuilder.push( ' />' );
									else {
										stringBuilder.push( '>' );
										stringBuilder.push( this._GetNodeText(htmlNode) );
										stringBuilder.push( '</ref>' );
									}
									return;

								case 'fck_mw_references' :
									stringBuilder.push( '<references />' );
									return;

								case 'fck_mw_signature' :
									stringBuilder.push( this.editor.config.WikiSignature );
									return;

								case 'fck_mw_template' :
                                case 'fck_smw_query' :
                                    var inner= this._GetNodeText(htmlNode).htmlDecode().replace(/fckLR/g,'\r\n');
                                    if (inner == '{{!}}')
                                        stringBuilder.push( '\n' );
                                    stringBuilder.push( inner );
									return;
                                case 'fck_smw_webservice' :
                                case 'fck_smw_rule' :
									stringBuilder.push( this._GetNodeText(htmlNode).htmlDecode().replace(/fckLR/g,'\r\n') );
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
                                            var attribs = this._GetAttributesStr( htmlNode ) ;
                							stringBuilder.push( '<' + tagName ) ;

                                            if ( attribs.length > 0 )
                                                stringBuilder.push( attribs ) ;

                							stringBuilder.push( '>' ) ;
                                			stringBuilder.push( this._GetNodeText(htmlNode).htmlDecode().replace(/fckLR/g,'\r\n').replace(/_$/, '').replace(/fckSPACE/g,' ') ); //04.02.15 RL fckSPACE
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
								            if (this._GetNodeText(htmlNode).length > 0)
								                stringBuilder.push( ':' + this._GetNodeText(htmlNode).htmlDecode().replace(/fckLR/g,'\r\n').replace(/_$/, '').replace(/fckSPACE/g,' ') ); //04.02.15 RL fckSPACE
								            stringBuilder.push( '}}');
								            break;
                                        case 'sf' :
                                            stringBuilder.push( this._GetNodeText(htmlNode).htmlDecode().replace(/fckLR/g,'\r\n').replace(/fckSPACE/g,' ') ); //04.02.15 RL fckSPACE
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
									stringBuilder.push( this._formatSemanticValues( htmlNode ) ) ;
									return ;
							}

							// Change the node name and fell in the "default" case.
							if ( htmlNode.getAttribute( '_fck_mw_customtag' ) )
								sNodeName = htmlNode.getAttribute( '_fck_mw_tagname' );
                            this._AppendTextNode( htmlNode, stringBuilder, sNodeName, prefix )
							break;
						case 'pre' :
							var attribs = this._GetAttributesStr( htmlNode );
                            var eClassName = htmlNode.getAttribute('class')
							if ( eClassName == "_fck_mw_lspace" ){
								stringBuilder.push( "\n " );
								this._inLSpace = true;
								this._AppendChildNodes( htmlNode, stringBuilder, prefix );
								this._inLSpace = false;
								var len = stringBuilder.length;
								if ( len > 1 ) {
									var tail = stringBuilder[len-2] + stringBuilder[len-1];
									if ( len > 2 ) {
										tail = stringBuilder[len-3] + tail;
									}
									if (tail.EndsWith("\n ")) {
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
								if( this._GetNodeText(htmlNode) == '' )
									stringBuilder.push( ' />' );
								else {
									stringBuilder.push( '>' );
									this._inPre = true;
									this._AppendChildNodes( htmlNode, stringBuilder, prefix );
									this._inPre = false;

									stringBuilder.push( '<\/' );
									stringBuilder.push( sNodeName );
									stringBuilder.push( '>' );

									stringBuilder.push( "\n" );  //04.02.14 RL Required by sequential pre- tags.
								}
							}
							break;
						default :
                            this._AppendTextNode( htmlNode, stringBuilder, sNodeName, prefix )
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
					if ( CKEDITOR.env.ie && this._inLSpace ) {
						textValue = textValue.replace( /\r/g, "\r " );
						if (textValue.EndsWith( "\r " )) {
							textValue = textValue.replace( /\r $/, "\r" );
						}
					}
					if ( !CKEDITOR.env.ie && this._inLSpace ) {
						textValue = textValue.replace( /\n(?! )/g, "\n " );
					}

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
						textValue = textValue.replace(/\s*$/, ''); // rtrim

					if( !this._inLSpace && !this._inPre && htmlNode.parentNode.tagName.toLowerCase() != 'a' ) {
						textValue = textValue.replace( / {2,}/g, ' ' );
                        textValue = this._EscapeWikiMarkup(textValue);
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
				if ( CKEDITOR.env.ie && !this._GetNodeText(htmlNode) )
					return;

				stringBuilder.push( "<!--"  );

				try	{
					stringBuilder.push( htmlNode.nodeValue );
				} catch( e ) { /* Do nothing... probably this is a wrong format comment. */ }

				stringBuilder.push( "-->" );							
				return;
		}
	},

	_AppendChildNodes : function( htmlNode, stringBuilder, listPrefix ){
		var child = htmlNode.firstChild;

		while ( child ){
			this._AppendNode( child, stringBuilder, listPrefix );
			child = child.nextSibling;
		}
	},

    _AppendTextNode : function( htmlNode, stringBuilder, sNodeName, prefix ) {
    	var attribs = this._GetAttributesStr( htmlNode ) ;

		stringBuilder.push( '<' ) ;
		stringBuilder.push( sNodeName ) ;

    	if ( attribs.length > 0 )
			stringBuilder.push( attribs ) ;

		stringBuilder.push( '>' ) ;
		this._AppendChildNodes( htmlNode, stringBuilder, prefix ) ;
		stringBuilder.push( '<\/' ) ;
		stringBuilder.push( sNodeName ) ;
		stringBuilder.push( '>' ) ;
    },

	_GetAttributesStr : function( htmlNode ){
		var attStr = '';
		var aAttributes = htmlNode.attributes;

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
	},
    // in FF htmlNode.textContent is set, while IE needs htmlNode.text;
    _GetNodeText : function( htmlNode ) {
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
    },

	// Property and Category values must be of a certain format. Otherwise this will break
	// the semantic annotation when switching between wikitext and WYSIWYG view
	_formatSemanticValues : function (htmlNode) {
		var text = this._GetNodeText(htmlNode).htmlDecode(); //05.12.14 RL Added htmlDecode

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
				     (sort.substr(0,1).toUpperCase() == mw.config.get( 'wgPageName' ).trim().substr(0,1).toUpperCase()) ) {
					sort = null;  
				}  //12.12.14 RL<-	
				if (sort) {
					if (emptyVal.exec(sort)) sort = ' ';
					return '[[' + labelCategory + ':' + text + '|' + sort + ']]';
				}
				if (emptyVal.exec(text)) return '';
				return '[[' + labelCategory + ':' + text + ']]'
		}
	},
    // Get real element from a fake element.
    _getRealElement : function( element ) {

        var attributes = element.attributes;
        var realHtml = attributes && attributes.getNamedItem('data-cke-realelement');
		var realNode = realHtml && decodeURIComponent( realHtml.nodeValue );
        var realElement = realNode && this._getNodeFromHtml( realNode );

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
    },

    _EscapeWikiMarkup : function (text) {

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
    },

	ieFixHTML: function(html, convertToLowerCase){
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
	}

};

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
    var chars = new Array ('à','á','â','ã','ä','å','æ','ç','è','é',
                           'ê','ë','ì','í','î','ï','ð','ñ','ò','ó','ô',
                           'õ','ö','ø','ù','ú','û','ü','ý','þ','ÿ','À',
                           'Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë',
                           'Ì','Í','Î','Ï','Ð','Ñ','Ò','Ó','Ô','Õ','Ö',
                           'Ø','Ù','Ú','Û','Ü','Ý','Þ','€','\"','ß',
                           '¢','£','¤','¥','¦','§','¨','©','ª','«',
                           '¬','­','®','¯','°','±','²','³','´','µ','¶',
                           '·','¸','¹','º','»','¼','½','¾');

    var entities = new Array ('agrave','aacute','acirc','atilde','auml','aring',
                              'aelig','ccedil','egrave','eacute','ecirc','euml','igrave',
                              'iacute','icirc','iuml','eth','ntilde','ograve','oacute',
                              'ocirc','otilde','ouml','oslash','ugrave','uacute','ucirc',
                              'uuml','yacute','thorn','yuml','Agrave','Aacute','Acirc',
                              'Atilde','Auml','Aring','AElig','Ccedil','Egrave','Eacute',
                              'Ecirc','Euml','Igrave','Iacute','Icirc','Iuml','ETH','Ntilde',
                              'Ograve','Oacute','Ocirc','Otilde','Ouml','Oslash','Ugrave',
                              'Uacute','Ucirc','Uuml','Yacute','THORN','euro','quot','szlig',
                              'cent','pound','curren','yen','brvbar','sect','uml',
                              'copy','ordf','laquo','not','shy','reg','macr','deg','plusmn',
                              'sup2','sup3','acute','micro','para','middot','cedil','sup1',
                              'ordm','raquo','frac14','frac12','frac34');
//    var chars = new Array ('&','à','á','â','ã','ä','å','æ','ç','è','é',
//                           'ê','ë','ì','í','î','ï','ð','ñ','ò','ó','ô',
//                           'õ','ö','ø','ù','ú','û','ü','ý','þ','ÿ','À',
//                           'Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë',
//                           'Ì','Í','Î','Ï','Ð','Ñ','Ò','Ó','Ô','Õ','Ö',
//                           'Ø','Ù','Ú','Û','Ü','Ý','Þ','€','\"','ß','<',
//                           '>','¢','£','¤','¥','¦','§','¨','©','ª','«',
//                           '¬','­','®','¯','°','±','²','³','´','µ','¶',
//                           '·','¸','¹','º','»','¼','½','¾');
//
//    var entities = new Array ('amp','agrave','aacute','acirc','atilde','auml','aring',
//                              'aelig','ccedil','egrave','eacute','ecirc','euml','igrave',
//                              'iacute','icirc','iuml','eth','ntilde','ograve','oacute',
//                              'ocirc','otilde','ouml','oslash','ugrave','uacute','ucirc',
//                              'uuml','yacute','thorn','yuml','Agrave','Aacute','Acirc',
//                              'Atilde','Auml','Aring','AElig','Ccedil','Egrave','Eacute',
//                              'Ecirc','Euml','Igrave','Iacute','Icirc','Iuml','ETH','Ntilde',
//                              'Ograve','Oacute','Ocirc','Otilde','Ouml','Oslash','Ugrave',
//                              'Uacute','Ucirc','Uuml','Yacute','THORN','euro','quot','szlig',
//                              'lt','gt','cent','pound','curren','yen','brvbar','sect','uml',
//                              'copy','ordf','laquo','not','shy','reg','macr','deg','plusmn',
//                              'sup2','sup3','acute','micro','para','middot','cedil','sup1',
//                              'ordm','raquo','frac14','frac12','frac34');

    string = this;
    for (var i = 0; i < entities.length; i++) {
      myRegExp = new RegExp();
      myRegExp.compile('&' + entities[i]+';','g');
      string = string.replace (myRegExp, chars[i]);
    }
    string = string.replace(/&nbsp;/g, '&#160;');
    return string;
  }
}
