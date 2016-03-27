<?php
/**
 * Options for CKeditor
 * [start with CKeditor]
 */
define('RTE_VISIBLE', 1);
/**
 * Options for CKeditor
 * [show toggle link]
 */
define('RTE_TOGGLE_LINK', 2);
/**
 * Options for CKeditor
 * [show popup link]
 */
define('RTE_POPUP', 4);


class CKeditor_MediaWiki {

	public $showFCKEditor;
    public $loadSTBonStartup;
	private $count = array();
	private $wgFCKBypassText = '';
	private $debug = 0;
	private $excludedNamespaces;
	private $oldTextBox1;
	static $nsToggles = array(
	'riched_disable_ns_main',
	'riched_disable_ns_talk',
	'riched_disable_ns_user',
	'riched_disable_ns_user_talk',
	'riched_disable_ns_project',
	'riched_disable_ns_project_talk',
	'riched_disable_ns_image',
	'riched_disable_ns_image_talk',
	'riched_disable_ns_mediawiki',
	'riched_disable_ns_mediawiki_talk',
	'riched_disable_ns_template',
	'riched_disable_ns_template_talk',
	'riched_disable_ns_help',
	'riched_disable_ns_help_talk',
	'riched_disable_ns_category',
	'riched_disable_ns_category_talk',
	);

	function __call( $m, $a ) {
		print "\n#### " . $m . "\n";
		if( !isset( $this->count[$m] ) ) {
			$this->count[$m] = 0;
		}
		$this->count[$m]++;
		return true;
	}

	/**
	 * Gets the namespaces where CKeditor should be disabled
	 * First check is done against user preferences, second is done against the global variable $wgFCKEditorExcludedNamespaces
	 */
	private function getExcludedNamespaces() {
		global $wgUser, $wgDefaultUserOptions, $wgFCKEditorExcludedNamespaces;

		if( is_null( $this->excludedNamespaces ) ) {
			$this->excludedNamespaces = array();
			foreach( self::$nsToggles as $toggle ) {
				$default = isset( $wgDefaultUserOptions[$toggle] ) ? $wgDefaultUserOptions[$toggle] : '';
				if( $wgUser->getOption( $toggle, $default ) ) {
					$this->excludedNamespaces[] = constant( strtoupper( str_replace( 'riched_disable_', '', $toggle ) ) );
				}
			}
			/*
			If this site's LocalSettings.php defines Namespaces that shouldn't use the CKEditor (in the #wgFCKexcludedNamespaces array), those excluded
			namespaces should be combined with those excluded in the user's preferences.
			*/
			if( !empty( $wgFCKEditorExcludedNamespaces ) && is_array( $wgFCKEditorExcludedNamespaces ) ) {
				$this->excludedNamespaces = array_merge( $wgFCKEditorExcludedNamespaces, $this->excludedNamespaces );
			}
		}

		return $this->excludedNamespaces;
	}

	public static function onLanguageGetMagic( &$magicWords, $langCode ) {
		$magicWords['NORICHEDITOR'] = array( 0, '__NORICHEDITOR__' );

		return true;
	}

	public static function onParserBeforeInternalParse( &$parser, &$text, &$strip_state ) {
		MagicWord::get( 'NORICHEDITOR' )->matchAndRemove( $text );

		return true;
	}

	public function onEditPageShowEditFormFields( $pageEditor, $wgOut ) {
		global $wgUser, $wgFCKEditorIsCompatible, $wgTitle;
		
		/*
		If CKeditor extension is enabled, BUT it shouldn't appear (because it's disabled by user, we have incompatible browser etc.)
		We must do this trick to show the original text as WikiText instead of HTML when conflict occurs
		*/
		if ( ( !$wgUser->getOption( 'showtoolbar' ) || $wgUser->getOption( 'riched_disable' ) || !$wgFCKEditorIsCompatible ) ||
				in_array( $wgTitle->getNamespace(), $this->getExcludedNamespaces() ) || !( $this->showFCKEditor & RTE_VISIBLE ) ||
				false !== strpos( $pageEditor->textbox1, '__NORICHEDITOR__' )
			) {
			if( $pageEditor->isConflict ) {
				$pageEditor->textbox1 = $pageEditor->getWikiContent();
			}
		}

		return true;
	}

	/**
	 * @param $pageEditor EditPage instance
	 * @param $out OutputPage instance
	 * @return true
	 */
	public static function onEditPageBeforeConflictDiff( $pageEditor, $out ) {
		global $wgRequest;

		/*
		Show WikiText instead of HTML when there is a conflict
		http://dev.fckeditor.net/ticket/1385
		*/
		$pageEditor->textbox2 = $wgRequest->getVal( 'wpTextbox1' );
		$pageEditor->textbox1 = $pageEditor->getWikiContent();

		return true;
	}

	#public static function onParserBeforeStrip( &$parser, &$text, &$stripState ) {
	#	$text = $parser->strip( $text, $stripState );
	#	return true;
	#}
	
	public static function onParserBeforeStrip( &$parser, &$text, &$stripState ) {
		#$text = $parser->strip( $text, $stripState );
		if (get_class($parser) == 'CKeditorParser') {
			$text = $parser->strip( $text, $stripState );
		}
		return true;
	}

	public static function onSanitizerAfterFixTagAttributes( $text, $element, &$attribs ) {
		$text = preg_match_all( "/Fckmw\d+fckmw/", $text, $matches );

		if( !empty( $matches[0][0] ) ) {
			global $leaveRawTemplates;
			if( !isset( $leaveRawTemplates ) ) {
				$leaveRawTemplates = array();
			}
			$leaveRawTemplates = array_merge( $leaveRawTemplates, $matches[0] );
			$attribs = array_merge( $attribs, $matches[0] );
		}

		return true;
	}

    // we need to move our hook onBeforePageDisplay at the end of the list so that
    // style sheets are already inserted into the out object.
    public static function onOutputPageParserOutput( &$out, $parseroutput ) {
        global $wgHooks;
        $noHooks = count($wgHooks['BeforePageDisplay']);
        if ($wgHooks['BeforePageDisplay'][$noHooks - 1] != 'CKeditor_MediaWiki::onBeforePageDisplay') {
            $BeforePageDisplay = array();
            for ( $i = 0; $i < $noHooks; $i++ ) {
                if ($wgHooks['BeforePageDisplay'][$i] == 'CKeditor_MediaWiki::onBeforePageDisplay')
                    continue;
                $BeforePageDisplay[] = $wgHooks['BeforePageDisplay'][$i];
            }
            $wgHooks['BeforePageDisplay'] = $BeforePageDisplay;
            $wgHooks['BeforePageDisplay'][] = 'CKeditor_MediaWiki::onBeforePageDisplay';
            return true;
        }
        return true;
    }

    // take content of css files and put this as inline text into the page, instead
    // of using the link elements to fetch css files separate from the server.
    // The latter causes IE to hang when more than 31 style sheets are processed this way.
    public static function onBeforePageDisplay( &$out, &$text ) {
        global $wgRequest, $wgScriptPath;
		
		//04.11.14 RL: This will be the last place to define compatibility mode of browser.
		//             Following definition will make it to be the first of all meta's and will 
		//             produce string: <META content="IE=9.0000" http-equiv="X-UA-Compatible">
		$wgRequest->response()->header("X-UA-Compatible: IE=9"); //forces IE to render in IE9 compatible mode
		
        //var_dump($out->styles);
        $action = $wgRequest->getText( 'action' );
        if (! in_array($action, array('edit', 'submit'))) return $out;
        $inlineStyles = array();

        if(!empty($out->styles) and is_array($out->styles)) { //01.09.15 RL (by fullduplex1)
            foreach ( $out->styles as $key => $val ) {
                if (count($out->styles[$key]) > 0) {
                    if (isset($out->styles[$key]['condition']) ||
                        isset($out->styles[$key]['dir']) ||
                        strpos($key, '?') !== false ||
                        strpos($key, 'jquery.fancybox') !== false) continue;
                    $count = 1;
                    $cssFile = dirname(__FILE__) . '/../../' . str_replace($wgScriptPath, '', $key, $count);
                    $cssFile = str_replace('//', '/', $cssFile);
                    if (isset($out->styles[$key]['media']) &&
                        file_exists($cssFile)) {
                        $cssCont = file_get_contents($cssFile);
                        if ($cssCont !== false) {
                            if (! isset($inlineStyles[$out->styles[$key]['media']]))
                                $inlineStyles[$out->styles[$key]['media']] = '';
                            $inlineStyles[$out->styles[$key]['media']] .= $cssCont."\n";
                            unset($out->styles[$key]);
                        }
                    }
                }
            }
		}

        foreach($inlineStyles as $media => $css ) {
            $out->addInlineStyle( $css );
        }

        //17.02.14 RL: This will be the last place to define compatibility mode of browser.
		//             Active definition is not anymore in includes/OutputPage.php. 
        //             Disadvantage is that definition placed here will be the last of all meta's.
		//             This will produce string: <meta http-equiv="X-UA-Compatible" content="IE=9" />
        //$out->addMeta( 'http:X-UA-Compatible', 'IE=9' ); //04.11.14 RL

        return $out;
    }

	public function onCustomEditor( $article, $user ) {
#-               global $wgRequest, $mediaWiki;
              global $wgRequest, $wgUseExternalEditor;
 
#-               $action = $mediaWiki->getVal( 'Action' );
               $action = $wgRequest->getVal( 'action', 'view' );
 
                $internal = $wgRequest->getVal( 'internaledit' );
                $external = $wgRequest->getVal( 'externaledit' );
                $section = $wgRequest->getVal( 'section' );
                $oldid = $wgRequest->getVal( 'oldid' );
#-               if( !$mediaWiki->getVal( 'UseExternalEditor' ) || $action == 'submit' || $internal ||
              if( !$wgUseExternalEditor || $action == 'submit' || $internal ||
                $section || $oldid || ( !$user->getOption( 'externaleditor' ) && !$external ) ) {
                        $editor = new CKeditorEditPage( $article );
#-                       $editor->submit();
#-               } elseif( $mediaWiki->getVal( 'UseExternalEditor' ) && ( $external || $user->getOption( 'externaleditor' ) ) ) {
#-                       $mode = $wgRequest->getVal( 'mode' );
#-                       $extedit = new ExternalEdit( $article, $mode );
#-                       $extedit->edit();
                       $editor->edit();
                       return false;
              } else {
                       return true;
                }
#-
#-               return false;
        }

    public static function onDoEditSectionLink ($skin, $title, $section, $tooltip, $result, $lang = false ) {
        global $wgCKEditorUrlparamMode;
        if (isset($wgCKEditorUrlparamMode) && $wgCKEditorUrlparamMode === true) {
            $result = str_replace( '&amp;action=edit', '&amp;action=edit&amp;mode=wysiwyg', $result);
        }
        return true;
    }
    
	public function onEditPageBeforePreviewText( &$editPage, $previewOnOpen ) {
		global $wgUser, $wgRequest;

		if( $wgUser->getOption( 'showtoolbar' ) && !$wgUser->getOption( 'riched_disable' ) && !$previewOnOpen ) {
			$this->oldTextBox1 = $editPage->textbox1;
			$editPage->importFormData( $wgRequest );
		}

		return true;
	}

	public function onEditPagePreviewTextEnd( &$editPage, $previewOnOpen ) {
		global $wgUser;

		if( $wgUser->getOption( 'showtoolbar' ) && !$wgUser->getOption( 'riched_disable' ) && !$previewOnOpen ) {
			$editPage->textbox1 = $this->oldTextBox1;
		}

		return true;
	}

	public function onParserAfterTidy( &$parser, &$text ) {
		global $wgUseTeX, $wgUser, $wgTitle, $wgFCKEditorIsCompatible;

        MagicWord::get( 'NORICHEDITOR' )->matchAndRemove( $text );
        
		# Don't initialize for users that have chosen to disable the toolbar, rich editor or that do not have a CKeditor-compatible browser
		if( !$wgUser->getOption( 'showtoolbar' ) || $wgUser->getOption( 'riched_disable' ) || !$wgFCKEditorIsCompatible ) {
			return true;
		}

		# Are we editing a page that's in an excluded namespace? If so, bail out.
		if( is_object( $wgTitle ) && in_array( $wgTitle->getNamespace(), $this->getExcludedNamespaces() ) ) {
			return true;
		}

		if( $wgUseTeX ) {
			// it may add much overload on page with huge amount of math content...
			$text = preg_replace( '/<img class="tex" alt="([^"]*)"/m', '<img _fckfakelement="true" _fck_mw_math="$1"', $text );
			$text = preg_replace( "/<img class='tex' src=\"([^\"]*)\" alt=\"([^\"]*)\"/m", '<img src="$1" _fckfakelement="true" _fck_mw_math="$2"', $text );
		}

		return true;
	}

	/**
	 * Adds some new JS global variables
	 * @param $vars Array: array of JS global variables
	 * @return true
	 */
	public static function onMakeGlobalVariablesScript( &$vars, $out ){  //03.02.14 RL Added &  //22.03.16 RL Added $out
		global $wgFCKEditorDir, $wgFCKEditorExtDir, $wgFCKEditorToolbarSet, $wgFCKEditorHeight,
               $wgAllowExternalImages, $wgAllowExternalImagesFrom, $wgCKEditorHideDisabledTbutton;

		$vars['wgFCKEditorDir'] = $wgFCKEditorDir;
		$vars['wgFCKEditorExtDir'] = $wgFCKEditorExtDir;
		$vars['wgFCKEditorToolbarSet'] = $wgFCKEditorToolbarSet;
		$vars['wgFCKEditorHeight'] = $wgFCKEditorHeight;
        $ckParser = new CKeditorParser();
        $vars['wgCKeditorMagicWords'] = array(
            'wikitags' => $ckParser->getSpecialTags(),
			'imagewikitags' => $ckParser->getImageWikiTags(),   //19.11.14 RL
            'magicwords' => $ckParser->getMagicWords(),
            'datevars' => $ckParser->getDateTimeVariables(),
            'wikivars' => $ckParser->getWikiVariables(),
            'parserhooks' => $ckParser->getFunctionHooks()
        );
        if (defined('SF_VERSION'))
           $vars['wgCKeditorMagicWords']['sftags'] = $ckParser->getSfSpecialTags();
        $instExt = array();
        if (defined('SMW_DI_VERSION'))
            $instExt[] = 'SMW_DI_VERSION';
        if (defined('SMW_HALO_VERSION'))
            $instExt[] = 'SMW_HALO_VERSION';
        if (defined('SMW_RM_VERSION'))
            $instExt[] = 'SMW_RM_VERSION';
        if (defined('SEMANTIC_RULES_VERSION'))
            $instExt[] = 'SEMANTIC_RULES_VERSION';
        $vars['wgCKeditorUseBuildin4Extensions'] = $instExt;
        // check if external images are allowed
        if ($wgAllowExternalImages)
            $vars['wgAllowExternalImages'] = true;
        else if ($wgAllowExternalImagesFrom)
            $vars['wgAllowExternalImagesFrom'] = $wgAllowExternalImagesFrom;
        if ($wgCKEditorHideDisabledTbutton)
            $vars['wgCKEditorHideDisabledTbutton'] = true;
		
		return true;
	}

	/**
	 * Adds new toggles into Special:Preferences
	 * @param $user User object
	 * @param $preferences Preferences object
	 * @return true
	 */
	public static function onGetPreferences( $user, &$preferences ){
		global $wgDefaultUserOptions;
		/*13.11.13 RL: wfLoadExtensionMessages( 'CKeditor' );
		*/

		$preferences['riched_disable'] = array(
			'type' => 'toggle',
			'section' => 'editing/fckeditor',
			'label-message' => 'tog-riched_disable',
		);

		$preferences['riched_start_disabled'] = array(
			'type' => 'toggle',
			'section' => 'editing/fckeditor',
			'label-message' => 'tog-riched_start_disabled',
		);

		$preferences['riched_use_popup'] = array(
			'type' => 'toggle',
			'section' => 'editing/fckeditor',
			'label-message' => 'tog-riched_use_popup',
		);

		$preferences['riched_use_toggle'] = array(
			'type' => 'toggle',
			'section' => 'editing/fckeditor',
			'label-message' => 'tog-riched_use_toggle',
		);

		$preferences['riched_toggle_remember_state'] = array(
			'type' => 'toggle',
			'section' => 'editing/fckeditor',
			'label-message' => 'tog-riched_toggle_remember_state',
		);

		$preferences['riched_link_paste_text'] = array(      //08.09.14 RL
			'type' => 'toggle',
			'section' => 'editing/fckeditor',
			'label-message' => 'tog-riched_link_paste_text',
		);        
        
        if (defined('SMW_HALO_VERSION')) {
            $preferences['riched_load_semantic_toolbar'] = array(
                'type' => 'toggle',
    			'section' => 'editing/fckeditor',
        		'label-message' => 'load-stb-on-startup',
            );
        }

		// Show default options in Special:Preferences
		if( !array_key_exists( 'riched_disable', $user->mOptions ) && !empty( $wgDefaultUserOptions['riched_disable'] ) )
			$user->setOption( 'riched_disable', $wgDefaultUserOptions['riched_disable'] );
		if( !array_key_exists( 'riched_start_disabled', $user->mOptions ) && !empty( $wgDefaultUserOptions['riched_start_disabled'] ) )
			$user->setOption( 'riched_start_disabled', $wgDefaultUserOptions['riched_start_disabled'] );
		if( !array_key_exists( 'riched_use_popup', $user->mOptions ) && !empty( $wgDefaultUserOptions['riched_use_popup'] ) )
			$user->setOption( 'riched_use_popup', $wgDefaultUserOptions['riched_use_popup'] );
		if( !array_key_exists( 'riched_use_toggle', $user->mOptions ) && !empty( $wgDefaultUserOptions['riched_use_toggle'] ) )
			$user->setOption( 'riched_use_toggle', $wgDefaultUserOptions['riched_use_toggle'] );
		if( !array_key_exists( 'riched_toggle_remember_state', $user->mOptions ) && !empty( $wgDefaultUserOptions['riched_toggle_remember_state'] ) )
			$user->setOption( 'riched_toggle_remember_state', $wgDefaultUserOptions['riched_toggle_remember_state'] );
		if( !array_key_exists( 'riched_link_paste_text', $user->mOptions ) && !empty( $wgDefaultUserOptions['riched_link_paste_text'] ) ) //08.09.14 RL
			$user->setOption( 'riched_link_paste_text', $wgDefaultUserOptions['riched_link_paste_text'] );                                //08.09.14 RL 
            
		// Add the "disable rich editor on namespace X" toggles too
		foreach( self::$nsToggles as $newToggle ){
			$preferences[$newToggle] = array(
				'type' => 'toggle',
				'section' => 'editing/fckeditor',
				'label-message' => 'tog-' . $newToggle
			);
		}

		return true;
	}

	/**
     * EditPageBeforeEditButtons
     * $editpage: the current EditPage object
     * $buttons:  the edit buttons found below the editing box ("Save", "Preview", "Live", and "Diff")
     * $tabindex: HTML tabindex of the last edit check/button
    **/
    public static function onEditPageBeforeEditButtons( &$editpage, &$buttons, &$tabindex ) { //13.04.14 RL
   
        $buttons['save'] = str_replace(
            '/>', 'onclick="EnabledUseEditWarning=false" />', $buttons['save']    //Disable onbeforeunload event
        );

        $buttons['preview'] = str_replace(
            '/>', 'onclick="EnabledUseEditWarning=false" />', $buttons['preview'] //Disable onbeforeunload event
        );

        $buttons['diff'] = str_replace(
            '/>', 'onclick="EnabledUseEditWarning=false" />', $buttons['diff']    //Disable onbeforeunload event
        );
        
        
        // Continue
        return true;
    }  
  
	/**
	 * Add FCK script
	 *
	 * @param $form EditPage object
	 * @return true
	 */
	public function onEditPageShowEditFormInitial( $form, $output ) { //22.03.16 RL Added $output
		global $wgOut, $wgTitle, $wgScriptPath, $wgContLang, $wgUser;
		global $wgStylePath, $wgStyleVersion, $wgDefaultSkin, $wgExtensionFunctions, $wgHooks, $wgDefaultUserOptions;
		global $wgFCKWikiTextBeforeParse, $wgFCKEditorIsCompatible;
		global $wgFCKEditorExtDir, $wgFCKEditorDir, $wgFCKEditorHeight, $wgFCKEditorToolbarSet;
        global $wgCKEditorUrlparamMode, $wgRequest;
		global $wgFCKEditorSpecialElementWithTextTags; //Syntaxhighlight-Nowiki-Pre
		global $wgCKEditor_BASEPATH;                   //24.03.16 RL Installation directory of CKeditor (resourceloader requires this)

		if( !isset( $this->showFCKEditor ) ){
			$this->showFCKEditor = 0;
			if ( !$wgUser->getOption( 'riched_start_disabled', $wgDefaultUserOptions['riched_start_disabled'] ) ) {
				$this->showFCKEditor += RTE_VISIBLE;
			}
			if ( $wgUser->getOption( 'riched_use_popup', $wgDefaultUserOptions['riched_use_popup'] ) ) {
				$this->showFCKEditor += RTE_POPUP;
			}
			if ( $wgUser->getOption( 'riched_use_toggle', $wgDefaultUserOptions['riched_use_toggle'] ) ) {
				$this->showFCKEditor += RTE_TOGGLE_LINK;
			}
		}
	
        if (!isset( $this->loadSTBonStartup ) ) {
            $this->loadSTBonStartup = 0;
			if (defined('SMW_HALO_VERSION'))
            if ( $wgUser->getOption( 'riched_load_semantic_toolbar', $wgDefaultUserOptions['riched_load_semantic_toolbar'] ) ) {
				$this->loadSTBonStartup = 1;
			}
        }
	
		if( ( !empty( $_SESSION['showMyFCKeditor'] ) ) && ( $wgUser->getOption( 'riched_toggle_remember_state', $wgDefaultUserOptions['riched_toggle_remember_state'] ) ) ){
            $rteSettingsFromSession=true;
			// Clear RTE_VISIBLE flag
			$this->showFCKEditor &= ~RTE_VISIBLE;
			// Get flag from session
			$this->showFCKEditor |= $_SESSION['showMyFCKeditor'];
		}
	
		# Don't initialize if we have disabled the toolbar or FCkeditor or have a non-compatible browser
		if( !$wgUser->getOption( 'showtoolbar' ) ||
		$wgUser->getOption( 'riched_disable', !empty( $wgDefaultUserOptions['riched_disable'] ) ? $wgDefaultUserOptions['riched_disable'] : false )
		|| !$wgFCKEditorIsCompatible ) {
			return true;
		}

		# Don't do anything if we're in an excluded namespace
		if( in_array( $wgTitle->getNamespace(), $this->getExcludedNamespaces() ) ) {
			return true;
		}

		# Make sure that there's no __NORICHEDITOR__ in the text either
		if( false !== strpos( $form->textbox1, '__NORICHEDITOR__' ) ) {
			return true;
		}

        # If $wgCKEditorUrlparamMode is set to true check the url params
        if ( $wgCKEditorUrlparamMode && !( $wgRequest->getVal('mode') && $wgRequest->getVal('mode') == 'wysiwyg' ) ) {
            return true;
        }
        # If mode=wysiwyg is set then start with the WYSIWYG editor
        if ( $wgRequest->getVal('mode') && $wgRequest->getVal('mode') == 'wysiwyg' && !isset($rteSettingsFromSession)) {
            $this->showFCKEditor |= RTE_VISIBLE;
        }

		$wgFCKWikiTextBeforeParse = $form->textbox1;
		if( $this->showFCKEditor & RTE_VISIBLE ){
			$options = new CKeditorParserOptions();
			$options->setTidy( true );
			$parser = new CKeditorParser();
			$parser->setOutputType( OT_HTML );
			$form->textbox1 = str_replace( '<!-- Tidy found serious XHTML errors -->', '', $parser->parse( $form->textbox1, $wgTitle, $options )->getText() );
		}
		
		$printsheet = htmlspecialchars( "$wgStylePath/common/wikiprintable.css?$wgStyleVersion" );

		// CSS trick,  we need to get user CSS stylesheets somehow... it must be done in a different way!
		$skin = $wgUser->getSkin();
		$skin->loggedin = $wgUser->isLoggedIn();
		$skin->mTitle =& $wgTitle;
		$skin->initPage( $wgOut );
		$skin->userpage = $wgUser->getUserPage()->getPrefixedText();
		
		#$skin->setupUserCss( $wgOut );
		$skin->setupSkinUserCss( $wgOut );

		if( !empty( $skin->usercss ) && preg_match_all( '/@import "([^"]+)";/', $skin->usercss, $matches ) ) {
			$userStyles = $matches[1];
		}
		// End of CSS trick
	
		// 27.03.16 RL->: Earlier code before usage of resourceloader:
		//	$script = <<<HEREDOC
		//	<script type="text/javascript" src="$wgScriptPath/${wgFCKEditorDir}ckeditor.js"></script>
		//		<!--<script type="text/javascript" src="$wgScriptPath/${wgFCKEditorDir}ckeditor_source.js"></script>-->
		//	<script type="text/javascript">var sEditorAreaCSS = '$printsheet,/mediawiki/skins/monobook/main.css?{$wgStyleVersion}'; </script>
		//		<!--[if lt IE 5.5000]><script type="text/javascript">sEditorAreaCSS += ',/mediawiki/skins/monobook/IE50Fixes.css?{$wgStyleVersion}'; </script><![endif]-->
		//		<!--[if IE 5.5000]><script type="text/javascript">sEditorAreaCSS += ',/mediawiki/skins/monobook/IE55Fixes.css?{$wgStyleVersion}'; </script><![endif]-->
		//		<!--[if IE 6]><script type="text/javascript">sEditorAreaCSS += ',/mediawiki/skins/monobook/IE60Fixes.css?{$wgStyleVersion}'; </script><![endif]-->
		//		<!--[if IE 7]><script type="text/javascript">sEditorAreaCSS += ',/mediawiki/skins/monobook/IE70Fixes.css?{$wgStyleVersion}'; </script><![endif]-->
		//		<!--[if lt IE 7]><script type="text/javascript">sEditorAreaCSS += ',/mediawiki/skins/monobook/IEFixes.css?{$wgStyleVersion}'; </script><![endif]-->
		//	HEREDOC;

		//Should styles also somehow be moved into module definitions of resourceloader...
		$script = '<script type="text/javascript">var sEditorAreaCSS = \'' . $printsheet . ',/mediawiki/skins/monobook/main.css?'. $wgStyleVersion . '\';'; //27.03.16 RL<-
		if( !empty( $userStyles ) ) {
			$script .= 'sEditorAreaCSS += ",' . implode( ',', $userStyles ) . '";';
		}
		$script .= '</script>'; //27.03.16 RL

		# Show references only if Cite extension has been installed
		$showRef = false;
		if (( isset( $wgHooks['ParserFirstCallInit'] ) && in_array( 'wfCite', $wgHooks['ParserFirstCallInit'] ) ) ||
			( isset( $wgExtensionFunctions ) && in_array( 'wfCite', $wgExtensionFunctions ) ) ) {
			$showRef = true;
		}

		$showSource = false;
		if (( isset( $wgHooks['ParserFirstCallInit']) && in_array( 'efSyntaxHighlight_GeSHiSetup', $wgHooks['ParserFirstCallInit'] ) ) ||
			( isset( $wgExtensionFunctions ) && in_array( 'efSyntaxHighlight_GeSHiSetup', $wgExtensionFunctions ) ) ) {
			$showSource = true;
		}

		/*13.11.13 RL**
		wfLoadExtensionMessages( 'CKeditor' );
		***/

		$wgOut->addJsConfigVars ( array(  //22.03.16 RL
				'showFCKEditor'         => $this->showFCKEditor,
				'loadSTBonStartup'      => $this->loadSTBonStartup,
				'popup'                 => false,                          // pointer to popup document
				'firstLoad'             => true,
				'isConflict'            => ( $form->isConflict ?  1 : 0 ), //21.02.14 RL
				'editorMsgOn'           => '[' . Xml::escapeJsString( wfMsgHtml( 'textrichditor' ) )      . ']', //17.01.14 RL Added []
				'editorMsgOff'          => '[' . Xml::escapeJsString( wfMsgHtml( 'tog-riched_disable' ) ) . ']', //17.01.14 RL Added []
				'editorWaitPageLoad'    => Xml::escapeJsString( wfMsgHtml( 'tog-riched_wait_page_load' ) ),      //12.01.15 RL
				'editorLink'            => '[' . ( ( $this->showFCKEditor & RTE_VISIBLE ) ? Xml::escapeJsString( wfMsgHtml( 'tog-riched_disable' ) ) : Xml::escapeJsString( wfMsgHtml( 'textrichditor' ) ) ) . ']',  //17.01.14 RL Added []
				'saveSetting'           => ( $wgUser->getOption( 'riched_toggle_remember_state', $wgDefaultUserOptions['riched_toggle_remember_state']  ) ?  1 : 0 ),
				'useEditwarning'        => ( $wgUser->getOption( 'useeditwarning' ) ?  1 : 0 ),  //13.04.14 RL
				'EnabledUseEditWarning' => false,                                                //13.04.14 RL Because IE fires onbeforeunload with ToggleCKEditor  
				'RTE_VISIBLE'           => RTE_VISIBLE,
				'RTE_TOGGLE_LINK'       => RTE_TOGGLE_LINK,
				'RTE_POPUP'             => RTE_POPUP,
				'wgCKeditorInstance'    => null,
				'wgCKeditorCurrentMode' => "wysiwyg",
				'editorSrcToWswTrigger' => false,      //03.03.15 RL Allow wikitext->html conversion
				'editorForceReadOnly'   => false,      //12.01.15 RL To disable source button and toggle link for prolonged time.
				'fck_mv_plg_strtr_span' => [],         //16.01.15 RL
				'fck_mv_plg_strtr_span_counter'  => 0, //16.01.15 RL
				'is_special_elem_with_text_tags' => ( isset($wgFCKEditorSpecialElementWithTextTags) && $wgFCKEditorSpecialElementWithTextTags == 1 ? 1 : 0 ), //Syntaxhighlight-Nowiki-Pre
				'smwghQiLoadUrl'        => '"'. CKeditor_MediaWiki::GetQILoadUrl() .'"',
				'linkPasteText'         => ( $wgUser->getOption( 'riched_link_paste_text', $wgDefaultUserOptions['riched_link_paste_text']  ) ?  1 : 0 ), //08.09.14 RL
				'WYSIWYGversion'        => '"' . WYSIWYG_EDITOR_VERSION . '"',  //19.10.15 RL
				'CKheight'              => ( empty($wgFCKEditorHeight) ) ? 0 : $wgFCKEditorHeight,       //22.03.16 RL
				'MWnewWinMsg'           => Xml::escapeJsString( wfMsgHtml( 'rich_editor_new_window' ) ), //22.03.16 RL =>$newWinMsg
				'MWtextfield'           => 'wpTextbox1',    //22.03.16 RL =>$textfield  
				'CKEDITOR_ready'        => true,            //22.03.16 RL Instead of CKEDITOR.ready
				'CKEDITOR_BASEPATH'     => ( isset($wgCKEditor_BASEPATH) ) ? $wgCKEditor_BASEPATH : 'extensions/WYSIWYG/ckeditor/', //24.03.16 RL Define base path of CKeditor (resourceloader requires this)
				'RTE_VISIBLE'           => RTE_VISIBLE,     //27.03.16 RL
				'RTE_TOGGLE_LINK'       => RTE_TOGGLE_LINK, //27.03.16 RL
				)
			);

		$wgOut->addScript( $script );             
		//22.03.16 RL  All javascripts which earlier were here have been moved into files ext.wysiwyg.func.js and ext.wysiwyg.init.js.
		//             Resourceloader will register and load them.
		//             Activate registered init module of WYSIWYG here, rest of the modules will be activated on client side when document is ready
		$wgOut->addModules( 'ext.WYSIWYG.init' ); 
		return true;
	}

    private static function GetQILoadUrl() {
        global $smwgQueryInterfaceSecret, $smwgHaloIP;
        $qiUrl = '?action=ajax&rs=smwf_qi_getPage&rsargs[]=CKE';
        if (isset($smwgQueryInterfaceSecret)) {
            require_once $smwgHaloIP.'/specials/SMWQueryInterface/SMW_QIAjaxAccess.php';
            list($token, $hash) = qiCreateHash();
            return $qiUrl.'&s='.$token.'&t='. $hash;
        }
        return $qiUrl;
    }

}
