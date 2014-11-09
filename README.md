WYSIWYG-CKeditor
===
This is modified extension of MediaWiki: WYSIWYG -editor. This bundle includes WYSIWYG extension and other modifed components related to it.
Files of this bundle were originally taken from diffrent source bundles of extension WYSIWYG from MediaWiki site www.mediawiki.org.
You can find results of this work here (http://github.com/Mediawiki-wysiwyg).

More information about MediaWiki extension WYSIWYG can be found here:

  http://www.mediawiki.org/wiki/Extension:WYSIWYG

  http://www.mediawiki.org/wiki/Extension_talk:WYSIWYG

-----------
**NOTE!**

> You will use this bundle in your environment at your own risk.  The authors of this package can not be held responsible for any issues this bundle may cause in your system.

-----------

> It is always nice to hear comments about use of this extension. You can leave your comments here:

>http://www.mediawiki.org/wiki/Extension_talk:WYSIWYG

----------
**You can find information about following issues below:**
- history of modifications (in reverse order)
- supported languages
- version info of compatible components required with this extension and Mediawiki
- short installation instructions (MediaWiki, WYSIWYG, WikiEditor, SemanticForms)
- compatible browsers and browser settings

================

------------
History of modifications:
===

- 07.11.14  Updated CKBuilder and run instructions of _source directory. Fixed CKBuilder warnings with smwtoolbar/plugin.js.

- 07.11.14  Fixed version info of CKeditor on page "Special:Version" (CKeditor 4.4.5 revision 25cdcad). Updated CKeditor source related files in ckeditor/_source from githhub repository of CKeditor. Added source code of texttransform plugin. Instructions and sample config.js to run source files of CKeditor with WYSIWYG (_source/_ReadMe-ckeditor_source.txt).

- 07.11.14  Updated version of CKeditor from 4.4.4 to 4.4.5 (earlier 23.08.14 "default table properties" modification with table.js was cancelled by this update, textselection plugin has not been updated). Replaced contents of ckeditor\_source directory with source files of CKEditor 4.4.5. After this copied following directories from directory ckeditor\plugins to directory ckeditor\_source\plugins: mediawiki, mwtemplate, smwqueryinterface, smwrichmedia, smwrule, smwtoolbar, smwwebservice, textselection.

- 04.11.14  Modified IE compatibility mode setting "IE=9" to be the first of all metas (like it should be, related to mod. made at 17.02.13).

- 02.11.14  With syntaxhighlight extension use tag syntaxhighlight by default, source tag is still supported (f.ex xml  tag source works now). Convert existing "old" source -tag on page or keyed in source -tag in dialog special.js to syntaxhighlight -tag.

- 30.10.14  With dialog special.js modified html-txt-html conversion, because it was too strict for the purpose of dialog.

- 30.10.14  Fixed behaviour of source -object with syntaxhighlight extension: convert existing "old" syntaxhighlight -tag on page (code by Wingsofcourage) or keyed in syntaxhighlight -tag in dialog special.js to source -tag; with code samples keep line indents created by spaces (fckSPACE); convert some of the html tags to text and vice versa when editing code samples (dialog special.js).

- 21.10.14  Modified test of compatible browser string for IE (code provided by interjinn).

- 20.10.14  Fixed handling of external link in case it has format [//www.xx.yy].

- 17.10.14  Image of math equations "button_math.png" may be in different locations, modified to test location of MW in skins/common/images and extensions/Math/images.

- 08.10.14  Cancelled modification dated 23.08.14 below "Merge pull request #16 from Varlin/patch-8, Fix unwanted caps" (commit: 83b81d5ca2a6493a72f41c709f1dbdfd4bec5bb7 [83b81d5]) because it corrupted definitions of sortkey with existing category defintions on page.

- 07.10.14  WYSIWYG extension is compatible with MW 1.22.0 - 1.22.12 and MW 1.23.0 - 1.23.5. Updated Preferences=>Editing section in this README.MD file.

- 29.09.14  Fixed missing German translations of image -dialog: imgTypeThumb, imgTypeFrame, imgTypeFrameless, imgTypeBorder.

- 12.09.14  Textselection -plugin works in direction wysiwyg->wikitext with FF, Chrome and IE in MW 1.22.x. In MW 1.23.x it works too, but IE does not scroll to selected location automatically, you have to do it manually. Removed previous IE fix below dated 11.09.14.

- 11.09.14  Upgraded WikiEditor v0.3.1 (of MW 1.22.0) to v0.4.0 (of MW 1.23.3).

- 11.09.14  In MW 1.22.10 + IE11 textselection plugin in wysiwyg->wikitext direction does not work. Because extension is enabled and wysiwyg->wikitext direction works with FF and Chrome, bookmarks are left in wikitext code with IE, so remove these: `<span data-cke-bookmark="1" style="display: none;" id="cke_bm_190c">&nbsp;</span>`. In case texselection plugin is fixed to work with MW and IE then this should be removed. MW1.23.3 + IE11 does not have this bookmark problem.

- 10.09.14  Problems in MW 1.23.3 with IE, FF and Chrome to pass selected text to functions SimpleLink, Category and Ref properly => use function getSelectedText() in order to avoid browser issues (works with IE8-IE11, FF, Chrome). Textselection plugin does not work with MW 1.23.3 and IE 11

- 09.09.14  Fixed version info of CKeditor for page "Special:Version" (CKeditor 4.4.4 revision 1ba5105).

- 08.09.14  Fixed dialog of categories: handling of spaces in category names.

- 08.09.14  Updated CKeditor from version 4.4.0 (revision 98daef5) to version 4.4.4 (revision 1ba5105). Added ckeditor plugins: textransform, tableresize, and textselection. NOTES ABOUT PLUGINS! 1. Textransform works ok; 2. Tableresize works too but inserts html code when adjusting width of column; 3. Textselection plugin works with FF and Chrome, it has also been hacked to work only in wysiwyg->wikitext direction because other direction left bookmarks on page; 4. Default properties of table -plugin have been modified to no border - one row - width = 100%. It is not very good idea to hack plugins which are delivered by CKeditor distribution, because hacking makes upgrade of CKeditor difficult!

- 06.09.14  Fixed enable/disable of "create link" -button. Added parameter in user editing preferences "Paste selected text as link text into link -dialog", modified link -dialog to allow pasting selected text as name of link (based on Varlin's "patch-10", modified further).

- 05.09.14  Added one button to convert plain text to simple link (based on Varlin's "patch-11", modifed to work with IE, new icon for button of simple link, fixed enable/disable of link buttons): config.js, plugin.js, tb_icon_simplelink.gif. Due to user error earlier, some language files of ckeditor have not been included, files were added now.

- 29.08.14  With search function used in dialogs for adding images, articles or categories: based on Vidarsk suggestion modified SQL queries to use CAST(.AS.) instead of CONVERT(.,.) so that same code will work with MySQL and Postgres databases.

- 27.08.14  Merged modifications made by Varlin: Fix resizing problem in Firefox. Fix "size reset" problem: when an image has a defined size, and when you clear the height and width fields, the removal of height and width tags is not remembered (because tags like "_fck_mw_width" are not removed).

- 23.08.14  Merged modifications made by Varlin: integration of texselection plugin which enables to keep selection when switching from WYSIWIG view to source view; changed default table properties; fixed unwanted caps with simple links.

- 18.05.14  Update CKEditor parser to manager calendar tag by oliviermaridat: <calendar></calendar> tags from the Calender extension (http://www.mediawiki.org/wiki/Extension:Calendar_%28Kenyu73%29) are displayed as nowiki balise, and didn't break anymore when the page is saved.

- 11.05.14  Fixed [[Media:<link>|<text>]] internal link to an image or a file of other types. Added checkbox in link.js dialog for 'Media:' -prefix.

- 05.05.14  Fixed focus problem with IE and reference dialog (ref.js) after Ckeditor 4.4.0 upgrade: IE lost focus of ref -element and could not get text of reference into dialog.

- 05.05.14  Updated CKeditor from version 4.3.4 (revision 40ccd20) to version 4.4.0 (revision 98daef5).

- 05.05.14  WYSIWYG extension is compatible with MW 1.22.0 - 1.22.6

- 17.04.14  Add german translation for category and reference buttons/dialogs. Merge pull request #11 from stepping-stone/german-translation-updates.

- 13.04.14  Fixed popup warning of unsaved page (=cancelling edit of page when setting "Warn me when I leave an edit page with unsaved changes" in users preferences has been enabled). Dialog appears only with Cancel- button and is disabled with Save-, Preview- and Diff- buttons. IE required fix also with togglelink.

- 11.04.14  Fixed version info 'Special:Version': WYSIWYG extension 1.5.6_0 [B551], based on this version, modified further, using CKEditor 4.3.4 (revision 40ccd20)

- 10.04.14  Fixed toolbar visibility of WikiEditor in case user preferences defines to start editing with WikiEditor (=wikitext mode).

- 08.04.14  Updated installation of CKeditor 4.3.4 (revision 40ccd20) to include all possible languages provided by CKeditor web site.

- 08.04.14  Merged some of the "French" language modifications made by Varlin.

- 08.04.14  Merged modification "remove <wbr> tags that causes parser to crash" made by Varlin.

- 01.04.14  Updated CKeditor version 4.3.3 to version 4.3.4 (revision 40ccd20).

- 28.03.14  Fixed enable / disable of unlink button (link plugin behaves differently in CKeditor 4.3.3).

- 27.03.14  WYSIWYG extension is compatible with MW 1.22.0 - 1.22.4

- 27.03.14  Integration of WYSIWYG with SemanticForms 2.7 (SF) (and SemanticMediaWiki (SMW)) as editor of free text block for SF (experimental version).

- 17.03.14  Fixed version info which is visible at wiki page 'Special:Version': WYSIWYG extension (1.5.6_0 [B551] based on this version, modified further, using CKEditor 4.3.3 (revision 7841b02)).

- 05.03.14  Fixed focus problem with IE and link.js dialog: related to CKeditor Ticket #8493, 8719.patch: IE needs focus sent back to the parent document if a dialog is launched. Needed with IE to merge link text with selected text of page.

- 03.03.14  Updated CKeditor version 3.6 to version 4.3.3 (full version).

- 01.03.14  Added checkbox for #REDIRECT option when creating link in dialog link.js.

- 28.02.14  Fixed height of texarea element in dialogs Tag, Template and Reference, because height of textarea does not grow when dialog is made higher.

- 27.02.14  Fixed finnish translation for header text of Tag -dialog. Fixed passing selection as text with IE in dialogs ref.js and category.js.

- 24.02.14  Problem with conflict page: changed "current page content" editing mode from wikieditor to wysiwyg. NOTE! Do not use refresh button of browser on conflict page, it corrupts contents of page in editor.

- 21.02.14  Problem with conflict page: section of "current contents of page" was using wysiwyg editor but text inside it was in wikitext mode => forced editor in wikitext mode (WikiEditor) in case of conflict (=two authors editing same page at same time, the one saving page as latest will get indication of conflict)

- 17.02.14  Fixed Tag -dialog (special.js) to support <source lang="xxx">. .<source> definition as "fck_mw_source" element (requires extension SyntaxHighlight_GeSHi). Errors found with IE11 native mode in wysiwyg editor: all dialogs work but they had focus problems with their respective elements on page, to fix this forced compatibility mode IE=9 with wysiwyg editing mode only. (WYSIWYG/CKeditor.body.php vs. includes/OutputPage.php)

- 14.02.14  IE11 works with wysiwyg in native mode (="Edge") as long as your wiki site IS NOT set to be viewed in compatibility mode with IE11.

- 12.02.14  Wysiwyg worked earlier with IE11 only in compatibility mode. Added code to enable wysiwyg mode in IE11 native mode.

- 10.02.14  Fixed two IE8 compatibility issues: tagged/numbered list emptied the page when saving page or changing into wikitext mode; ref.js dialog crashed, unable to save definition

- 06.02.14  Modified fix for IE 11 with Category.js

- 04.02.14  Tag -dialog (special.js) with variables of MW

- 03.02.14  Double clicking template image dialog (template.js)

- 17.01.14  WYSIWYG -editor together with WIkiEditor extension

- 10.01.14  <Ref> dialog: translations; image -dialog: width ja height values from image, resize image in edit mode

- 10.01.14  Category -button and dialog

- 09.01.14  Positions of [edit] link with headers

- 03.01.14  Ref, References -buttons

- 16.12.13  WYSIWYG_MV_v1.22.0.zip: WYSIWYG / IE11:n "numbered and bulleted" list; WYSIWYG / IE 11: Category -definition; IE11 html format 'IE=9' /opt/lampp/htdocs/mediawiki/includes/OutputPage.php

- 05.12.13  MW 1.21.2 => 1.22.0

- 10.11.13  MW 1.21.2, WYSIWYG_MW_v1.20.2.zip + manual fixes based on talk page of extension:wysiwyg

-----------------
**Origin of source bundles combined into this version:**

1. Version of WYSIWYG files were taken intially for MW 1.21 from here:
> https://docs.google.com/file/d/0B-aiZzKTmWI2bG8yVzBCOWNLamM/view?pli=1
> WYSIWYG_MW_v1.20.2.zip

2. Some modifications have been adapted into it from here:
>https://drive.google.com/file/d/0B-aiZzKTmWI2Q0wyd3FMRVpuZWM/view?pli=1
>WYSIWYG_MV_v1.22.0.zip

3. Some additinal features were developed based on this bundle
>http://wikirouge.net/nowiki/mediawiki/WYSIWYG

4. Additional features, modifications and fixes where applied on top of bundles above.

========================

Short installation instructions:
===

----------------
**Supported languages:**
* finnish, french, german, english

More translations are wellcomed (files mediawiki/plugin.js, mwtemplate/plugin.js; for details see git issues "French added")

----------------
**Compatible MediaWiki environment:**

- MediaWiki: 1.21.2, 1.22.0 - 1.22.12, 1.23.0-1.23.5
- SemanticForms: 2.7
- PHP 5.5.6,  MySQL 5.6.14, Apache 2.4.7  (=XAMPP for Linux 1.8.3-2)
- PHP 5.5.15, MySQL 5.6.20, Apache 2.4.10 (=XAMPP for Linux 1.8.3-5)

-----------------
**File: LocalSettings.php**

Make sure your LocalSettings.php has been set up properly, certain name spaces should be excluded from wysiwyg by default and some of the other settings should be in specific way for wysiwyg and wikieditor to work together:


    #13.11.13->
    require_once( "$IP/extensions/WYSIWYG/WYSIWYG.php" );

    #Or only for registered users:
    $wgGroupPermissions['registered_users']['wysiwyg']=true;
    $wgGroupPermissions['*']['wysiwyg'] = true;          //Everyone can use (if can edit)...
    $wgDefaultUserOptions['cke_show'] = 'richeditor';    //Enable CKEditor
    $wgDefaultUserOptions['riched_use_toggle'] = false;  //Editor can toggle CKEditor/WikiText
    $wgDefaultUserOptions['riched_start_disabled'] = false; //Important!!! else bug...
    $wgDefaultUserOptions['riched_toggle_remember_state'] = true; //working/bug?
    $wgDefaultUserOptions['riched_use_popup'] = false;   //Deprecated

    ##These are not compatible with WYSIWYG
    $wgFCKEditorExcludedNamespaces[] = NS_MEDIAWIKI;
    $wgFCKEditorExcludedNamespaces[] = NS_TEMPLATE;
    #13.11.13<-

    #17.01.14->
    #WikiEditor may not be compatible with WYSIWYG editor, use it with caution.
    require_once( "$IP/extensions/WikiEditor/WikiEditor.php" );

    # Enables/disables use of WikiEditor by default but still allow users to disable it in preferences
    $wgDefaultUserOptions['usebetatoolbar'] = 1;
    $wgDefaultUserOptions['usebetatoolbar-cgd'] = 1;

    # Displays the Preview and Changes tabs
    $wgDefaultUserOptions['wikieditor-preview'] = 0;

    # Displays the Publish and Cancel buttons on the top right side
    $wgDefaultUserOptions['wikieditor-publish'] = 0;
    #17.01.14<-

    #27.03.14->
    #This was required by SemanticMediaWiki extension in MW 1.22.4 to prevent startup error:
    $wgLocalisationUpdateDirectory = "$IP/cache";

    #These are for SemanticForms:
    enableSemantics( );
    include_once( "$IP/extensions/SemanticForms/SemanticForms.php" );

    #Optional excludes of wysiwyg in case SemanticForms and SemanticMediawiki are installed:
    $wgFCKEditorExcludedNamespaces[] = SF_NS_FORM;
    $wgFCKEditorExcludedNamespaces[] = SMW_NS_PROPERTY;
    #27.03.14<-

--------------
**WikiEditor:**

You should replace at least this file in WikiEditor extension of MW with modified file of this bundle:
- WikiEditor/modules/ext.wikiEditor.toolbar.js

--------------
**SemanticForms:**

NOTE! This extension has not been actively updated with wysiwyg extension.

You should replace at least following files in SemanticForms extension of MW with modified files of this bundle:
- SF_FormUtils.php
- SF_FormPrinter.php
- SF_Utils.php

Known bugs with WYSIWYG -extensions and SemanticForms free text block:
- preview of page is not displayed properly
- switching editing mode with "source" -button to wikitext works, but switching back to wysiwyg mode fails (text stays in wikitext format)
- refreshing page in editor mode always activates wysiwyg mode

--------------
**Preferences=>Editing (your account settings of MediWiki):**

Make sure that settings in your Preferences=>Editing are valid.
>DO NOT select these:
- Show WikiTextEditor
- Open rich editor in a popup

>These may be selected or deselected as you wish:
- Use toggle to switch between wikitext and rich editor
- Remember last toggle state
- Start with rich editor disabled
- Paste selected text as link text into link -dialog (tog-riched_link_paste_text)

====================


About browser compatibility
===

**About versions of IE:**
- IE versions 7 or below will not work with this bundle.

- With IE8, IE9, IE10, IE11 browsers, DO NOT ENABLE browsers compatibility settings for your wiki site, if you do have them enabled then wysiwyg will not work.

**Browser versions known to work with this bundle of WYSIWYG:**
- IE8
- IE11
- FireFox (v26.x - 33.x)
- Chrome  (v.32.x, v.38.x)

- Recommended browser: FireFox

