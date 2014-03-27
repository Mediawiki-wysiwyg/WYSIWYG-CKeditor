<?php
/**
 * Displays a pre-defined form for either creating a new page or editing an
 * existing one.
 *
 * @author Yaron Koren
 * @file
 * @ingroup SF
 */

/**
 * @ingroup SFSpecialPages
 */
class SFFormEdit extends SpecialPage {

	public $mTarget;
	public $mForm;
	public $mError;

	/**
	 * Constructor
	 */
	function __construct() {
		parent::__construct( 'FormEdit' );
	}

	function execute( $query ) {

		wfProfileIn( __METHOD__ );

		$this->setHeaders();

		$this->mForm = $this->getRequest()->getText( 'form' );
		$this->mTarget = $this->getRequest()->getText( 'target' );

		// if query string did not contain these variables, try the URL
		if ( !$this->mForm && !$this->mTarget ) {
			$queryparts = explode( '/', $query, 2 );
			$this->mForm = isset( $queryparts[ 0 ] ) ? $queryparts[ 0 ] : '';
			$this->mTarget = isset( $queryparts[ 1 ] ) ? $queryparts[ 1 ] : '';
			$this->mTarget = str_replace( '_', ' ', $this->mTarget );
		}

		$alt_forms = $this->getRequest()->getArray( 'alt_form' );

		self::printForm( $this->mForm, $this->mTarget, $alt_forms );

		wfProfileOut( __METHOD__ );
	}

	static function printAltFormsList( $alt_forms, $target_name ) {
		$text = "";
		$fe = SpecialPageFactory::getPage( 'FormEdit' );
		$fe_url = $fe->getTitle()->getFullURL();
		$i = 0;
		foreach ( $alt_forms as $alt_form ) {
			if ( $i++ > 0 ) {
				$text .= ', ';
			}
			$text .= "<a href=\"$fe_url/$alt_form/$target_name\">" . str_replace( '_', ' ', $alt_form ) . '</a>';
		}
		return $text;
	}

	static function printForm( &$form_name, &$targetName, $alt_forms = array( ) ) {
		global $wgOut, $wgRequest;

		if ( method_exists( 'ApiMain', 'getContext' ) ) {
			$module = new SFAutoeditAPI( new ApiMain(), 'sfautoedit' );
		} else { // TODO: remove else branch when raising supported version to MW 1.19
			$module = new SFAutoeditAPI( new ApiMain( $wgRequest ), 'sfautoedit' );
		}
		$module->setOption( 'form', $form_name );
		$module->setOption( 'target', $targetName );

		if ( $wgRequest->getCheck( 'wpSave' ) || $wgRequest->getCheck( 'wpPreview' ) || $wgRequest->getCheck( 'wpDiff' ) ) {
			// If the page was submitted, form data should be
			// complete => do not preload (unless it's a partial
			// form).
			if ( $wgRequest->getCheck( 'partial' ) ) {
				$module->setOption( 'preload', true );
			} else {
				$module->setOption( 'preload', false );
			}
		} else if ( !empty( $targetName ) && Title::newFromText( $targetName )->exists ( ) ) {
			// If target page exists, do not overwrite it with
			// preload data; just preload the page's data.
			$module->setOption( 'preload', true );
		} else if ( $wgRequest->getCheck( 'preload' ) ) {
			// if page does not exist and preload parameter is set, pass that on
			$module->setOption( 'preload', $wgRequest->getText( 'preload' ) );
		} else {
			// nothing set, so do not set preload
		}

		$module->execute();

		$text = '';

		// if action was successful and action was a Save, return
		if ( $module->getStatus() === 200 ) {
			if ( $module->getAction() === SFAutoeditAPI::ACTION_SAVE ) {
				return;
			}
		} else {

			$resultData = $module->getResultData();

			if ( array_key_exists( 'errors', $resultData ) ) {

				foreach ($resultData['errors'] as $error) {
					// FIXME: This should probably not be hard-coded to WARNING but put into a setting
					if ( $error[ 'level' ] <= SFAutoeditAPI::WARNING ) {
						$text .= Html::rawElement( 'p', array( 'class' => 'error' ), $error[ 'message' ] ) . "\n";
					}
				}
			}
		}

		// override the default title for this page if a title was specified in the form
		$result = $module->getOptions();
		$targetTitle = Title::newFromText( $result[ 'target' ] );


		// set page title depending on whether an explicit title was specified in the form definition
		if ( array_key_exists( 'formtitle', $result ) ) {

			// set page title depending on whether the target page exists
			if ( empty( $targetName ) ) {
				$pageTitle = $result[ 'formtitle' ];
			} else {
				$pageTitle = $result[ 'formtitle' ] . ': ' . $targetName;
			}
		} elseif ( $result[ 'form' ] !== '' ) {
			// set page title depending on whether the target page exists
			if ( empty( $targetName ) ) {
				$pageTitle = wfMessage( 'sf_formedit_createtitlenotarget', $result[ 'form' ] )->text();
			} elseif ( $targetTitle->exists() ) {
				$pageTitle = wfMessage( 'sf_formedit_edittitle', $result[ 'form' ], $targetName )->text();
			} else {
				$pageTitle = wfMessage( 'sf_formedit_createtitle', $result[ 'form' ], $targetName )->text();
			}
		} elseif ( count( $alt_forms ) > 0 ) {
			// We use the 'creating' message here, instead of
			// 'sf_formedit_createtitlenotarget', to differentiate
			// between a page with no (default) form, and one with
			// no target; in English they'll show up as
			// "Creating ..." and "Create ...", respectively.
			// Does this make any difference? Who knows.
			$pageTitle = wfMessage( 'creating', $targetName )->text();
		} elseif ( $result[ 'form' ] == '' ) {  //FIXME: This looks weird; a simple else should be enough, right?
			// display error message if the form is not specified in the URL
			$pageTitle = wfMessage( 'formedit' )->text();
			$text .= Html::element( 'p', array( 'class' => 'error' ), wfMessage( 'sf_formedit_badurl' )->text() ) . "\n";
			$wgOut->addHTML( $text );
		}

		$wgOut->setPageTitle( $pageTitle );
		if ( count( $alt_forms ) > 0 ) {
			$text .= '<div class="infoMessage">';
			if ( $result[ 'form' ] != '' ) {
				$text .= wfMessage( 'sf_formedit_altforms' )->escaped();
			} else {
				$text .= wfMessage( 'sf_formedit_altformsonly' )->escaped();
			}
			$text .= ' ' . self::printAltFormsList( $alt_forms, $targetName );
			$text .= "</div>\n";
		}

		$text .= '<form name="createbox" id="sfForm" method="post" class="createbox">';
		$pre_form_html = '';
		wfRunHooks( 'sfHTMLBeforeForm', array( &$targetTitle, &$pre_form_html ) );
		$text .= $pre_form_html;
		if ( isset( $result[ 'formHTML' ] ) ) {
			$text .= $result[ 'formHTML' ];
		}

		SFUtils::addJavascriptAndCSS();

		if ( isset( $result[ 'formJS' ] ) ) {
			$wgOut->addScript( '		<script type="text/javascript">' . "\n$result[formJS]\n" . '</script>' . "\n" );
		}

		$wgOut->addHTML( $text );

		return null;
	}

}
