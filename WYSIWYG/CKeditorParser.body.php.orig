<?php

class CKeditorParser extends CKeditorParserWrapper {
	public static $fck_mw_makeImage_options;
	protected $fck_mw_strtr_span;
	protected $fck_mw_strtr_span_counter = 1;
	protected $fck_mw_taghook;
	protected $fck_internal_parse_text;
	protected $fck_matches = array();
    protected $fck_mw_propertyAtPage = array();
    protected $fck_mw_richmediaLinkAtPage = array();
    private $fck_allTagsCurrentTagReplaced = '';

    // list here all standard wiki tags that are supported by Mediawiki
    private $FCKeditorWikiTags = array(
       "nowiki",
       "includeonly",
       "onlyinclude",
       "noinclude"
    );
	private $FCKeditorMagicWords = array(
       "NOTOC",
       "FORCETOC",
       "TOC",
       "NOEDITSECTION",
       "NEWSECTIONLINK",
       "NONEWSECTIONLINK", // MW 1.15+
       "NOCONTENTCONVERT",
       "NOCC",
       "NOTITLECONVERT",
       "NOTC",
       "NOGALLERY",
       "INDEX", // MW 1.14+
       "NOINDEX", // MW 1.14+
       "STATICREDIRECT", // MW 1.14+
       "NOGALLERY",
       "HIDDENCAT",
       "START",
       "END"
	);
    private $FCKeditorDateTimeVariables= array(
       'CURRENTYEAR',
       'CURRENTMONTH',
       'CURRENTMONTHNAME',
       'CURRENTMONTHNAMEGEN',
       'CURRENTMONTHABBREV',
       'CURRENTDAY',
       'CURRENTDAY2',
       'CURRENTDOW',
       'CURRENTDAYNAME',
       'CURRENTTIME',
       'CURRENTHOUR',
       'CURRENTWEEK',
       'CURRENTTIMESTAMP'
    );
    private $FCKeditorWikiVariables = array(
       'SITENAME',
       'SERVER',
       'SERVERNAME',
       'DIRMARK',
       'SCRIPTPATH',
       'CURRENTVERSION',
       'CONTENTLANG',
       'REVISIONID',
       'REVISIONDAY',
       'REVISIONDAY2',
       'REVISIONMONTH',
       'REVISIONYEAR',
       'REVISIONTIMESTAMP',
       'REVISIONUSER', // MW 1.15+
       'FULLPAGENAME',
       'PAGENAME',
       'BASEPAGENAME',
       'SUBPAGENAME',
       'SUBJECTPAGENAME',
       'TALKPAGENAME',
       'NAMESPACE',
       'ARTICLESPACE',
       'TALKSPACE'
    );
    private $FCKeditorFunctionHooks = array(
        'lc',
        'lcfirst',
        'uc',
        'ucfirst',
        'formatnum',
        '#dateformat', // MW 1.15+
        'padleft',
        'padright',
        'plural',
        'grammar',
        '#language',
        'int',
        '#tag',
    );
    // these tags are for Semantic Forms extension (in a forms page)
    private $FCKeditorSFspecialTags = array(
        'info',
        'for template',
        'field',
        'end template',
        'standard input'
    );

    public function __construct() {
        global $wgParser;
        parent::__construct();
        // add custom tags from extensions to list
        foreach ($wgParser->getTags() as $h) {
            if (! in_array($h, $this->FCKeditorWikiTags) &&
                ! (defined('SMW_DI_VERSION') && $h == "webservice")
               )
                $this->FCKeditorWikiTags[] = $h;
    	}
        // add custom parser funtions from extensions to list
        foreach ($wgParser->getFunctionHooks() as $h) {
            // ask and sparql + ws are no special tags and have there own <span> elements in FCK
            // when SMWHalo or the DataImport extension is installed
            if (defined('SMW_HALO_VERSION') && in_array($h, array("ask", "sparql")))
                continue;
            if (defined('SMW_DI_VERSION') && $h == "ws")
                continue;
            if (!in_array('#'.$h, $this->FCKeditorFunctionHooks))
                $this->FCKeditorFunctionHooks[] = '#'.$h;
        }
    }
    
    public function getSpecialTags() {
        return $this->FCKeditorWikiTags;
    }
    public function getMagicWords() {
        return $this->FCKeditorMagicWords;
    }
    public function getDateTimeVariables() {
        return $this->FCKeditorDateTimeVariables;
    }
    public function getWikiVariables() {
        return $this->FCKeditorWikiVariables;
    }
    public function getFunctionHooks() {
        return $this->FCKeditorFunctionHooks;
    }
    public function getSfSpecialTags() {
        return $this->FCKeditorSFspecialTags;
    }

	/**
	 * Add special string (that would be changed by Parser) to array and return simple unique string
	 * that will remain unchanged during whole parsing operation.
	 * At the end we'll replace all this unique strings with original content
	 *
	 * @param string $text
	 * @return string
	 */
	private function fck_addToStrtr( $text, $replaceLineBreaks = true ) {
		$key = 'Fckmw' . $this->fck_mw_strtr_span_counter . 'fckmw';
		$this->fck_mw_strtr_span_counter++;
		if( $replaceLineBreaks ) {
			$this->fck_mw_strtr_span[$key] = str_replace( array( "\r\n", "\n", "\r" ), 'fckLR', $text );
		} else {
			$this->fck_mw_strtr_span[$key] = $text;
		}
		return $key;
	}

	/**
	 * Handle link to subpage if necessary
	 * @param string $target the source of the link
	 * @param string &$text the link text, modified as necessary
	 * @return string the full name of the link
	 * @private
	 */
	function maybeDoSubpageLink( $target, &$text ) {
		return $target;
	}

	/**
	 * DO NOT replace special strings like "ISBN xxx" and "RFC xxx" with
	 * magic external links.
	 *
	 * DML
	 * @private
	 */
	function magicLinkCallback( $m ) {
		if ( isset( $m[1] ) && $m[1] !== '' ) {
			# Skip anchor
			return $m[0];
		} elseif ( isset( $m[2] ) && $m[2] !== '' ) {
			# Skip HTML element
			return $m[0];
		} elseif ( isset( $m[3] ) && $m[3] !== '' ) {
			# Free external link
			return $this->makeFreeExternalLink( $m[0] );
		} else { # skip the rest
			return $m[0];
		}
	}

	/**
	 * Callback function for custom tags: feed, ref, references etc.
	 *
	 * @param string $str Input
	 * @param array $argv Arguments
	 * @return string
	 */
	function fck_genericTagHook( $str, $argv, $parser ) {
		if( in_array( $this->fck_mw_taghook, array( 'ref', 'math', 'references', 'source' ) ) ) {
			$class = $this->fck_mw_taghook;
		} else {
			$class = 'special';
		}

        $ret = '<span class="fck_mw_' . $class . '" _fck_mw_customtag="true" '.
               '_fck_mw_tagname="' . $this->fck_mw_taghook . '" _fck_mw_tagtype="t"';
		if( empty( $argv ) ) {
			$ret .= '>';
		} else {
			foreach( $argv as $key => $value ) {
				$ret .= " " . $key . "=\"" . $value . "\"";
			}
			$ret .= '>';
		}
		if( is_null( $str ) ) {
			//$ret = substr( $ret, 0, -1 ) . ' />';
            $ret .= '>_</span>';
		} else {
			$ret .= htmlspecialchars( $str );
			$ret .= '</span>';
		}

		$replacement = $this->fck_addToStrtr( $ret );
		return $replacement;
	}

	/**
	 * Callback function for wiki tags: nowiki, includeonly, noinclude
	 *
	 * @param string $tagName tag name, eg. nowiki, math
	 * @param string $str Input
	 * @param array $argv Arguments
	 * @return string
	 */
	function fck_wikiTag( $tagName, $str, $argv = array() ) {
        if( empty( $argv ) ) {
			$ret = '<span class="fck_mw_' . $tagName . '" _fck_mw_customtag="true" _fck_mw_tagname="' . $tagName . '">';
		} else {
			$ret = '<span class="fck_mw_' . $tagName . '" _fck_mw_customtag="true" _fck_mw_tagname="' . $tagName . '"';
			foreach( $argv as $key => $value ) {
				$ret .= " " . $key . "=\"" . $value . "\"";
			}
			$ret .= '>';
		}
		if( !is_null( $str ) )
            $ret .= htmlspecialchars( $str );
        else $ret .= '_';
		$ret .= '</span>';

		$replacement = $this->fck_addToStrtr( $ret );

		return $replacement;
	}

	/**
	 * Strips and renders nowiki, pre, math, hiero
	 * If $render is set, performs necessary rendering operations on plugins
	 * Returns the text, and fills an array with data needed in unstrip()
	 *
	 * @param StripState $state
	 *
	 * @param bool $stripcomments when set, HTML comments <!-- like this -->
	 *  will be stripped in addition to other tags. This is important
	 *  for section editing, where these comments cause confusion when
	 *  counting the sections in the wikisource
	 *
	 * @param array dontstrip contains tags which should not be stripped;
	 *  used to prevent stipping of <gallery> when saving (fixes bug 2700)
	 *
	 * @private
	 */
	function strip( $text, $state, $stripcomments = false, $dontstrip = array() ) {
		global $wgContLang, $wgUseTeX, $wgScriptPath, $wgVersion, $wgHooks, $wgExtensionFunctions;

		wfProfileIn( __METHOD__ );
		$render = ( $this->mOutputType == OT_HTML );

		$uniq_prefix = $this->mUniqPrefix;
		$commentState = new ReplacementArray;
		$nowikiItems = array();
		$generalItems = array();

		$elements = array_merge( array( 'nowiki', 'gallery', 'math' ), array_keys( $this->mTagHooks ) );
		if ( ( isset( $wgHooks['ParserFirstCallInit']) && in_array( 'efSyntaxHighlight_GeSHiSetup', $wgHooks['ParserFirstCallInit'] ) )
			|| ( isset( $wgExtensionFunctions ) && in_array( 'efSyntaxHighlight_GeSHiSetup', $wgExtensionFunctions ) ) ) {
			$elements = array_merge( $elements, array( 'source' ) );
		}
		if ( ( isset( $wgHooks['ParserFirstCallInit'] ) && in_array( 'wfCite', $wgHooks['ParserFirstCallInit'] ) )
			|| ( isset( $wgExtensionFunctions ) && in_array( 'wfCite', $wgExtensionFunctions ) ) ) {
			$elements = array_merge( $elements, array( 'ref', 'references' ) );
		}
		global $wgRawHtml;
		if( $wgRawHtml ) {
			$elements[] = 'html';
		}

		# Removing $dontstrip tags from $elements list (currently only 'gallery', fixing bug 2700)
		foreach( $elements as $k => $v ) {
			if( !in_array( $v, $dontstrip ) )
				continue;
			unset( $elements[$k] );
		}

		$elements = array_unique( $elements );
		$matches = array();
		if( version_compare( "1.12", $wgVersion, ">" ) ) {
			$text = Parser::extractTagsAndParams( $elements, $text, $matches, $uniq_prefix );
		} else {
			$text = self::extractTagsAndParams( $elements, $text, $matches, $uniq_prefix );
		}

		foreach( $matches as $marker => $data ) {
			list( $element, $content, $params, $tag ) = $data;
			if( $render ) {
				$tagName = strtolower( $element );
				wfProfileIn( __METHOD__ . "-render-$tagName" );
				switch( $tagName ) {
					case '!--':
						// Comment
						if( substr( $tag, -3 ) == '-->' ) {
							$output = $tag;
						} else {
							// Unclosed comment in input.
							// Close it so later stripping can remove it
							$output = "$tag-->";
						}
						break;
					case 'references':
						$output = $this->fck_wikiTag( 'references', $content, $params );
						break;
					case 'ref':
						$output = $this->fck_wikiTag( 'ref', $content, $params );
						break;
					case 'source':
						$output = $this->fck_wikiTag( 'source', $content, $params );
						break;
					case 'html':
						if( $wgRawHtml ) {
							$output = $this->fck_wikiTag( 'html', $content, $params );
						}
						break;
					case 'nowiki':
						$output = $this->fck_wikiTag( 'nowiki', $content, $params ); // required by FCKeditor
						break;
					case 'math':
						if( $wgUseTeX ){ //normal render
							$output = $wgContLang->armourMath( MathRenderer::renderMath( $content ) );
						} else // show fakeimage
							$output = '<img _fckfakelement="true" class="FCK__MWMath" _fck_mw_math="'.$content.'" src="'.$wgScriptPath.'/skins/common/images/button_math.png" />';
						break;
					case 'gallery':
						$output = $this->fck_wikiTag( 'gallery', $content, $params ); // required by FCKeditor
						//$output = $this->renderImageGallery( $content, $params );
						break;
					default:
						if( isset( $this->mTagHooks[$tagName] ) ) {
							$this->fck_mw_taghook = $tagName; // required by FCKeditor
							$output = call_user_func_array( $this->mTagHooks[$tagName],
							array( $content, $params, $this ) );
						} else {
							throw new MWException( "Invalid call hook $element" );
						}
				}
				wfProfileOut( __METHOD__ . "-render-$tagName" );
			} else {
				// Just stripping tags; keep the source
				$output = $tag;
			}

			// Unstrip the output, to support recursive strip() calls
			$output = $state->unstripBoth( $output );

       if (!$stripcomments && $element == '!--') {
         $commentState->setPair($marker, $output);
       } elseif ($element == 'html' || $element == 'nowiki') {
#        $nowikiItems[$marker] = $output;
               $state->addNoWiki($marker, $output);
       } else {
#        $generalItems[$marker] = $output;
               $state->addGeneral($marker, $output);
       }
		}


		# Unstrip comments unless explicitly told otherwise.
		# (The comments are always stripped prior to this point, so as to
		# not invoke any extension tags / parser hooks contained within
		# a comment.)
		if ( !$stripcomments ) {
			// Put them all back and forget them
			$text = $commentState->replace( $text );
		}

		$this->fck_matches = $matches;
		wfProfileOut( __METHOD__ );
		return $text;
	}

	/**
	 * Replace HTML comments with unique text using fck_addToStrtr function
	 *
	 * @private
	 * @param string $text
	 * @return string
	 */
	private function fck_replaceHTMLcomments( $text ) {
		wfProfileIn( __METHOD__ );
		while( ( $start = strpos( $text, '<!--' ) ) !== false ) {
			$end = strpos( $text, '-->', $start + 4 );
			if( $end === false ) {
				# Unterminated comment; bail out
				break;
			}

			$end += 3;

			# Trim space and newline if the comment is both
			# preceded and followed by a newline
			$spaceStart = max( $start - 1, 0 );
			$spaceLen = $end - $spaceStart;
			while( substr( $text, $spaceStart, 1 ) === ' ' && $spaceStart > 0 ) {
				$spaceStart--;
				$spaceLen++;
			}
			while( substr( $text, $spaceStart + $spaceLen, 1 ) === ' ' )
				$spaceLen++;
			if( substr( $text, $spaceStart, 1 ) === "\n" and substr( $text, $spaceStart + $spaceLen, 1 ) === "\n" ) {
				# Remove the comment, leading and trailing
				# spaces, and leave only one newline.
				$replacement = $this->fck_addToStrtr( substr( $text, $spaceStart, $spaceLen + 1 ), false );
				$text = substr_replace( $text, $replacement . "\n", $spaceStart, $spaceLen + 1 );
			} else {
				# Remove just the comment.
				$replacement = $this->fck_addToStrtr( substr( $text, $start, $end - $start ), false );
				$text = substr_replace( $text, $replacement, $start, $end - $start );
			}
		}
		wfProfileOut( __METHOD__ );

		return $text;
	}

	function replaceInternalLinks( $text ) {
		$text = preg_replace( "/\[\[([^|\[\]]*?)\]\]/", "[[$1|RTENOTITLE]]", $text ); // #2223: [[()]]	=>	[[%1|RTENOTITLE]]
		$text = preg_replace( "/\[\[:(.*?)\]\]/", "[[RTECOLON$1]]", $text ); // change ':' => 'RTECOLON' in links
		$text = parent::replaceInternalLinks( $text );
		$text = preg_replace( "/\|RTENOTITLE\]\]/", "]]", $text ); // remove unused RTENOTITLE

		return $text;
	}

	function makeImage( $nt, $options, $holders = false ) {
		CKeditorParser::$fck_mw_makeImage_options = $options;
		return parent::makeImage( $nt, $options, $holders );
	}

	/**
	 * Replace templates with unique text to preserve them from parsing
	 *
	 * @todo if {{template}} is inside string that also must be returned unparsed,
	 * e.g. <noinclude>{{template}}</noinclude>
	 * {{template}} replaced with Fckmw[n]fckmw which is wrong...
	 *
	 * @param string $text
	 * @return string
	 */
	private function fck_replaceTemplates( $text ) {

		$callback = array(
			'{' => array(
				'end'=>'}',
				'cb' => array(
					2 => array( $this, 'fck_leaveTemplatesAlone' ),
					3 => array( $this, 'fck_leaveTemplatesAlone' ),
				),
				'min' => 2,
				'max' => 3,
			)
		);

		$text = $this->replace_callback( $text, $callback );

		$tags = array();
		$offset = 0;
		$textTmp = $text;
		while( false !== ( $pos = strpos( $textTmp, '<!--FCK_SKIP_START-->' ) ) ){
			$tags[abs($pos + $offset)] = 1;
			$textTmp = substr( $textTmp, $pos + 21 );
			$offset += $pos + 21;
		}

		$offset = 0;
		$textTmp = $text;
		while( false !== ( $pos = strpos( $textTmp, '<!--FCK_SKIP_END-->' ) ) ){
			$tags[abs($pos + $offset)] = -1;
			$textTmp = substr( $textTmp, $pos + 19 );
			$offset += $pos + 19;
		}

		if( !empty( $tags ) ) {
			ksort( $tags );

			$strtr = array( '<!--FCK_SKIP_START-->' => '', '<!--FCK_SKIP_END-->' => '' );

			$sum = 0;
			$lastSum = 0;
			$finalString = '';
			$stringToParse = '';
			$startingPos = 0;
			$inner = '';
			$strtr_span = array();
			foreach( $tags as $pos=>$type) {
				$sum += $type;
				if( !$pos ) {
					$opened = 0;
					$closed = 0;
				} else {
					$opened = substr_count( $text, '[', 0, $pos ); // count [
					$closed = substr_count( $text, ']', 0, $pos ); // count ]
				}
				if( $sum == 1 && $lastSum == 0 ) {
					$stringToParse .= strtr( substr( $text, $startingPos, $pos - $startingPos ), $strtr );
					$startingPos = $pos;
				} else if( $sum == 0 ) {
					$stringToParse .= 'Fckmw' . $this->fck_mw_strtr_span_counter . 'fckmw';
					$inner = htmlspecialchars( strtr( substr( $text, $startingPos, $pos - $startingPos + 19 ), $strtr ) );
                    if (defined('SMW_HALO_VERSION') && substr($inner, 0, 7) == '{{#ask:' || substr($inner, 0, 10) == '{{#sparql:')
                        $fck_mw_template =  'fck_smw_query';
                    else if (defined('SMW_DI_VERSION') && substr($inner, 0, 6) == '{{#ws:' )
					    $fck_mw_template =  'fck_smw_webservice';
                    else {
                        $funcName = (($fp = strpos($inner, ':', 2)) !== false) ? substr($inner, 2, $fp - 2) : substr($inner, 2, strlen($inner) - 4);
                        if (in_array($funcName, $this->FCKeditorDateTimeVariables))
                            $fck_mw_template = 'v';
                        else if (in_array($funcName, $this->FCKeditorWikiVariables))
                            $fck_mw_template = 'w';
                        else if (in_array($funcName, $this->FCKeditorFunctionHooks))
                            $fck_mw_template = 'p';
                        else
                            $fck_mw_template = 'fck_mw_template';
                    }
                    // check if the recogized "template" is one of these special form tags of Semantic Forms
                    global $wgTitle;
                    if (defined('SF_VERSION') && 
                        $wgTitle && $wgTitle->getNamespace() == SF_NS_FORM &&
                        $fck_mw_template == 'fck_mw_template') {
                        foreach ($this->FCKeditorSFspecialTags as $sfTag) {
                            if (preg_match('/^\{'.$sfTag.'(\s|\}|\|)/', $funcName)) {
                                $fck_mw_template = 'sf';
                                $funcName = $sfTag;
                                break;
                            }
                        }
                    }

                    if (strlen($fck_mw_template) > 2) {
                        if( $opened <= $closed ) { // {{template}} is NOT in [] or [[]]
                            $this->fck_mw_strtr_span['Fckmw' . $this->fck_mw_strtr_span_counter . 'fckmw'] = '<span class="'.$fck_mw_template.'">' . str_replace( array( "\r\n", "\n", "\r" ), 'fckLR', $inner ) . '</span>';
                        } else {
                            $this->fck_mw_strtr_span['Fckmw' . $this->fck_mw_strtr_span_counter . 'fckmw'] = str_replace( array( "\r\n", "\n", "\r" ), 'fckLR', $inner );
                        }
                    } else if (strlen($fck_mw_template) > 1) { // SF tag
                        $this->fck_mw_strtr_span['Fckmw'.$this->fck_mw_strtr_span_counter.'fckmw'] = '<span class="fck_mw_special" _fck_mw_customtag="true" _fck_mw_tagname="'.$funcName.'" _fck_mw_tagtype="'.$fck_mw_template.'">'
                                . str_replace( array( "\r\n", "\n", "\r" ), 'fckLR', $inner ) . '</span>';
                    } else {
                        $this->fck_mw_strtr_span['Fckmw'.$this->fck_mw_strtr_span_counter.'fckmw'] = '<span class="fck_mw_special" _fck_mw_customtag="true" _fck_mw_tagname="'.$funcName.'" _fck_mw_tagtype="'.$fck_mw_template.'">';
                        if (strlen($inner) > strlen($funcName) + 5) {
                            $content = substr($inner, strlen($funcName) + 3, -2);
                            $this->fck_mw_strtr_span['Fckmw'.$this->fck_mw_strtr_span_counter.'fckmw'].= $content;
                        }
                        $this->fck_mw_strtr_span['Fckmw'.$this->fck_mw_strtr_span_counter.'fckmw'].= '_</span>';
                    }
                    $this->fck_mw_strtr_span['href="Fckmw' . $this->fck_mw_strtr_span_counter . 'fckmw"'] = 'href="' . $inner . '"';
					$startingPos = $pos + 19;
					$this->fck_mw_strtr_span_counter++;
				}
				$lastSum = $sum;
			}
			$stringToParse .= substr( $text, $startingPos );
			$text = &$stringToParse;
		}
        
		return $text;
	}

	function internalParse( $text, $isMain = true, $frame = false ) {
		$this->fck_internal_parse_text =& $text;
/*
		// these three tags should remain unchanged
		$text = StringUtils::delimiterReplaceCallback( '<includeonly>', '</includeonly>', array( $this, 'fck_includeonly' ), $text );
		$text = StringUtils::delimiterReplaceCallback( '<noinclude>', '</noinclude>', array( $this, 'fck_noinclude' ), $text );
		$text = StringUtils::delimiterReplaceCallback( '<onlyinclude>', '</onlyinclude>', array( $this, 'fck_onlyinclude' ), $text );
*/
		// also replace all custom tags
		foreach ($this->FCKeditorWikiTags as $tag) {
		    $tag = $this->guessCaseSensitiveTag($tag, $text);
		    $this->fck_allTagsCurrentTagReplaced = $tag;
		    $text = StringUtils::delimiterReplaceCallback( "<$tag", "</$tag>", array($this, 'fck_allTags'), $text );
		}
        // Rule tags (the tag is not registered as a official wiki tag, therefore
        // not treated by the parser before
        if ( defined('SEMANTIC_RULES_VERSION') ) {
            $text = $this->replaceRules($text);
        }
        // __TOC__ etc. must be replaced
        $text = $this->stripToc( $text );
		// HTML comments shouldn't be stripped
		$text = $this->fck_replaceHTMLcomments( $text );
		// as well as templates
		$text = $this->fck_replaceTemplates( $text );
		// as well as properties
		$text = $this->fck_replaceSpecialLinks( $text );
        
        // preserve linebreaks
        //$text = strtr($text, array("\n" => "\nFCKLR_fcklr_FCKLR", "\r" => ''));
        // this doesn't work when inside tables. So leave this for later.

        $text = $this->parseExternalLinksWithTmpl($text);

        $finalString = parent::internalParse( $text, $isMain );
		return $finalString;
	}

	function fck_includeonly( $matches ) {
		return $this->fck_wikiTag( 'includeonly', $matches[1] );
	}

	function fck_noinclude( $matches ) {
		return $this->fck_wikiTag( 'noinclude', $matches[1] );
	}

	function fck_onlyinclude( $matches ) {
		return $this->fck_wikiTag( 'onlyinclude', $matches[1] );
	}

	function fck_leaveTemplatesAlone( $matches ) {
		return '<!--FCK_SKIP_START-->' . $matches['text'] . '<!--FCK_SKIP_END-->';
	}

	function formatHeadings( $text, $origText, $isMain = true ) {
		return $text;
	}

	function parseExternalLinksWithTmpl( $text ) {
   		$callback = array(
			'[' => array(
				'end'=>']',
				'cb' => array(
					1 => array( $this, 'fck_replaceCkmarkupInLink' )
				),
				'min' => 1,
				'max' => 1,
			)
		);

		$text = $this->replace_callback( $text, $callback );
        //var_dump($text);
        return $text;
    }

    /**
     * Check external links if they use some templates or parser functions e.g.
     * [http://google.de/?search=quertz {{PAGENAME}}]
     * [{{fullurl:{{FULLPAGENAME}}|printable=yes}} Printable version]
     * Then these will not get replaced by the normal parsing process. At this
     * point these links look like:
     * [http://google.de/?search=quertz FckmwXXfckmw]
     * [FckmwXYfckmw Printable version]
     * and are not recognized by the mediawiki parser. Therefore we revert the
     * replaced elements, built the anchor element but replace is with FckmwXZfckmw
     * so that the parser wont touch it.
     */
    function fck_replaceCkmarkupInLink( $matches ) {
        $p = strpos($matches['title'], ' ');
        if ($p === false) return $matches['text'];
        $target = substr($matches['title'], 0, $p);
        $title = substr($matches['title'], $p + 1);
        if (!preg_match('/Fckmw\d+fckmw/', $title) &&
            !preg_match('/Fckmw\d+fckmw/', $target)) return $matches['text'];

        $title = $this->revertEncapsulatedString($title);
        $target = $this->revertEncapsulatedString($target);
        return $this->fck_addToStrtr('<a href="'.$target.'" _cke_saved_href="'.$target.'" _cke_mw_type="http">'.$title.'</a>');
    }

	function stripNoGallery( &$text ) {}

    function stripToc( $text ) {
        $prefix = '<span class="fck_mw_magic" _fck_mw_customtag="true" _fck_mw_tagname="%s" _fck_mw_tagtype="c">';
        $suffix = '_</span>';

		$strtr = array();
		foreach ($this->FCKeditorMagicWords as $word) {
			$strtr['__'.$word.'__'] = sprintf($prefix, $word) . $suffix;
		}
		foreach ($strtr as $key => $val) {
		    $strtr[$key] = $this->fck_addToStrtr($val, $key);
		}
		return strtr( $text, $strtr );
	}

	function doDoubleUnderscore( $text ) {
		return $text;
	}

	function parse( $text, Title $title, ParserOptions $options, $linestart = true, $clearState = true, $revid = null ) {
 CKeditorLinker::addHooks();
    try {
            $text = preg_replace("/^#REDIRECT/", '<!--FCK_REDIRECT-->', $text);
            $text = preg_replace("/\<(noinclude|includeonly|onlyinclude)\>/i", '%%%start-$1%%%', $text);
            $text = preg_replace("/\<\/(noinclude|includeonly|onlyinclude)\>/i", '%%%end-$1%%%', $text);
            $parserOutput = parent::parse($text, $title, $options, $linestart, $clearState, $revid);


            $parserOutput->setText(strtr($parserOutput->getText(), array('FCKLR_fcklr_FCKLR' => '<br fcklr="true"/>')));
            $parserOutput->setText(strtr($parserOutput->getText(), array('--~~~~' => '<span class="fck_mw_signature">_</span>')));

            if (!empty($this->fck_mw_strtr_span)) {
                    global $leaveRawTemplates;
                    if (!empty($leaveRawTemplates)) {
                            foreach ($leaveRawTemplates as $l) {
                                    $this->fck_mw_strtr_span[$l] = substr($this->fck_mw_strtr_span[$l], 30, -7);
                            }
                    }
                    $text = strtr($parserOutput->getText(), $this->fck_mw_strtr_span);
                    $parserOutput->setText(strtr($text, $this->fck_mw_strtr_span));

                    //replace fckLR strings with empty strings
                    //                        $parserOutput->setText( strtr( $parserOutput->getText(), array('fckLR' => '') ) );
            }

            // there were properties, look for the placeholder FCK_PROPERTY_X_FOUND and replace
            // it with <span class="fck_mw_property">property string without brakets</span>
            if (count($this->fck_mw_propertyAtPage) > 0) {
                    $tmpText = $parserOutput->getText();
                    foreach ($this->fck_mw_propertyAtPage as $p => $val)
                            $tmpText = str_replace('FCK_PROPERTY_' . $p . '_FOUND', $val, $tmpText);
                    $parserOutput->setText($tmpText);
            }
            // there were Richmedia links, look for the placeholder FCK_RICHMEDIA_X_FOUND and replace
            // it with <a title="My Document.doc" _fck_mw_type="Document" _fck_mw_filename="My Document.doc"
            // _fcksavedurl="Document:MyDocument.doc" href="My_Document.doc">Document:My Document.doc</a>
            if (count($this->fck_mw_richmediaLinkAtPage) > 0) {
                    $tmpText = $parserOutput->getText();
                    foreach ($this->fck_mw_richmediaLinkAtPage as $p => $val)
                            $tmpText = str_replace('FCK_RICHMEDIA_' . $p . '_FOUND', $val, $tmpText);
                    $parserOutput->setText($tmpText);
            }

            if (!empty($this->fck_matches)) {
                    $text = $parserOutput->getText();
                    foreach ($this->fck_matches as $key => $m) {
                            $text = str_replace($key, $m[3], $text);
                    }
                    $parserOutput->setText($text);
            }

            if (!empty($parserOutput->mLanguageLinks)) {
                    foreach ($parserOutput->mLanguageLinks as $l) {
                            $parserOutput->setText($parserOutput->getText() . "\n" . '<a href="' . $l . '">' . $l . '</a>');
                    }
            }

            $parserOutput->setText(str_replace('<!--FCK_REDIRECT-->', '#REDIRECT', $parserOutput->getText()));
            $parserOutput->setText(preg_replace('/%%%start\-(noinclude|includeonly|onlyinclude)%%%/i', '<span class="fck_mw_$1" _fck_mw_tagname="$1" startTag="true"></span>', $parserOutput->getText()));
            $parserOutput->setText(preg_replace('/%%%end\-(noinclude|includeonly|onlyinclude)%%%/i', 'fckLR<span class="fck_mw_$1" _fck_mw_tagname="$1" endTag="true"></span>', $parserOutput->getText()));
            CKeditorLinker::removeHooks();
            return $parserOutput;
    } catch (Exception $e) {
            CKeditorLinker::removeHooks();
            throw $e;
    }
	}

	/**
	 * Make lists from lines starting with ':', '*', '#', etc.
	 *
	 * @private
	 * @return string the lists rendered as HTML
	 */
	function doBlockLevels( $text, $linestart ) {
		wfProfileIn( __METHOD__ );

		# Parsing through the text line by line.  The main thing
		# happening here is handling of block-level elements p, pre,
		# and making lists from lines starting with * # : etc.
		$textLines = explode( "\n", $text );

		$lastPrefix = $output = '';
		$this->mDTopen = $inBlockElem = false;
		$prefixLength = 0;
		$paragraphStack = false;

		if ( !$linestart ) {
			$output .= array_shift( $textLines );
		}
		foreach ( $textLines as $oLine ) {
			$lastPrefixLength = strlen( $lastPrefix );
			$preCloseMatch = preg_match('/<\\/pre/i', $oLine );
			$preOpenMatch = preg_match('/<pre/i', $oLine );
			if ( !$this->mInPre ) {
				# Multiple prefixes may abut each other for nested lists.
				$prefixLength = strspn( $oLine, '*#:;' );
				$pref = substr( $oLine, 0, $prefixLength );

				# eh?
				$pref2 = str_replace( ';', ':', $pref );
				$t = substr( $oLine, $prefixLength );
				$this->mInPre = !empty( $preOpenMatch );
			} else {
				# Don't interpret any other prefixes in preformatted text
				$prefixLength = 0;
				$pref = $pref2 = '';
				$t = $oLine;
			}

			# List generation
			if( $prefixLength && 0 == strcmp( $lastPrefix, $pref2 ) ) {
				# Same as the last item, so no need to deal with nesting or opening stuff
				$output .= $this->nextItem( substr( $pref, -1 ) );
				$paragraphStack = false;

				if ( substr( $pref, -1 ) == ';') {
					# The one nasty exception: definition lists work like this:
					# ; title : definition text
					# So we check for : in the remainder text to split up the
					# title and definition, without b0rking links.
					$term = $t2 = '';
					if( $this->findColonNoLinks( $t, $term, $t2 ) !== false ) {
						$t = $t2;
						$output .= $term . $this->nextItem( ':' );
					}
				}
			} elseif( $prefixLength || $lastPrefixLength ) {
				# Either open or close a level...
				$commonPrefixLength = $this->getCommon( $pref, $lastPrefix );
				$paragraphStack = false;

				while( $commonPrefixLength < $lastPrefixLength ) {
					$output .= $this->closeList( $lastPrefix{$lastPrefixLength-1} );
					--$lastPrefixLength;
				}
				if ( $prefixLength <= $commonPrefixLength && $commonPrefixLength > 0 ) {
					$output .= $this->nextItem( $pref{$commonPrefixLength-1} );
				}
				while ( $prefixLength > $commonPrefixLength ) {
					$char = substr( $pref, $commonPrefixLength, 1 );
					$output .= $this->openList( $char );

					if ( ';' == $char ) {
						# FIXME: This is dupe of code above
						if( $this->findColonNoLinks( $t, $term, $t2 ) !== false ) {
							$t = $t2;
							$output .= $term . $this->nextItem( ':' );
						}
					}
					++$commonPrefixLength;
				}
				$lastPrefix = $pref2;
			}
			if( 0 == $prefixLength ) {
				wfProfileIn( __METHOD__ .  '-paragraph' );
				# No prefix (not in list)--go to paragraph mode
				// XXX: use a stack for nestable elements like span, table and div
				$openmatch = preg_match( '/(?:<table|<blockquote|<h1|<h2|<h3|<h4|<h5|<h6|<pre|<tr|<p|<ul|<ol|<li|<\\/tr|<\\/td|<\\/th)/iS', $t );
				$closematch = preg_match(
				'/(?:<\\/table|<\\/blockquote|<\\/h1|<\\/h2|<\\/h3|<\\/h4|<\\/h5|<\\/h6|'.
				'<td|<th|<\\/?div|<hr|<\\/pre|<\\/p|' . $this->mUniqPrefix . '-pre|<\\/li|<\\/ul|<\\/ol|<\\/?center)/iS', $t );
				if ( $openmatch or $closematch ) {
					$paragraphStack = false;
					# TODO bug 5718: paragraph closed
					$output .= $this->closeParagraph();
					if ( $preOpenMatch and !$preCloseMatch ) {
						$this->mInPre = true;
					}
					if ( $closematch ) {
						$inBlockElem = false;
					} else {
						$inBlockElem = true;
					}
				} else if ( !$inBlockElem && !$this->mInPre ) {
					if ( ' ' == $t{0} and ( $this->mLastSection == 'pre' or trim( $t ) != '' ) ) {
						// pre
						if( $this->mLastSection != 'pre' ) {
							$paragraphStack = false;
							$output .= $this->closeParagraph() . '<pre class="_fck_mw_lspace">';
							$this->mLastSection = 'pre';
						}
						$t = substr( $t, 1 );
					} else {
						// paragraph
						if ( '' == trim( $t ) ) {
							if ( $paragraphStack ) {
								$output .= $paragraphStack . '<br />';
								$paragraphStack = false;
								$this->mLastSection = 'p';
							} else {
								if ($this->mLastSection != 'p' ) {
									$output .= $this->closeParagraph();
									$this->mLastSection = '';
									$paragraphStack = '<p>';
								} else {
									$paragraphStack = '</p><p>';
								}
							}
						} else {
							if ( $paragraphStack ) {
								$output .= $paragraphStack;
								$paragraphStack = false;
								$this->mLastSection = 'p';
							} else if ($this->mLastSection != 'p') {
								$output .= $this->closeParagraph().'<p>';
								$this->mLastSection = 'p';
							}
						}
					}
				}
				wfProfileOut( __METHOD__ . '-paragraph' );
			}
			// somewhere above we forget to get out of pre block (bug 785)
			if( $preCloseMatch && $this->mInPre ) {
				$this->mInPre = false;
			}
			if( $paragraphStack === false ) {
				$output .= $t . "\n";
			}
		}
		while ( $prefixLength ) {
			$output .= $this->closeList( $pref2{$prefixLength-1} );
			--$prefixLength;
		}
		if ( '' != $this->mLastSection ) {
			$output .= '</' . $this->mLastSection . '>';
			$this->mLastSection = '';
		}

		wfProfileOut( __METHOD__ );
		return $output;
	}

	/**
	 * replace property links like [[someProperty::value]] with FCK_PROPERTY_X_FOUND where X is
	 * the number of the replaced property. The actual property string is stored in
	 * $this->fck_mw_propertyAtPage[X] with X being the same number as in the replaced text.
	 * This affects also links that are created with the RichMedia extension like:
	 * [[Document:My_Document.doc|Document:My Document.doc]]. These are replaced with
	 * FCK_RICHMEDIA_X_FOUND where X is the number of the replaced link. The actual link
	 * value is stored in $this->fck_mw_richmediaLinkAtPage[X].
	 *
	 * @access private
	 * @param string $wikitext
	 * @return string $wikitext
	 */
	private function fck_replaceSpecialLinks( $text ) {
		// use the call back function to let the parser do the work to find each link
		// that looks like [[something whatever is inside these brakets]]
		$callback = array('[' =>
		array(
		'end'=>']',
		'cb' => array(
		2=>array($this, 'fck_leaveTemplatesAlone'),
		3=>array('', ''),
		),
		'min' =>2,
		'max' =>2,
		)
		);
		$text = $this->replace_callback($text, $callback);

        // now each property string is prefixed with <!--FCK_SKIP_START--> and
		// tailed with <!--FCK_SKIP_END-->
		// use this knowledge to find properties within these comments
		// and replace them with FCK_PROPERTY_X_FOUND that will be used later to be replaced
		// by the current property string
		while (preg_match('/\<\!--FCK_SKIP_START--\>\[\[(.*?)\]\]\<\!--FCK_SKIP_END--\>/', $text, $matches)) {
            $replacedVal = $this->revertEncapsulatedString($matches[1]);
			$replacement = $this->replaceSpecialLinkValue($replacedVal);
			$pos = strpos($text, $matches[0]);
			$before = substr($text, 0, $pos);
			$after = substr($text, $pos + strlen($matches[0]));
			$text = $before . $replacement . $after;
		}
		return $text;
	}

    /**
     * Replace a former encoded FckmwXXfckmw with it's actual value. Things
     * are replaced sequencially and if the same part has a replacement
     * already and the outer part will replaced by itself, then the inner
     * content must be the original string, without any replacements.
     *
     * This can happen, if a property contains a param/template call like:
     * [[Property::{{{1}}}]] or if a parser function/template contains a
     * comment. Things are replaces sequencially and if the same part has
     * a replacement already but is replaced as well then we are in trouble.
     *
     * Replacements are saved in the member variable $fck_mw_strtr_span which
     * is an array with the key containing the replacement string FckmwXXfckmw
     * and the value the original text. For each replacement there are two keys:
     *   1) FckmwXXfckmw
     *   2) href="FckmwXXfckmw"
     * Presumabely these are historical reasons. We must replace the content of
     * the href key, except for html comments.
     * In the future this replacement strategy should be checked whether not to
     * use one variable for each replacement only.
     *
     * @access private
     * @param string text
     * @return string text
     */
    private function revertEncapsulatedString($text) {
        if (preg_match_all('/Fckmw\d+fckmw/', $text, $matches)) {
	        for ($i = 0, $is = count($matches[0]); $i < $is; $i++ ) {
               // comments are directly in the main key FckmwXfckmw
               if (isset($this->fck_mw_strtr_span[$matches[0][$i]]) &&
                   substr($this->fck_mw_strtr_span[$matches[0][$i]], 0, 4) == '<!--') {
                   $text = str_replace(
                           $matches[0][$i],
                           $this->fck_mw_strtr_span[$matches[0][$i]],
	                       $text);
               }
   	           else if (isset($this->fck_mw_strtr_span['href="'.$matches[0][$i].'"'])) {
	               $text = str_replace(
                           $matches[0][$i],
                           substr($this->fck_mw_strtr_span['href="'.$matches[0][$i].'"'], 6, -1),
	                       $text);
	           }
	        }
        }
        return $text;
    }

    /**
     * Checks for replacments by replacePropertyValue() and replaceRichmediaLinkValue()
     * If a property was replaced, don't try to find and replace a richmedia link
     *
     * @access private
     * @param  string match
     * @param  string orig (maybe FckmwXfckmw)
     * @return string replaced placeholder or [[match]]
     */
    private function replaceSpecialLinkValue($match) {
        if (defined('SMW_VERSION')) {
            $res = $this->replacePropertyValue($match);
            if (preg_match('/FCK_PROPERTY_\d+_FOUND/', $res)) // property was replaced, we can quit here.
                return $res;
        }
        if (defined('SMW_RM_VERSION')) {
            $res = $this->replaceRichmediaLinkValue($match);
            if (preg_match('/FCK_RICHMEDIA_\d+_FOUND/', $res)) // richmedia link was replaced, we can quit here.
                return $res;
        }
        // an ordinary link. If this is something like [[{{{1}}}]] then this would be an
        // empty link, because during parsing, the parameter will not exist. Therefore
        // do not use the original value but the template replacement
        if (preg_match_all('/\{{2,3}.*?\}{2,3}+/', $match, $matches)) {
            for ($i = 0, $is = count($matches[0]); $i < $is; $i++) {
                $key = 'Fckmw'.$this->fck_mw_strtr_span_counter.'fckmw';
                $this->fck_mw_strtr_span_counter++;
                $this->fck_mw_strtr_span[$key] = $matches[0][$i];
                $match = str_replace($matches[0][$i], $key, $match);
            }
        }
        return '[[' . $match . ']]';
    }

	/**
	 * check the parser match from inside the [[ ]] and see if it's a property.
	 * If thats the case, safe the property string in the array
	 * $this->fck_mw_propertyAtPage and return a placeholder FCK_PROPERTY_X_FOUND
	 * for the Xth occurence. Otherwise return the link content unmodified.
	 * The missing [[ ]] have to be added again, so that the original remains untouched
	 *
	 * @access private
	 * @param  string $match
	 * @return string replacement or "[[$match]]"
	 */
	private function replacePropertyValue($match) {
		$prop = explode('::', $match);
        if (count($prop) < 2) $prop = explode(':=', $match); // support old syntax [[prop:=val]]
  		if ((count($prop) == 2) && (strlen($prop[0]) > 0) && (strlen($prop[1]) > 0)) {
  			if (($p = strpos($prop[1], '|')) !== false ) {
                // Hack to prevent that something like this is misplaced: [[prop::{{{param|}}}]]
                // still this must work: [[prop::foo|{{{param|}}}]]
                $view = substr($prop[1], $p + 1);
                $val = substr($prop[1], 0, $p);
                if (! (preg_match('/\{\{[^\}].*$/', $val) && preg_match('/^[^\{].*\}\}/', $view) ) ) {
                    $prop[0] .= '::'.substr($prop[1], 0, $p);
                    $prop[1] = substr($prop[1], $p + 1);
                }
  			}
  			// replace an empty value with &nbsp; for IE8
  			if (preg_match('/^\s+$/', $prop[1])) $prop[1] = '&nbsp;';
    		$p = count($this->fck_mw_propertyAtPage);
    		$this->fck_mw_propertyAtPage[$p]= '<span class="fck_mw_property" property="'.$prop[0].'">'.$prop[1].'</span>';
    		return 'FCK_PROPERTY_'.$p.'_FOUND';
  		}
  		return "[[".$match."]]";
	}

	/**
	 * check the parser match from inside the [[ ]] and see if it's a link from
	 * the RichMedia extension.
	 * If thats the case, safe the richmedia string in the array
	 * $this->fck_mw_richmediaLinkAtPage and return a placeholder FCK_RICHMEDIA_X_FOUND
	 * for the Xth occurence. Otherwise return the link content unmodified.
	 * The missing [[ ]] have to be added again, so that the original remains untouched
	 *
	 * @access private
	 * @param  string $match
	 * @return string replacement or "[[$match]]"
	 */
	private function replaceRichmediaLinkValue($match) {
        $orig = "[[".$match."]]";
		if ($match && $match{0} == ":") $match = substr($match, 1);
		if (strpos($match, ":") === false)
			return $orig;
		$ns = substr($match, 0, strpos($match, ':'));
		if (in_array(strtolower($ns), array('pdf', 'document', 'audio', 'video'))) { //$wgExtraNamespaces doesn't help really
  			$link = explode('|', $match);
  			$basename = substr($link[0], strlen($ns) + 1);
    		$p = count($this->fck_mw_richmediaLinkAtPage);
    		$this->fck_mw_richmediaLinkAtPage[$p]= '<a title="'.str_replace('_', ' ', $basename).'" _fck_mw_type="'.$ns.'" '.
    			'_fck_mw_filename="'.$basename.'" _fcksavedurl="'.$link[0].'" href="'.$basename.'">'.
    			((count($link) > 1) ? $link[1] : str_replace('_', ' ', $link[0])).'</a>';
    		return 'FCK_RICHMEDIA_'.$p.'_FOUND';
  		}
  		return $orig;
	}

    /**
     * Replace wikitext for rules with place holder FckmwXfckmw
     *
     * @global Title $wgTitle
     * @global Request $wgRequest
     * @param  String $text
     * @return String
     */
	private function replaceRules($text) {
	    //global $wgTitle, $wgRequest;
	    // rules exist in poperty and category pages only.
	    // if it's an ajax call we don't know the page name, so do it always
        /*
	    if (($wgRequest->getVal('action') == 'ajax') ||
	        ($wgTitle && (defined('SMW_NS_PROPERTY') && $wgTitle->getNamespace() == SMW_NS_PROPERTY) ||
             $wgTitle->getNamespace() == NS_CATEGORY )) {
         */
	        if (preg_match_all('/<rule[^>]*>.*?<\/rule>/is', $text, $matches)) {
	             for ($i= 0; $i<count($matches[0]); $i++) {
	                 $this->fck_mw_strtr_span['Fckmw'.$this->fck_mw_strtr_span_counter.'fckmw']=
	                     '<span class="fck_smw_rule">'.htmlentities($matches[0][$i]).'</span>';
	                 $this->fck_mw_strtr_span['href="Fckmw'.$this->fck_mw_strtr_span_counter.'fckmw"']=
	                     'href="'.$matches[0][$i].'"';
                     $key = 'Fckmw'.$this->fck_mw_strtr_span_counter.'fckmw';
                     $this->fck_mw_strtr_span_counter++;
                     $cnt=1;
	                 $text = str_replace($matches[0][$i], $key, $text, $cnt);
	             }
	        }
        /*
	    }
         */
	    return $text;
	}
        
    /**
     * Replace wikitext for webservice definition, called as a parser hook
     *
	 * @param string $str Input
	 * @param array $argv Arguments
	 * @return string
	 */
	private function replaceWebserviceDefinition( $str, $argv, $parser ) {
        
        $ret = '<' . $this->fck_mw_taghook;
		if( empty( $argv ) ) {
			$ret .= '>';
		} else {
			foreach( $argv as $key => $value ) {
				$ret .= " " . $key . "=\"" . $value . "\"";
			}
			$ret .= '>';
		}
		if( !is_null( $str ) )
			$ret .= $str ;
        $ret .= '</' . $this->fck_mw_taghook . '>';
        $ret = '<span class="fck_smw_webservice">' .
               htmlspecialchars($ret) .
               '</span>';
		$replacement = $this->fck_addToStrtr( $ret );
		return $replacement;
	}

	/**
	 * When getting the available tags from the wiki, these are returned in
	 * lower case although some might be in camel case. Also tags are case
	 * sensitive. Therefore guess here the correct tag.
	 *
	 * @param string $tag small case
	 * @param string $text wiki text
	 * @return string $tag case sensitive tag
	 */
	private function guessCaseSensitiveTag($tag, $text) {
	    preg_match('/<('.$tag.')>/i', $text, $matchOpen);
	    preg_match('/<\/('.$tag.')>/i', $text, $matchClose);
	    if (count($matchOpen) > 0 &&
	        count($matchClose) > 0 &&
	        $matchOpen[1] == $matchClose[1])
	        return $matchOpen[1];
	    return $tag;
	}
    /*
     * Use the generic string matching function from the wiki parser and try
     * to find any tags in the wikitext e.g. <tag foo="bar">some text</tag>
     *
     * @param Array(string)
     * @return string placeholder
     */
    public function fck_allTags( $matches ) {
        // check for tag attributes
        $attr = array();
        if ($matches[1]{0} != ">") {
            $f = strpos($matches[1], '>');
            $t = explode(' ', substr($matches[1], 0, $f));
            foreach ($t as $x) {
                if (strlen($x) > 0 && ($g = strpos($x, '=')) !== false) {
                    $attr[substr($x, 0, $g)] = str_replace("'", "", str_replace('"', '', substr($x, $g+1)));
                }
            }
            $matches[1] = substr($matches[1], $f);
        }
        // check for uniqe makers that should be reverted
        if (strpos($matches[1], $this->mUniqPrefix) !== false) {
            foreach( $this->fck_matches as $key => $m ) {
				$replacement = str_replace( $key, $m[3], $matches[1] );
                if ($replacement != $matches[1]) { // we did replace something
                    $matches[1] = $replacement;
                    unset($this->fck_matches[$key]);
                }
			}
        }
        return $this->fck_wikiTag($this->fck_allTagsCurrentTagReplaced, substr($matches[1], 1), $attr);
    }

}
