<?php
/**
 * CKeditor extension - a WYSIWYG editor for MediaWiki
 *
 * @file
 * @ingroup Extensions
 * @version 1.0
 * @author Frederico Caldeira Knabben
 * @author Wiktor Walc <w.walc(at)fckeditor(dot)net>
 * @copyright Copyright © Frederico Caldeira Knabben, Wiktor Walc, other CKeditor team members and other contributors
 * @license GNU Lesser General Public License 2.1 or later
 */
/*
This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
*/

# Not a valid entry point, skip unless MEDIAWIKI is defined
if( !defined( 'MEDIAWIKI' ) ) {
	echo <<<HEREDOC
To install WYSIWYG extension, put the following line in LocalSettings.php:
require_once( "\$IP/extensions/WYSIWYG/WYSIWYG.php" );
HEREDOC;
	exit( 1 );
}

# quit when comming from the command line,
# special case, to make Halo webtests run (here we don't have a browser)
if ((!array_key_exists('SERVER_NAME', $_SERVER) || $_SERVER['SERVER_NAME'] == NULL) &&
    (strpos($_SERVER['PHP_SELF'], 'run-test.php') === false) )
	return;

define('WYSIWYG_EDITOR_VERSION', '1.5.6_0 [B551], based on this version, modified further');

// define to check with {{#isExtensionInstalled:wysiwyg}} if extension is installed
// the parser function comes in the SMWHalo extension
define('wysiwyg', 'true}]');

# Configuration variables
// Path to this extension
$wgFCKEditorExtDir = 'extensions/WYSIWYG';

// Path to the actual editor
$wgFCKEditorDir = 'extensions/WYSIWYG/ckeditor/';

$wgFCKEditorToolbarSet = 'Wiki';

// '0' for automatic ('300' minimum).
$wgFCKEditorHeight = '0';

// Array of namespaces that FCKeditor is disabled for. Use constants like NS_MEDIAWIKI here.
$wgFCKEditorExcludedNamespaces = array();

// set this to true if you want the Richeditor show up only when the
// URL param mode=wysiwyg is set
$wgCKEditorUrlparamMode = false;

// hide toolbar buttons when some extensions are not installed (default show buttons)
$wgCKEditorHideDisabledTbutton = false;

/**
 * Enable use of AJAX features.
 */
global $wgAjaxExportList;
require_once('CKeditorSajax.body.php');
$wgAjaxExportList[] = 'wfSajaxSearchImageCKeditor';
$wgAjaxExportList[] = 'wfSajaxSearchArticleCKeditor';
$wgAjaxExportList[] = 'wfSajaxSearchCategoryCKeditor';
$wgAjaxExportList[] = 'wfSajaxWikiToHTML';
$wgAjaxExportList[] = 'wfSajaxGetImageUrl';
$wgAjaxExportList[] = 'wfSajaxGetMathUrl';
$wgAjaxExportList[] = 'wfSajaxSearchTemplateCKeditor';
$wgAjaxExportList[] = 'wfSajaxSearchSpecialTagCKeditor';
$wgAjaxExportList[] = 'wfSajaxToggleCKeditor';

// Extension credits that will show up on Special:Version
$wgExtensionCredits['other'][] = array(
	'path' => __FILE__,
	'name' => 'WYSIWYG extension',
	'author' => array( 'Frederico Caldeira Knabben', 'Wiktor Walc', 'others', 'Jack Phoenix', 'ontoprise GmbH', 'MediaWiki community'),
	'version' => WYSIWYG_EDITOR_VERSION.', using CKEditor 4.4.5 (revision 25cdcad)',
	//'url' => 'http://smwforum.ontoprise.com/smwforum/index.php/Help:WYSIWYG_Extension',
	'url' => 'http://www.mediawiki.org/wiki/Extension:WYSIWYG',
	'descriptionmsg' => 'fckeditor-desc',
);

// Autoloadable classes
global $wgAutoloadClasses;
$dir = dirname( __FILE__ ) . '/';
$wgAutoloadClasses['CKEditor'] = $dir . 'ckeditor/ckeditor_php5.php';
$wgAutoloadClasses['CKeditorParser'] = $dir . 'CKeditorParser.body.php';
$wgAutoloadClasses['CKeditorParserOptions'] = $dir . 'CKeditorParserOptions.body.php';
$wgAutoloadClasses['CKeditorParserWrapper'] = $dir . 'CKeditorParserWrapper.body.php';
$wgAutoloadClasses['CKeditorLinker'] = $dir . 'CKeditorLinker.php';
$wgAutoloadClasses['CKeditorSkin'] = $dir . 'CKeditorSkin.body.php';
$wgAutoloadClasses['CKeditorEditPage'] = $dir . 'CKeditorEditPage.body.php';
$wgAutoloadClasses['CKeditor_MediaWiki'] = $dir . 'CKeditor.body.php';

// Path to internationalization file
$wgExtensionMessagesFiles['CKeditor'] = $dir . 'CKeditor.i18n.php';

// Initialize FCKeditor and the MediaWiki extension
$ckeditor = new CKEditor('fake');
$wgFCKEditorIsCompatible = $ckeditor->IsCompatible();

$oCKeditorExtension = new CKeditor_MediaWiki();

// Hooked functions
global $wgHooks;
$wgHooks['ParserAfterTidy'][]                   = array( $oCKeditorExtension, 'onParserAfterTidy' );
$wgHooks['EditPage::showEditForm:initial'][]    = array( $oCKeditorExtension, 'onEditPageShowEditFormInitial' );
$wgHooks['EditPage::showEditForm:fields'][]		= array( $oCKeditorExtension, 'onEditPageShowEditFormFields' );
$wgHooks['EditPageBeforePreviewText'][]         = array( $oCKeditorExtension, 'onEditPageBeforePreviewText' );
$wgHooks['EditPagePreviewTextEnd'][]            = array( $oCKeditorExtension, 'onEditPagePreviewTextEnd' );
$wgHooks['CustomEditor'][]                      = array( $oCKeditorExtension, 'onCustomEditor' );
$wgHooks['LanguageGetMagic'][]					= 'CKeditor_MediaWiki::onLanguageGetMagic';
$wgHooks['ParserBeforeStrip'][]					= 'CKeditor_MediaWiki::onParserBeforeStrip';
$wgHooks['ParserBeforeInternalParse'][]			= 'CKeditor_MediaWiki::onParserBeforeInternalParse';
$wgHooks['EditPageBeforeConflictDiff'][]		= 'CKeditor_MediaWiki::onEditPageBeforeConflictDiff';
$wgHooks['SanitizerAfterFixTagAttributes'][]	= 'CKeditor_MediaWiki::onSanitizerAfterFixTagAttributes';
$wgHooks['MakeGlobalVariablesScript'][]			= 'CKeditor_MediaWiki::onMakeGlobalVariablesScript';
$wgHooks['GetPreferences'][]					= 'CKeditor_MediaWiki::onGetPreferences';
$wgHooks['DoEditSectionLink'][]					= 'CKeditor_MediaWiki::onDoEditSectionLink';
// bugfix for http://smwforum.ontoprise.com/smwbugs/show_bug.cgi?id=13511
$wgHooks['OutputPageParserOutput'][]            = 'CKeditor_MediaWiki::onOutputPageParserOutput';
$wgHooks['BeforePageDisplay'][]                 = 'CKeditor_MediaWiki::onBeforePageDisplay';
$wgHooks['EditPageBeforeEditButtons'][]         = 'CKeditor_MediaWiki::onEditPageBeforeEditButtons'; //13.04.14 RL

// Defaults for new preferences options
global $wgDefaultUserOptions;
$wgDefaultUserOptions['riched_use_toggle'] = 1;
$wgDefaultUserOptions['riched_start_disabled'] = 0;
$wgDefaultUserOptions['riched_use_popup'] = 1;
$wgDefaultUserOptions['riched_toggle_remember_state'] = 1;
$wgDefaultUserOptions['riched_link_paste_text'] = 1;       //08.09.14 RL

// when SMWHalo is used then the QueryInterface opens in an Iframe
// also add setting that the Semantic toobar is loaded by default
if (defined('SMW_HALO_VERSION')) {
	global $wgEditPageFrameOptions;
    $wgEditPageFrameOptions = 'SAMEORIGIN';
    $wgDefaultUserOptions['riched_load_semantic_toolbar'] = 1;
}
