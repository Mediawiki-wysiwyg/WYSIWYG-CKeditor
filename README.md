WYSIWYG-CKeditor
===
This is modified extension of MediaWiki: WYSIWYG -editor. This bundle includes WYSIWYG extension and other modifed components related to it.
Files of this bundle were originally taken from diffrent source bundles of extension WYSIWYG from MediaWiki site www.mediawiki.org.
You can find results of this work here (http://github.com/Mediawiki-wysiwyg).

More information about MediaWiki extension WYSIWYG can be found here:

  https://www.mediawiki.org/wiki/Extension:WYSIWYG
  https://www.mediawiki.org/wiki/Extension_talk:WYSIWYG

-----------
**NOTE!**

> You will use this bundle in your environment at your own risk.  The authors of this package can not be held responsible for any issues this bundle may cause in your system.

-----------
**NOTE!**

> It is always nice to hear postive comments about use of this extension. You can leave them here:
http://www.mediawiki.org/wiki/Extension_talk:WYSIWYG#Version_of_source_bundles_38239.


----------
**You can find information about following issues below:**
- history of modifications (in reverse order)
- compatible Mediawiki environment
- short installation instructions (MediaWiki, WYSIWYG, WikiEditor, SemanticForms)
- compatible browsers and browser settings

================

------------
History of modifications:
===

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

- 10.01.14 <Ref> dialog: translations; image -dialog: width ja height values from image, resize image in edit mode

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

4. Additional features, modifications and fixes where applied on top of bundles abowe.

========================

Short installation instructions:
===

----------------
**Compatible MediaWiki environment:**

- MediaWiki: 1.21.2, 1.22.0, 1.22.1, 1.22.2, 1.22.3, 1.22.4
- SemanticForms: 2.7
- PHP 5.5.6, MySQL 5.6.14, Apache 2.4.7 (XAMPP for Linux 1.8.3-2)

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

You should replace at least one file in WikiEditor extension of MW 1.22 with modified file of this bundle:
- WikiEditor/modules/ext.wikiEditor.toolbar.js

--------------
**SemanticForms:**

You should replace at least following files in SemanticForms extension of MW 1.22 with modified files of this bundle:
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
- Start with rich editor disabled
- Open rich editor in a popup

>These may be selected:
- Use toggle to switch between wikitext and rich editor
- Remember last toggle state

====================


About browser compatibility
===

**About versions of IE:**
- IE versions 7 or below will not work with this bundle.

- With IE8, IE9, IE10, IE11 browsers, DO NOT ENABLE browsers compatibility settings for your wiki site, if you do have them enabled then wysiwyg will not work.

**Browser versions known to work with this bundle of WYSIWYG:**
- IE8
- IE11
- FireFox (v26.0, v27.0, v28.0)
- Chrome (v.32.0.1700.76 m, v.33.0.1750.117 m, 33.0.1750.154 m)

- Recommended browser: FireFox
    