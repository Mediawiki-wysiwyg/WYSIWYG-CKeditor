<?php
/**
 * Helper functions for the Semantic Forms extension.
 *
 * @author Yaron Koren
 * @file
 * @ingroup SF
 */

class SFUtils {

	/**
	 * Creates a link to a special page, using that page's top-level description as the link text.
	 */
	public static function linkForSpecialPage( $specialPageName ) {
		$specialPage = SpecialPageFactory::getPage( $specialPageName );
		return Linker::link( $specialPage->getTitle(), $specialPage->getDescription() );
	}

	/**
	 * Creates the name of the page that appears in the URL;
	 * this method is necessary because Title::getPartialURL(), for
	 * some reason, doesn't include the namespace
	 */
	public static function titleURLString( $title ) {
		$namespace = wfUrlencode( $title->getNsText() );
		if ( $namespace !== '' ) {
			$namespace .= ':';
		}
		if ( MWNamespace::isCapitalized( $title->getNamespace() ) ) {
			global $wgContLang;
			return $namespace . $wgContLang->ucfirst( $title->getPartialURL() );
		} else {
			return $namespace . $title->getPartialURL();
		}
	}

	/**
	 * A very similar function to titleURLString(), to get the
	 * non-URL-encoded title string
	 */
	public static function titleString( $title ) {
		$namespace = $title->getNsText();
		if ( $namespace !== '' ) {
			$namespace .= ':';
		}
		if ( MWNamespace::isCapitalized( $title->getNamespace() ) ) {
			global $wgContLang;
			return $namespace . $wgContLang->ucfirst( $title->getText() );
		} else {
			return $namespace . $title->getText();
		}
	}

	/**
	 * Gets the text contents of a page with the passed-in Title object.
	 */
	public static function getPageText( $title ) {
		if ( method_exists( 'WikiPage', 'getContent' ) ) {
			// MW 1.21+
			$wikiPage = new WikiPage( $title );
			$content = $wikiPage->getContent();

			if ( $content !== null ) {
				return $content->getNativeData();
			} else {
				return null;
			}
		} else {
			// MW <= 1.20
			$article = new Article( $title );
			return $article->getContent();
		}
	}

	/**
	 * Helper function to get the SMW data store for different versions
	 * of SMW.
	 */
	public static function getSMWStore() {
		if ( class_exists( '\SMW\StoreFactory' ) ) {
			// SMW 1.9+
			return \SMW\StoreFactory::getStore();
		} else {
			return smwfGetStore();
		}
	}

	/**
	 * Helper function to handle getPropertyValues().
	 */
	public static function getSMWPropertyValues( $store, $subject, $propID, $requestOptions = null ) {
		if ( is_null( $subject ) ) {
			$page = null;
		} else {
			$page = SMWDIWikiPage::newFromTitle( $subject );
		}
		$property = SMWDIProperty::newFromUserLabel( $propID );
		$res = $store->getPropertyValues( $page, $property, $requestOptions );
		$values = array();
		foreach ( $res as $value ) {
			if ( $value instanceof SMWDIUri ) {
				$values[] = $value->getURI();
			} else {
				// getSortKey() seems to return the
				// correct value for all the other
				// data types.
				$values[] = str_replace( '_', ' ', $value->getSortKey() );
			}
		}
		return $values;
	}
	/**
	 * Helper function - gets names of categories for a page;
	 * based on Title::getParentCategories(), but simpler
	 * - this function doubles as a function to get all categories on
	 * the site, if no article is specified
	 */
	public static function getCategoriesForPage( $title = null ) {
		$categories = array();
		$db = wfGetDB( DB_SLAVE );
		$conditions = null;
		if ( !is_null( $title ) ) {
			$titlekey = $title->getArticleID();
			if ( $titlekey == 0 ) {
				// Something's wrong - exit
				return $categories;
			}
			$conditions['cl_from'] = $titlekey;
		}
		$res = $db->select(
			'categorylinks',
			'DISTINCT cl_to',
			$conditions,
			__METHOD__
		);
		if ( $db->numRows( $res ) > 0 ) {
			while ( $row = $db->fetchRow( $res ) ) {
				$categories[] = $row[0];
			}
		}
		$db->freeResult( $res );
		return $categories;
	}

	public static function registerProperty( $id, $typeid, $label ) {
		if ( class_exists( 'SMWDIProperty' ) ) {
			SMWDIProperty::registerProperty( $id, $typeid, $label, true );
		} else {
			SMWPropertyValue::registerProperty( $id, $typeid, $label, true );
		}
	}

	public static function initProperties() {
		global $sfgContLang;

		// Register all the special properties, in both the wiki's
		// language and, as a backup, in English.
		// For every special property, if it hasn't been translated
		// into the wiki's current language, use the English-language
		// value for both the main special property and the backup.
		$sf_props = $sfgContLang->getPropertyLabels();
		if ( array_key_exists( SF_SP_HAS_DEFAULT_FORM, $sf_props ) ) {
			self::registerProperty( '_SF_DF', '__spf', $sf_props[SF_SP_HAS_DEFAULT_FORM] );
		} else {
			self::registerProperty( '_SF_DF', '__spf', 'Has default form' );
		}
		if ( array_key_exists( SF_SP_HAS_ALTERNATE_FORM, $sf_props ) ) {
			self::registerProperty( '_SF_AF', '__spf', $sf_props[SF_SP_HAS_ALTERNATE_FORM] );
		} else {
			self::registerProperty( '_SF_AF', '__spf', 'Has alternate form' );
		}
		if ( array_key_exists( SF_SP_CREATES_PAGES_WITH_FORM, $sf_props ) ) {
			self::registerProperty( '_SF_CP', '__spf', $sf_props[SF_SP_CREATES_PAGES_WITH_FORM] );
		} else {
			self::registerProperty( '_SF_CP', '__spf', 'Creates pages with form' );
		}
		if ( array_key_exists( SF_SP_PAGE_HAS_DEFAULT_FORM, $sf_props ) ) {
			self::registerProperty( '_SF_PDF', '__spf', $sf_props[SF_SP_PAGE_HAS_DEFAULT_FORM] );
		} else {
			self::registerProperty( '_SF_PDF', '__spf', 'Page has default form' );
		}
		if ( array_key_exists( SF_SP_HAS_FIELD_LABEL_FORMAT, $sf_props ) ) {
			self::registerProperty( '_SF_FLF', '_str', $sf_props[SF_SP_HAS_FIELD_LABEL_FORMAT] );
		} else {
			self::registerProperty( '_SF_FLF', '_str', 'Has field label format' );
		}

		// Use hardcoded English values as a backup, in case it's a
		// non-English-language wiki.
		self::registerProperty( '_SF_DF_BACKUP', '__spf', 'Has default form' );
		self::registerProperty( '_SF_AF_BACKUP', '__spf', 'Has alternate form' );
		self::registerProperty( '_SF_CP_BACKUP', '__spf', 'Creates pages with form' );
		self::registerProperty( '_SF_PDF_BACKUP', '__spf', 'Page has default form' );
		self::registerProperty( '_SF_FLF_BACKUP', '_str', 'Has field label format' );

		return true;
	}

	/**
	 * Creates wiki-text for a link to a wiki page
	 */
	public static function linkText( $namespace, $name, $text = null ) {
		$title = Title::makeTitleSafe( $namespace, $name );
		if ( is_null( $title ) ) {
			return $name; // TODO maybe report an error here?
		}
		if ( is_null( $text ) ) {
			return '[[:' . $title->getPrefixedText() . '|' . $name . ']]';
		} else {
			return '[[:' . $title->getPrefixedText() . '|' . $text . ']]';
		}
	}

	/**
	 * Prints the mini-form contained at the bottom of various pages, that
	 * allows pages to spoof a normal edit page, that can preview, save,
	 * etc.
	 */
	public static function printRedirectForm( $title, $page_contents, $edit_summary, $is_save, $is_preview, $is_diff, $is_minor_edit, $watch_this, $start_time, $edit_time ) {
		global $wgUser, $sfgScriptPath;

		if ( $is_save ) {
			$action = "wpSave";
		} elseif ( $is_preview ) {
			$action = "wpPreview";
		} else { // $is_diff
			$action = "wpDiff";
		}

		$text = <<<END
	<p style="position: absolute; left: 45%; top: 45%;"><img src="$sfgScriptPath/skins/loading.gif" /></p>

END;
		$form_body = Html::hidden( 'wpTextbox1', $page_contents );
		$form_body .= Html::hidden( 'wpSummary', $edit_summary );
		$form_body .= Html::hidden( 'wpStarttime', $start_time );
		$form_body .= Html::hidden( 'wpEdittime', $edit_time );
		$form_body .= Html::hidden( 'wpEditToken', $wgUser->isLoggedIn() ? $wgUser->editToken() : EDIT_TOKEN_SUFFIX );
		$form_body .= Html::hidden( $action, null );

		if ( $is_minor_edit ) {
			$form_body .= Html::hidden( 'wpMinoredit' , null );
		}
		if ( $watch_this ) {
			$form_body .= Html::hidden( 'wpWatchthis', null );
		}
		$text .= Html::rawElement(
			'form',
			array(
				'id' => 'editform',
				'name' => 'editform',
				'method' => 'post',
				'action' => $title instanceof Title ? $title->getLocalURL( 'action=submit' ) : $title
			),
			$form_body
		);

		$text .= <<<END
	<script type="text/javascript">
	window.onload = function() {
		document.editform.submit();
	}
	</script>

END;
		wfRunHooks( 'sfPrintRedirectForm', array( $is_save, $is_preview, $is_diff, &$text ) );
		return $text;
	}

	/**
	 * Javascript files to be added outside of the ResourceLoader -
	 * by default, there are none.
	 */
	public static function addJavascriptFiles( $parser ) {
		global $wgOut, $wgJsMimeType;

		$scripts = array();

		wfRunHooks( 'sfAddJavascriptFiles', array( &$scripts ) );

		foreach ( $scripts as $js ) {
			if ( $parser ) {
				$script = "<script type=\"$wgJsMimeType\" src=\"$js\"></script>\n";
				$parser->getOutput()->addHeadItem( $script );
			} else {
				$wgOut->addScriptFile( $js );
			}
		}
	}

	/**
	 * Includes the necessary Javascript and CSS files for the form
	 * to display and work correctly.
	 *
	 * Accepts an optional Parser instance, or uses $wgOut if omitted.
	 */
	public static function addJavascriptAndCSS( $parser = null ) {
		global $wgOut;

		// Handling depends on whether or not this form is embedded
		// in another page.
		if ( !$parser ) {
			$wgOut->addMeta( 'robots', 'noindex,nofollow' );
			$output = $wgOut;
		} else {
			$output = $parser->getOutput();
		}

		$output->addModules( 'ext.semanticforms.main' );
		$output->addModules( 'ext.semanticforms.fancybox' );
		$output->addModules( 'ext.semanticforms.dynatree' );
		$output->addModules( 'ext.semanticforms.imagepreview' );
		$output->addModules( 'ext.semanticforms.autogrow' );
		$output->addModules( 'ext.semanticforms.submit' );
		$output->addModules( 'ext.smw.tooltips' );
		$output->addModules( 'ext.smw.sorttable' );

		self::addJavascriptFiles( $parser );
	}

	/**
	 * Returns an array of all form names on this wiki.
	*/
	public static function getAllForms() {
		$dbr = wfGetDB( DB_SLAVE );
		$res = $dbr->select( 'page',
			'page_title',
			array( 'page_namespace' => SF_NS_FORM,
				'page_is_redirect' => false ),
			__METHOD__,
			array( 'ORDER BY' => 'page_title' ) );
		$form_names = array();
		while ( $row = $dbr->fetchRow( $res ) ) {
			$form_names[] = str_replace( '_', ' ', $row[0] );
		}
		$dbr->freeResult( $res );
		return $form_names;
	}

	/**
	 * Creates a dropdown of possible form names.
	 */
	public static function formDropdownHTML() {
		global $wgContLang;
		$namespace_labels = $wgContLang->getNamespaces();
		$form_label = $namespace_labels[SF_NS_FORM];
		$form_names = SFUtils::getAllForms();
		$select_body = "\n";
		foreach ( $form_names as $form_name ) {
			$select_body .= "\t" . Html::element( 'option', null, $form_name ) . "\n";
		}
		return "\t" . Html::rawElement( 'label', array( 'for' => 'formSelector' ), $form_label . wfMessage( 'colon-separator' )->escaped() ) . "\n" . Html::rawElement( 'select', array( 'id' => 'formSelector', 'name' => 'form' ), $select_body ) . "\n";
	}

	/**
	 * This function, unlike the others, doesn't take in a substring
	 * because it uses the SMW data store, which can't perform
	 * case-insensitive queries; for queries with a substring, the
	 * function SFAutocompleteAPI::getAllValuesForProperty() exists.
	 */
	public static function getAllValuesForProperty( $property_name ) {
		global $sfgMaxAutocompleteValues;

		$store = SFUtils::getSMWStore();
		$requestoptions = new SMWRequestOptions();
		$requestoptions->limit = $sfgMaxAutocompleteValues;
		$values = self::getSMWPropertyValues( $store, null, $property_name, $requestoptions );
		sort( $values );
		return $values;
	}

	/**
	 * Get all the pages that belong to a category and all its
	 * subcategories, down a certain number of levels - heavily based on
	 * SMW's SMWInlineQuery::includeSubcategories()
	 */
	public static function getAllPagesForCategory( $top_category, $num_levels, $substring = null ) {
		if ( 0 == $num_levels ) return $top_category;
		global $sfgMaxAutocompleteValues;

		$db = wfGetDB( DB_SLAVE );
		$top_category = str_replace( ' ', '_', $top_category );
		$categories = array( $top_category );
		$checkcategories = array( $top_category );
		$pages = array();
		for ( $level = $num_levels; $level > 0; $level-- ) {
			$newcategories = array();
			foreach ( $checkcategories as $category ) {
				$conditions = array();
				$conditions[] = 'cl_from = page_id';
				$conditions['cl_to'] = $category;
				if ( $substring != null ) {
					$conditions[] = self::getSQLConditionForAutocompleteInColumn( 'page_title', $substring ) . ' OR page_namespace = ' . NS_CATEGORY;
				}
				$res = $db->select( // make the query
					array( 'categorylinks', 'page' ),
					array( 'page_title', 'page_namespace' ),
					$conditions,
					__METHOD__,
					'SORT BY cl_sortkey' );
				if ( $res ) {
					while ( $res && $row = $db->fetchRow( $res ) ) {
						if ( !array_key_exists( 'page_title', $row ) ) {
							continue;
						}
						$page_namespace = $row['page_namespace'];
						$page_name = $row[ 'page_title' ];
						if ( $page_namespace == NS_CATEGORY ) {
							if ( !in_array( $page_name, $categories ) ) {
								$newcategories[] = $page_name;
							}
						} else {
							$cur_title = Title::makeTitleSafe( $page_namespace, $page_name );
							if ( is_null( $cur_title ) ) {
								// This can happen if it's
								// a "phantom" page, in a
								// namespace that no longer exists.
								continue;
							}
							$cur_value = self::titleString( $cur_title );
							if ( ! in_array( $cur_value, $pages ) ) {
								$pages[] = $cur_value;
							}
							// return if we've reached the maximum number of allowed values
							if ( count( $pages ) > $sfgMaxAutocompleteValues ) {
								// Remove duplicates, and put in alphabetical order.
								$pages = array_unique( $pages );
								sort( $pages );
								return $pages;
							}
						}
					}
					$db->freeResult( $res );
				}
			}
			if ( count( $newcategories ) == 0 ) {
				// Remove duplicates, and put in alphabetical order.
				$pages = array_unique( $pages );
				sort( $pages );
				return $pages;
			} else {
				$categories = array_merge( $categories, $newcategories );
			}
			$checkcategories = array_diff( $newcategories, array() );
		}
		// Remove duplicates, and put in alphabetical order.
		$pages = array_unique( $pages );
		sort( $pages );
		return $pages;
	}

	public static function getAllPagesForConcept( $conceptName, $substring = null ) {
		global $sfgMaxAutocompleteValues, $sfgAutocompleteOnAllChars;

		$store = SFUtils::getSMWStore();

		$conceptTitle = Title::makeTitleSafe( SMW_NS_CONCEPT, $conceptName );

		if ( !is_null( $substring ) ) {
			$substring = strtolower( $substring );
		}

		// Escape if there's no such concept.
		if ( $conceptTitle == null || !$conceptTitle->exists() ) {
			return "Could not find concept: $conceptName";
		}

		$conceptDI = SMWDIWikiPage::newFromTitle( $conceptTitle );
		$desc = new SMWConceptDescription( $conceptDI );
		$printout = new SMWPrintRequest( SMWPrintRequest::PRINT_THIS, "" );
		$desc->addPrintRequest( $printout );
		$query = new SMWQuery( $desc );
		$query->setLimit( $sfgMaxAutocompleteValues );
		$query_result = $store->getQueryResult( $query );
		$pages = array();
		while ( $res = $query_result->getNext() ) {
			$pageName = $res[0]->getNextText( SMW_OUTPUT_WIKI );
			if ( is_null( $substring ) ) {
				$pages[] = $pageName;
			} else {
				// Filter on the substring manually. It would
				// be better to do this filtering in the
				// original SMW query, but that doesn't seem
				// possible yet.
				$lowercasePageName = strtolower( $pageName );
				if ( $sfgAutocompleteOnAllChars ) {
					if ( strpos( $lowercasePageName, $substring ) >= 0 ) {
						$pages[] = $pageName;
					}
				} else {
					if ( strpos( $lowercasePageName, $substring ) === 0 ||
						strpos( $lowercasePageName, ' ' . $substring ) > 0 ) {
						$pages[] = $pageName;
					}
				}
			}
		}
		sort( $pages );
		return $pages;
	}

	public static function getAllPagesForNamespace( $namespace_name, $substring = null ) {
		global $wgContLang, $wgLanguageCode;

		// Cycle through all the namespace names for this language, and
		// if one matches the namespace specified in the form, get the
		// names of all the pages in that namespace.

		// Switch to blank for the string 'Main'.
		if ( $namespace_name == 'Main' || $namespace_name == 'main' ) {
			$namespace_name = '';
		}
		$matchingNamespaceCode = null;
		$namespaces = $wgContLang->getNamespaces();
		foreach ( $namespaces as $curNSCode => $curNSName ) {
			if ( $curNSName == $namespace_name ) {
				$matchingNamespaceCode = $curNSCode;
			}
		}

		// If that didn't find anything, and we're in a language
		// other than English, check English as well.
		if ( is_null( $matchingNamespaceCode ) && $wgLanguageCode != 'en' ) {
			$englishLang = Language::factory( 'en' );
			$namespaces = $englishLang->getNamespaces();
			foreach ( $namespaces as $curNSCode => $curNSName ) {
				if ( $curNSName == $namespace_name ) {
					$matchingNamespaceCode = $curNSCode;
				}
			}
		}

		if ( is_null( $matchingNamespaceCode ) ) {
			return "Could not find namespace: $namespace_name";
		}

		$db = wfGetDB( DB_SLAVE );
		$conditions = array();
		$conditions['page_namespace'] = $matchingNamespaceCode;
		if ( $substring != null ) {
			$conditions[] = SFUtils::getSQLConditionForAutocompleteInColumn( 'page_title', $substring );
		}
		$res = $db->select( 'page',
			'page_title',
			$conditions, __METHOD__,
			array( 'ORDER BY' => 'page_title' ) );

		$pages = array();
		while ( $row = $db->fetchRow( $res ) ) {
			$pages[] = str_replace( '_', ' ', $row[0] );
		}
		$db->freeResult( $res );

		return $pages;
	}

	/**
	 * Creates an array of values that match the specified source name and
	 * type, for use by both Javascript autocompletion and comboboxes.
	 */
	public static function getAutocompleteValues( $source_name, $source_type ) {
		if ( $source_name == null ) {
			return null;
		}

		// The query depends on whether this is a property, category,
		// concept or namespace.
		if ( $source_type == 'property' ) {
			$names_array = self::getAllValuesForProperty( $source_name );
		} elseif ( $source_type == 'category' ) {
			$names_array = self::getAllPagesForCategory( $source_name, 10 );
		} elseif ( $source_type == 'concept' ) {
			$names_array = self::getAllPagesForConcept( $source_name );
		} else { // i.e., $source_type == 'namespace'
			$names_array = self::getAllPagesForNamespace( $source_name );
		}
		return $names_array;
	}

	/**
	 * Helper function to get an array of values out of what may be either
	 * an array or a delimited string
	 */
	public static function getValuesArray( $value, $delimiter ) {
		if ( is_array( $value ) ) {
			return $value;
		} else {
			// remove extra spaces
			return array_map( 'trim', explode( $delimiter, $value ) );
		}
	}

	/**
	 * Helper function to get an array of labels from an array of values given a mapping template
	 */
	public static function getLabels( $values, $templateName ) {
		global $wgParser;
		$labels = array();
		$title = Title::makeTitleSafe( NS_TEMPLATE, $templateName );
		$templateExists = $title->exists();
		foreach ( $values as $value ) {
			if ( $templateExists ) {
				$label = $wgParser->recursiveTagParse( '{{' .  $templateName .
					'|' .  $value . '}}' );
				if ( $label == '' ) {
					$labels[$value] = $value;
				} else {
					$labels[$value] = $label;
				}
			} else {
				$labels[$value] = $value;
			}
		}
		if ( count( $labels ) == count( array_unique( $labels ) ) ) {
			return $labels;
		}
		$fixed_labels = array();
		foreach ( $labels as $value => $label ) {
			$fixed_labels[$value] = $labels[$value];
		}
		$counts = array_count_values( $fixed_labels );
		foreach ( $counts as $current_label => $count ) {
			if ( $count > 1 ) {
				$matching_keys = array_keys( $labels, $current_label );
				foreach ( $matching_keys as $key ) {
					$fixed_labels[$key] .= ' (' . $key . ')';
				}
			}
		}
		if ( count( $fixed_labels ) == count( array_unique( $fixed_labels ) ) ) {
			return $fixed_labels;
		}
		foreach ( $labels as $value => $label ) {
			$labels[$value] .= ' (' . $value . ')';
		}
		return $labels;
	}

	/**
	 * Helper function to use mapping template to turn label back into value
	 */
	public static function labelToValue( $label, $possible_values, $templateName ) {
		$value = array_search( $label, $possible_values );
		if ( $value === false ) {
			return $label;
		} else {
			return $value;
		}
	}

	/**
	 * Helper function to map the current value with the mapping template, if the mapping template is set
	 */
	public static function valuesToLabels( $valueString, $templateName, $delimiter, $possible_values ) {
		if ( !is_null($delimiter ) ) {
			$values = array_map( 'trim', explode( $delimiter, $valueString ) );
		} else {
			$values = array( $valueString );
		}
		$labels = array();
		foreach ( $values as $value ) {
			if ( array_key_exists( $value, $possible_values ) ) {
				$labels[] = $possible_values[$value];
			} else {
				$labels[] = $value;
			}
		}
		if ( count( $labels ) > 1 ) {
			return $labels;
		} else {
			return $labels[0];
		}
	}

	public static function getValuesFromExternalURL( $external_url_alias, $substring ) {
		global $sfgAutocompletionURLs;
		if ( empty( $sfgAutocompletionURLs ) ) {
			return "No external URLs are specified for autocompletion on this wiki";
		}
		if ( ! array_key_exists( $external_url_alias, $sfgAutocompletionURLs ) ) {
			return "Invalid external URL value";
		}
		$url = $sfgAutocompletionURLs[$external_url_alias];
		if ( empty( $url ) ) {
			return "Blank external URL value";
		}
		$url = str_replace( '<substr>', urlencode( $substring ), $url );
		$page_contents = Http::get( $url );
		if ( empty( $page_contents ) ) {
			return "External page contains no contents";
		}
		$data = json_decode( $page_contents );
		if ( empty( $data ) ) {
			return "Could not parse JSON in external page";
		}
		$return_values = array();
		foreach ( $data->sfautocomplete as $val ) {
			$return_values[] = (array)$val;
		}
		return $return_values;
	}

	/**
	 * A helper function, used by getFormTagComponents().
	 */
	public static function convertBackToPipes( $s ) {
		return str_replace( "\1", '|', $s );
	}

	/**
	 * This function is basically equivalent to calling
	 * explode( '|', $str ), except that it doesn't split on pipes
	 * that are within parser function calls - i.e., pipes within
	 * double curly brackets.
	 */
	public static function getFormTagComponents( $str ) {
		// Turn each pipe within double curly brackets into another,
		// unused character (here, "\1"), then do the explode, then
		// convert them back.
		$pattern = '/({{.*)\|(.*}})/';
		while ( preg_match( $pattern, $str, $matches ) ) {
			$str = preg_replace( $pattern, "$1" . "\1" . "$2", $str );
		}
		return array_map( array( 'SFUtils', 'convertBackToPipes' ), explode( '|', $str ) );
	}

	/**
	 * Gets the word in the wiki's language, as defined in Semantic
	 * MediaWiki, for either the value 'yes' or 'no'.
	 */
	public static function getWordForYesOrNo( $isYes ) {
		$wordsMsg = ( $isYes ) ? 'smw_true_words' : 'smw_false_words';
		$possibleWords = explode( ',', wfMessage( $wordsMsg )->inContentLanguage()->text() );
		// Get the value in the series that tends to be "yes" or "no" -
		// generally, that's the third word.
		$preferredIndex = 2;
		if ( count( $possibleWords ) > $preferredIndex ) {
			return ucwords( $possibleWords[$preferredIndex] );
		} elseif ( count( $possibleWords ) > 0 ) {
			return ucwords( $possibleWords[0] );
		}
		// If no values are found, just return a number.
		 return ( $isYes ) ? '1' : '0';
	}

	/**
	 * Translates an EditPage error code into a corresponding message ID
	 * @param $error The error code
	 * @return String
	 */
	public static function processEditErrors ( $error ) {

		switch ( $error ) {
			case EditPage::AS_SUCCESS_NEW_ARTICLE:
			case EditPage::AS_SUCCESS_UPDATE:
				return null;

			case EditPage::AS_SPAM_ERROR:
				return 'spamprotectiontext';

			case EditPage::AS_BLOCKED_PAGE_FOR_USER:
				return 'blockedtitle';

			case EditPage::AS_IMAGE_REDIRECT_ANON:
				return 'uploadnologin';

			case EditPage::AS_READ_ONLY_PAGE_ANON:
				return 'loginreqtitle';

			case EditPage::AS_READ_ONLY_PAGE_LOGGED:
			case EditPage::AS_READ_ONLY_PAGE:
				return array( 'readonlytext', array ( wfReadOnlyReason() ) );

			case EditPage::AS_RATE_LIMITED:
				return 'actionthrottledtext';

			case EditPage::AS_NO_CREATE_PERMISSION:
				return 'nocreatetext';

			case EditPage::AS_BLANK_ARTICLE:
				return 'autoedit-blankpage';

			case EditPage::AS_IMAGE_REDIRECT_LOGGED:
				return 'badaccess';

			case EditPage::AS_HOOK_ERROR_EXPECTED:
			case EditPage::AS_HOOK_ERROR:
				return 'sf_formedit_hookerror';

			case EditPage::AS_CONFLICT_DETECTED:
				return 'editconflict';

			case EditPage::AS_CONTENT_TOO_BIG:
			case EditPage::AS_ARTICLE_WAS_DELETED:
			case EditPage::AS_SUMMARY_NEEDED:
			case EditPage::AS_TEXTBOX_EMPTY:
			case EditPage::AS_MAX_ARTICLE_SIZE_EXCEEDED:
			case EditPage::AS_END:
			case EditPage::AS_FILTERING:
			default:
				return array( 'internalerror_text', array ( $error ) );
		}
	}

	public static function addToAdminLinks( &$admin_links_tree ) {
		$data_structure_label = wfMessage( 'smw_adminlinks_datastructure' )->text();
		$data_structure_section = $admin_links_tree->getSection( $data_structure_label );
		if ( is_null( $data_structure_section ) ) {
			return true;
		}
		$smw_row = $data_structure_section->getRow( 'smw' );
		$smw_row->addItem( ALItem::newFromSpecialPage( 'Templates' ), 'Properties' );
		$smw_row->addItem( ALItem::newFromSpecialPage( 'Forms' ), 'SemanticStatistics' );
		$smw_admin_row = $data_structure_section->getRow( 'smw_admin' );
		$smw_admin_row->addItem( ALItem::newFromSpecialPage( 'CreateClass' ), 'SMWAdmin' );
		$smw_admin_row->addItem( ALItem::newFromSpecialPage( 'CreateProperty' ), 'SMWAdmin' );
		$smw_admin_row->addItem( ALItem::newFromSpecialPage( 'CreateTemplate' ), 'SMWAdmin' );
		$smw_admin_row->addItem( ALItem::newFromSpecialPage( 'CreateForm' ), 'SMWAdmin' );
		$smw_admin_row->addItem( ALItem::newFromSpecialPage( 'CreateCategory' ), 'SMWAdmin' );
		$smw_docu_row = $data_structure_section->getRow( 'smw_docu' );
		$sf_name = wfMessage( 'specialpages-group-sf_group' )->text();
		$sf_docu_label = wfMessage( 'adminlinks_documentation', $sf_name )->text();
		$smw_docu_row->addItem( ALItem::newFromExternalLink( "http://www.mediawiki.org/wiki/Extension:Semantic_Forms", $sf_docu_label ) );

		return true;
	}

	/**
	* Returns a SQL condition for autocompletion substring value in a column.
	* @param string $value_column Value column name
	* @param string $substring Substring to look for
	* @return SQL condition for use in WHERE clause
	*
	* @author Ilmars Poikans
	* @author Yaron Koren
	*/
	public static function getSQLConditionForAutocompleteInColumn( $column, $substring, $replaceSpaces = true ) {
		global $sfgAutocompleteOnAllChars;

		$column_value = "LOWER(CONVERT($column USING utf8))";
		if ( $replaceSpaces ) {
			$substring = str_replace( ' ', '_', strtolower( $substring ) );
		}
		$substring = str_replace( "'", "\'", $substring );
		$substring = str_replace( '_', '\_', $substring );
		$substring = str_replace( '%', '\%', $substring );

		if ( $sfgAutocompleteOnAllChars ) {
			return "$column_value LIKE '%$substring%'";
		} else {
			$spaceRepresentation = $replaceSpaces ? '\_' : ' ';
			return "$column_value LIKE '$substring%' OR $column_value LIKE '%" . $spaceRepresentation . $substring . "%'";
		}
	}

	/**
	 * Appends a preview of the actual form, when a page in the "Form"
	 * namespace is previewed.
	 *
	 * @author Solitarius
	 * @since 2.4
	 *
	 * @param EditPage $editpage
	 * @param WebRequest $request
	 *
	 * @return true
	 */
	public static function showFormPreview( EditPage $editpage, WebRequest $request ) {
		global $wgOut, $sfgFormPrinter;

		wfDebug( __METHOD__ . ": enter.\n" );
		wfProfileIn( __METHOD__ );

		// Exit if we're not in preview mode.
		if ( !$editpage->preview ) {
			wfProfileOut( __METHOD__ );
			return true;
		}
		// Exit if we aren't in the "Form" namespace.
		if ( $editpage->getArticle()->getTitle()->getNamespace() != SF_NS_FORM ) {
			wfProfileOut( __METHOD__ );
			return true;
		}

		$editpage->previewTextAfterContent .= Html::element( 'h2', null, wfMessage( 'sf-preview-header' )->text() ) . "\n" .
			'<div class="previewnote" style="font-weight: bold">' . $wgOut->parse( wfMessage( 'sf-preview-note' )->text() ) . "</div>\n<hr />\n";

		$form_definition = StringUtils::delimiterReplace( '<noinclude>', '</noinclude>', '', $editpage->textbox1 );
		list ( $form_text, $javascript_text, $data_text, $form_page_title, $generated_page_name ) =
			$sfgFormPrinter->formHTML( $form_definition, null, false, null, null, "Semantic Forms form preview dummy title", null );

		SFUtils::addJavascriptAndCSS();
		$editpage->previewTextAfterContent .=
			'<div style="margin-top: 15px">' . $form_text . "</div>";

		wfProfileOut( __METHOD__ );

		return true;
	}

	static function createFormLink ( &$parser, $specialPageName, $params ) {
		// Set defaults.
		$inFormName = $inLinkStr = $inLinkType = $inTooltip =
			$inQueryStr = $inTargetName = '';
		if ( $specialPageName == 'RunQuery' ) {
			$inLinkStr = wfMessage( 'runquery' )->text();
		}
		$classStr = '';
		$inQueryArr = array();
		$targetWindow = '_self';

		$positionalParameters = false;

		// assign params
		// - support unlabelled params, for backwards compatibility
		// - parse and sanitize all parameter values
		foreach ( $params as $i => $param ) {

			$elements = explode( '=', $param, 2 );

			// set param_name and value
			if ( count( $elements ) > 1 && !$positionalParameters ) {
				$param_name = trim( $elements[0] );

				// parse (and sanitize) parameter values
				$value = trim( $parser->recursiveTagParse( $elements[1] ) );
			} else {
				$param_name = null;

				// parse (and sanitize) parameter values
				$value = trim( $parser->recursiveTagParse( $param ) );
			}

			if ( $param_name == 'form' ) {
				$inFormName = $value;
			} elseif ( $param_name == 'link text' ) {
				$inLinkStr = $value;
			} elseif ( $param_name == 'link type' ) {
				$inLinkType = $value;
			} elseif ( $param_name == 'query string' ) {
				// Change HTML-encoded ampersands directly to
				// URL-encoded ampersands, so that the string
				// doesn't get split up on the '&'.
				$inQueryStr = str_replace( '&amp;', '%26', $value );

				parse_str( $inQueryStr, $arr );
				$inQueryArr = self::array_merge_recursive_distinct( $inQueryArr, $arr );
			} elseif ( $param_name == 'tooltip' ) {
				$inTooltip = Sanitizer::decodeCharReferences( $value );
			} elseif ( $param_name == 'target' ) {
				$inTargetName = $value;
			} elseif ( $param_name == null && $value == 'popup' ) {
				self::loadScriptsForPopupForm( $parser );
				$classStr = 'popupformlink';
			} elseif ( $param_name == null && $value == 'new window' ) {
				$targetWindow = '_blank';
			} elseif ( $param_name !== null && !$positionalParameters ) {
				$value = urlencode( $value );
				parse_str( "$param_name=$value", $arr );
				$inQueryArr = self::array_merge_recursive_distinct( $inQueryArr, $arr );
			} elseif ( $i == 0 ) {
				$inFormName = $value;
				$positionalParameters = true;
			} elseif ( $i == 1 ) {
				$inLinkStr = $value;
			} elseif ( $i == 2 ) {
				$inLinkType = $value;
			} elseif ( $i == 3 ) {
				// Change HTML-encoded ampersands directly to
				// URL-encoded ampersands, so that the string
				// doesn't get split up on the '&'.
				$inQueryStr = str_replace( '&amp;', '%26', $value );

				parse_str( $inQueryStr, $arr );
				$inQueryArr = self::array_merge_recursive_distinct( $inQueryArr, $arr );
			}
		}

		$ad = SpecialPageFactory::getPage( $specialPageName );
		if ( strpos( $inFormName, '/' ) == true ) {
			$query = array( 'form' => $inFormName, 'target' => $inTargetName );
			$link_url = $ad->getTitle()->getLocalURL( $query );
		} else {
			$link_url = $ad->getTitle()->getLocalURL() . "/$inFormName";
			if ( ! empty( $inTargetName ) ) {
				$link_url .= "/$inTargetName";
			}
			$link_url = str_replace( ' ', '_', $link_url );
		}
		$hidden_inputs = "";
		if ( ! empty( $inQueryArr ) ) {
			// Special handling for the buttons - query string
			// has to be turned into hidden inputs.
			if ( $inLinkType == 'button' || $inLinkType == 'post button' ) {

				$query_components = explode( '&', http_build_query( $inQueryArr, '', '&' ) );

				foreach ( $query_components as $query_component ) {
					$var_and_val = explode( '=', $query_component, 2 );
					if ( count( $var_and_val ) == 2 ) {
						$hidden_inputs .= Html::hidden( urldecode( $var_and_val[0] ), urldecode( $var_and_val[1] ) );
					}
				}
			} else {
				$link_url .= ( strstr( $link_url, '?' ) ) ? '&' : '?';
				$link_url .= str_replace( '+', '%20', http_build_query( $inQueryArr, '', '&' ) );
			}
		}
		if ( $inLinkType == 'button' || $inLinkType == 'post button' ) {
			$formMethod = ( $inLinkType == 'button' ) ? 'get' : 'post';
			$str = Html::rawElement( 'form', array( 'action' => $link_url, 'method' => $formMethod, 'class' => $classStr, 'target' => $targetWindow ),

				// Html::rawElement() before MW 1.21 or so drops the type attribute
				// do not use Html::rawElement() for buttons!
				'<button ' . Html::expandAttributes( array( 'type' => 'submit', 'value' => $inLinkStr ) ) . '>' . $inLinkStr . '</button>' .
				$hidden_inputs
			);
		} else {
			// If a target page has been specified but it doesn't
			// exist, make it a red link.
			if ( ! empty( $inTargetName ) ) {
				$targetTitle = Title::newFromText( $inTargetName );
				if ( is_null( $targetTitle ) || !$targetTitle->exists() ) {
					$classStr .= " new";
				}
			}
			$str = Html::rawElement( 'a', array( 'href' => $link_url, 'class' => $classStr, 'title' => $inTooltip, 'target' => $targetWindow ), $inLinkStr );
		}

		return $str;
	}

	static function loadScriptsForPopupForm( &$parser ) {
		$parser->getOutput()->addModules( 'ext.semanticforms.popupformedit' );
		return true;
	}

	/**
	 * array_merge_recursive merges arrays, but it converts values with duplicate
	 * keys to arrays rather than overwriting the value in the first array with the duplicate
	 * value in the second array, as array_merge does.
	 *
	 * array_merge_recursive_distinct does not change the datatypes of the values in the arrays.
	 * Matching keys' values in the second array overwrite those in the first array.
	 *
	 * Parameters are passed by reference, though only for performance reasons. They're not
	 * altered by this function.
	 *
	 * See http://www.php.net/manual/en/function.array-merge-recursive.php#92195
	 *
	 * @param array $array1
	 * @param array $array2
	 * @return array
	 * @author Daniel <daniel (at) danielsmedegaardbuus (dot) dk>
	 * @author Gabriel Sobrinho <gabriel (dot) sobrinho (at) gmail (dot) com>
	 */
	public static function array_merge_recursive_distinct( array &$array1, array &$array2 ) {

		$merged = $array1;

		foreach ( $array2 as $key => &$value ) {
			if ( is_array( $value ) && isset( $merged[$key] ) && is_array( $merged[$key] ) ) {
				$merged[$key] = self::array_merge_recursive_distinct( $merged[$key], $value );
			} else {
				$merged[$key] = $value;
			}
		}

		return $merged;
	}

	/**
	 * Register the namespaces for Semantic Forms.
	 * @see https://www.mediawiki.org/wiki/Manual:Hooks/CanonicalNamespaces
	 *
	 * @since 2.4.1
	 *
	 * @param array $list
	 *
	 * @return true
	 */
	public static function registerNamespaces( array &$list ) {
		global $wgNamespacesWithSubpages;

		$list[SF_NS_FORM] = 'Form';
		$list[SF_NS_FORM_TALK] = 'Form_talk';

		// Support subpages only for talk pages by default
		$wgNamespacesWithSubpages = $wgNamespacesWithSubpages + array(
			SF_NS_FORM_TALK => true
		);

		return true;
	}

	/**
	 * returns an array of pages that are result of the semantic query
	 * @param $rawQueryString string - the query string like [[Category:Trees]][[age::>1000]]
	 * @return array of SMWDIWikiPage objects representing the result
	 */
	public static function getAllPagesForQuery( $rawQuery ) {
		$rawQueryArray = array( $rawQuery );
		SMWQueryProcessor::processFunctionParams( $rawQueryArray, $queryString, $processedParams, $printouts );
		SMWQueryProcessor::addThisPrintout( $printouts, $processedParams );
		$processedParams = SMWQueryProcessor::getProcessedParams( $processedParams, $printouts );
		$queryObj = SMWQueryProcessor::createQuery( $queryString,
			$processedParams,
			SMWQueryProcessor::SPECIAL_PAGE, '', $printouts );
		$res = SFUtils::getSMWStore()->getQueryResult( $queryObj );
		$pages = $res->getResults();

		return $pages;
	}

	/**
	 * Returns a formatted (pseudo) random number
	 *
	 * @param number $numDigits the min width of the random number
	 * @param boolean $hasPadding should the number should be padded with zeros instead of spaces?
	 * @return number
	 */
	static function makeRandomNumber( $numDigits = 1, $hasPadding = false ) {
		$maxValue = pow( 10, $numDigits ) - 1;
		if ( $maxValue > getrandmax() ) {
			$maxValue = getrandmax();
		}
		$value = rand( 0, $maxValue );
		$format = '%' . ($hasPadding ? '0' : '') . $numDigits . 'd';
		return trim( sprintf( $format, $value ) ); // trim needed, when $hasPadding == false
	}

	/**
	 * Hook to add PHPUnit test cases.
	 * From https://www.mediawiki.org/wiki/Manual:PHP_unit_testing/Writing_unit_tests_for_extensions
	 *
	 * @return boolean
	 */
	 public static function onUnitTestsList( &$files ) {
		$testDir = dirname( __DIR__ ) . '/tests/phpunit/includes';
		$files = array_merge( $files, glob( "$testDir/*Test.php" ) );
		return true;
	 }

}
