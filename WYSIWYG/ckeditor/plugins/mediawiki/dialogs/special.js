CKEDITOR.dialog.add( 'MWSpecialTags', function( editor ) {
{
        return {
            title : editor.lang.mwplugin.specialTagTitle,
            minWidth  : 600,
            minHeight : 150,
            resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
			contents : [
				{
					id : 'mwSpecialTagDef',
					label : 'Special Tags label',
                    title : 'Special Tags title',
					elements :
					[
                        {
                            id:    'tagDefinition',
                            type:  'textarea',
                            rows:  16,
                            label: editor.lang.mwplugin.specialTagDef,
                            title: editor.lang.mwplugin.specialTagDef,
                            className: 'swmf_class',
                            style: 'border: 1px;'
                        }
		            ]
                }
            ],
            onOk : function() {
        		var tag = null,
                    className = null,
                    textarea = this.getContentElement( 'mwSpecialTagDef', 'tagDefinition'),
                    content = textarea.getValue(),
                    //wgCKeditorMagicWords = window.parent.wgCKeditorMagicWords || window.parent.parent.wgCKeditorMagicWords;
					_wgCKeditorMagicWords = mw.config.get('wgCKeditorMagicWords');

				content.Trim();
				content = content.replace(/\r?\n/g, 'fckLR');

				// check for a allowed tags
				//if (el = content.match(/^<([\w_-]+)>(.*?)<\/([\w_-]+)>$/)) { //17.11.14 RL
				//if (el = content.match(/^<([\w_-]+)\s*([\w_-]*)=*("?[\w_-\s\:\;\,]*"?)\s*([\w_-]*)=*("?[\w_-\s\:\;\,]*"?)\s*([\w_-]*)=*("?[\w_-\s\:\;\,]*"?)>(.*?)<\/([\w_-]+)>$/)) { //21.11.14 RL			
				if (el = content.match(/^<([\w_-]+)\s*([\w_-]*)=*("?[\w_-\s\:\;\,\.\/\(\)\'\!]*"?)\s*([\w_-]*)=*("?[\w_-\s\:\;\,\.\/\(\)\'\!]*"?)\s*([\w_-]*)=*("?[\w_-\s\:\;\,\.\/\(\)\'\!]*"?)\s*([\w_-]*)=*("?[\w_-\s\:\;\,\.\/\(\)\'\!]*"?)>(.*?)<\/([\w_-]+)>$/)) { //23.11.14 RL			
					// $1  ($2  $3) x 4        $10   $11    $1  $2      $10   $11    $1  &2  $10  $11      $1  $10  $11
					//<tag xxx=aaa:bbb;ccc:ddd>zzzz</tag>, <tag xxx=yyy>zzzz</tag>, <tag xxx>zzz</tag> or <tag>zzz</tag>

					//For <source> tag replace it with <syntaxhighlight> tag and refresh contents of el -variable after replace.
					//Note! Latest version of syntaxhighlight extension, >= rev:50696, should be installed.
					if ( content.match(/^<(source).*?lang="([\w_-]+)">(.*?)<\/(source)>$/) ) { //02.11.14 RL
						content = content.replace(/^<(source).*?lang="([\w_-]+)">(.*?)<\/(source)>$/, '<syntaxhighlight lang="$2">$3</syntaxhighlight>');
						//Note! Below should be same match as in "if (el = content.match..." test abowe.
						if ( ! (el = content.match(/^<([\w_-]+)\s*([\w_-]*)=*("?[\w_-\s\:\;\,]*"?)\s*([\w_-]*)=*("?[\w_-\s\:\;\,]*"?)\s*([\w_-]*)=*("?[\w_-\s\:\;\,]*"?)>(.*?)<\/([\w_-]+)>$/))) { //23.11.14 RL			
							alert (editor.lang.mwplugin.invalidContent);
							return false;					
						}
					}	
					
					var inner     = el[10] || '_',     //23.11.14 RL
                        spanClass = 'fck_mw_special',  //Default: tag is displayed as special -element in wysiwyg
						attrstr   = '';                //23.11.14 RL
                    className = 'FCK__MWSpecial';

                    if (el[1].InArray(_wgCKeditorMagicWords.imagewikitags)) { //19.11.14 RL List of "known" MW tags in wysiwyg 
						spanClass = 'fck_mw_' + el[1];                       //Tag has own element in wysiwyg
                        className = 'FCK__MW' + el[1].substr(0, 1).toUpperCase() + el[1].substr(1);
                    }					
                    tag = '<span class="'+ spanClass +'" _fck_mw_customtag="true" _fck_mw_tagname="' + el[1] + '"'; 

					for (i = 2; i <= 8; i++, i++) { //23.11.14 RL-> i=2,4,6 => maximum of 4 attributes
						if ( el[i] != '' && el[i+1] != '' ) {
							tag = tag + ' ' + el[i] + '=' + el[i+1]; 
							attrstr = attrstr + el[i] + ",";
						}
					}
					
					if ( attrstr != '' ) { //23.11.14 RL
						tag = tag + ' _fck_mw_tagattributes="' + attrstr.substr( 0, attrstr.length - 1 ) + '"';
					}                                           
					
                    tag = tag + ' _fck_mw_tagtype="t">' + convToHTML(inner) + '</span>'; //19.11.14 RL Added convToHTML()				
				}
                else if (el = content.match(/^__(.*?)__$/)) {
                    tag = '<span class="fck_mw_magic" _fck_mw_customtag="true" _fck_mw_tagname="' + el[1] + '" _fck_mw_tagtype="c">'
                        + '_</span>'
                    className = 'FCK__MWMagicWord';
                }
                else if (el = content.match(/^{{(#?[\w\d_-]+):(.*?)}}$/)) {
                    var tagType = 'p';
                    if (el[1].InArray(_wgCKeditorMagicWords.datevars)) tagType = 'v';
                    else if (el[1].InArray(_wgCKeditorMagicWords.wikivars)) tagType = 'w';
                    var inner = el[2] || '_';
                    tag = '<span class="fck_mw_special" _fck_mw_customtag="true" _fck_mw_tagname="' + el[1] + '"' +
                          ' _fck_mw_tagtype="' + tagType + '">'
                        + convToHTML(inner)  + '</span>' //19.11.14 RL Added convToHTML()	
                    className = 'FCK__MWSpecial';
                }
                else if (el = content.match(/^{{([A-Z\d]+)}}$/)) {
                    var tagType = '';
                    if (el[1].InArray(_wgCKeditorMagicWords.datevars)) tagType = 'v';
                    else if (el[1].InArray(_wgCKeditorMagicWords.wikivars)) tagType = 'w';
                    if (tagType) {
                        tag = '<span class="fck_mw_special" _fck_mw_customtag="true" _fck_mw_tagname="' + el[1] + '"' +
                              ' _fck_mw_tagtype="' + tagType + '">_</span>'
                        className = 'FCK__MWSpecial';
                    }
                    else {
                        tag = '<span class="fck_mw_template">{{' + el[1] + '}}</span>';
                        className = 'FCK__MWTemplate';
                    }
                }
                else if ( _wgCKeditorMagicWords.sftags && ( el = content.match(/^{{{([\w ]+)((\|[^\|]+)*)}}}$/) ) ) {
					if (el[1].InArray(_wgCKeditorMagicWords.sftags)) tagType = 'sf';
                    if (tagType) {
                        tag = '<span class="fck_mw_special" _fck_mw_customtag="true" _fck_mw_tagname="' + el[1] + '"' +
                              ' _fck_mw_tagtype="' + tagType + '">' + content + '</span>'
                        className = 'FCK__MWSpecial';
                    }
                    else {
                        tag = '<span class="fck_mw_template">{{{' + el[1] + '}}}</span>';
                        className = 'FCK__MWTemplate';
                    }
                }
                else if (el = content.match(/^{{[\w\d_-]+(\|.*?)*}}$/)) {
				                      //    /^{{[\w\d_-]+((\|.*?)*)}}$/   <-this is .match rule of template.js
					tag = '<span class="fck_mw_template">' + el[0] + '</span>'; //21.11.14 RL Original el[0].substr(2, -2) returned empty string because of negative length
                    className = 'FCK__MWTemplate';
                }
                else {
                    alert (editor.lang.mwplugin.invalidContent);
                    return false;
                }
                var element = CKEDITOR.dom.element.createFromHtml(tag, editor.document),
                    newFakeObj = editor.createFakeElement( element, className, 'span' );
                if ( this.fakeObj ) {
					newFakeObj.replace( this.fakeObj );
					editor.getSelection().selectElement( newFakeObj );
				}
				else
					editor.insertElement( newFakeObj );

			},

       		onShow : function() {
				this.fakeObj = false;
        		var editor = this.getParentEditor(),
            		selection = editor.getSelection(),
                	element = null;

    			// Fill in all the relevant fields if there's already one item selected.
        		if ( ( element = selection.getSelectedElement() ) && element.is( 'img' )
            			&& element.getAttribute( 'class' ).InArray( [
                            'FCK__MWSpecial',
                            'FCK__MWMagicWord',
                            'FCK__MWNowiki',
                            'FCK__MWIncludeonly',
                            'FCK__MWNoinclude',
                            'FCK__MWOnlyinclude',
							'FCK__MWMath',            //19.11.14 RL
							'FCK__MWSyntaxhighlight', //17.02.14 RL, 02.11.14 RL Was source
							'FCK__MWGallery'          //21.11.14 RL
                         ])
                    )
                {
					this.fakeObj = element;
    				element = editor.restoreRealElement( this.fakeObj );
        			selection.selectElement( this.fakeObj );

                    var content = '',
                        inner = element.getHtml().replace(/_$/, '').replace(/fckLR/g, '\r\n').replace(/fckSPACE/g,' '); //30.10.14 RL fckSPACE
						
					inner = convFromHTML(inner);		//30.10.14 RL Added convFromHTML()				

					if ( element.getAttribute( 'class' ).InArray(['fck_mw_special',
					                                              'fck_mw_syntaxhighlight' //17.02.14 RL, 03.11.24 RL Was source
																 ])
                       ) 
					{      					
                        var tagName = element.getAttribute('_fck_mw_tagname') || '',
                            tagType = element.getAttribute('_fck_mw_tagtype') || '',
							attr = '',                                               //23.11.14 RL
							index, tagAttrVal;                                       //20.11.14 RL

						if ( element.hasAttribute('_fck_mw_tagattributes') ) {       //23.11.14 RL
							attr = element.getAttribute('_fck_mw_tagattributes').split(",") || ''; 							
						}
						
						if ( tagType == 't' ) {
                            content += '<' + tagName;
							for (index = 0; index < attr.length; ++index) {          //23.11.14 RL Attributes of tag							
								if ( ( attr[index] != undefined ) && ( attr[index] != '' ) ) {
									content += ' ' + attr[index];
									if ( element.hasAttribute(attr[index]) && ( tagAttrVal = element.getAttribute( attr[index] ) || undefined ) != undefined ) { 
										content += '="' + tagAttrVal + '"';
									}
								}									
							} 
							content += '>' + inner + '</' + tagName + '>';
                        }
                        else if ( tagType == 'sf') {
                            content +=  inner;
                        }
                        else {
                            content += '{{' + tagName;
                            if (! tagType.IEquals('w', 'v'))
                                content += ':';
                            content += inner + '}}';
                        }
                    }
                    else if ( element.getAttribute( 'class' ) == 'fck_mw_magic' ) {
                        content += '__' + element.getAttribute('_fck_mw_tagname') + '__';
                    }
                    else {
                        content += '<' + element.getAttribute('_fck_mw_tagname') + '>' +
                        inner +
                        '</' + element.getAttribute('_fck_mw_tagname') + '>';
                    }
					
                    //editor.document.getById('tagDefinition').setHtml(content);
                    var textarea = this.getContentElement( 'mwSpecialTagDef', 'tagDefinition');
                    textarea.setValue(content);
                }
            }
        }
}
} );
