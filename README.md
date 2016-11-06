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
- installation instructions (MediaWiki, WYSIWYG, WikiEditor, SemanticForms)
- compatible browsers and browser settings

================

------------
History of modifications:
===

- 06.11.16  Fixed problem where html comment string was not restored properly when toggling source- button.  Version 1.5.6_0 [B551+06.11.2016].

- 19.08.16  Keep linefeeds with special elements (f.ex. the one created by TreeAndMenu- plugin). Version 1.5.6_0 [B551+19.08.2016].

- 16.08.16  Fixed problem with textselection- plugin: empty line was created by each wysiwyg-source toggle (with FF browser when editor did not have focus in wysiwyg mode). Version 1.5.6_0 [B551+16.08.2016].

- 15.08.16  Caption of images: support internal and external links inside caption, caption supports html and wikitext formatings, possible html formats are converted to wikitext. Version 1.5.6_0 [B551+15.08.2016].

- 09.08.16  Fixed "Uninitialized string offset: 0" error with pre- block. Fixed doubleclick hangup with references- placeholder (widget problem). Version 1.5.6_0 [B551+09.08.2016].

- 21.07.16  Minor fix with loading modules of WikiEditor. Version 1.5.6_0 [B551++21.07.2016].

- 21.07.16  Removed tooltip text (Rich Text Editor, wpTextbox1) in source- mode of wikitext view. Version 1.5.6_0 [B551+21.07.2016].

- 20.07.16  Fixed signature function. Version 1.5.6_0 [B551++20.07.2016].

- 20.07.16  Fixed problems with tables: crashed with save and source toggle; do not create extra columns. Enabled Templates- plugin by default. Version 1.5.6_0 [B551+20.07.2016].

- 14.07.16  Elements related to references (Cite- extension, ref- and references tags) in Wysiwyg- mode are now widgets: drag and drop of these elements is supported, elements are protected so that they can not be tampered with by mistake. Version 1.5.6_0 [B551+14.07.2016].

- 13.07.16  Replaced custom dataprocessor of Wysiwyg by standard dataprocessor of CKeditor: advanced content filtering (ACF) of CKeditor will now work (at this moment all kind of content is allowed by setting "config.allowedContent = true;" of config.js), this will also provide possibility for other plugins to work properly with Wysiwyg (f.ex Widget- plugin). Version 1.5.6_0 [B551+14.07.2016].

- 12.07.16  Update of CKEditor from version CKeditor 4.5.8 [revision c1fc9a9] to CKEditor 4.5.9 (revision a35abfe) (runtime- and source- files)) (added Widget- plugin). Version 1.5.6_0 [B551+14.07.2016].

- 11.07.16  Hide unsupported option for usage of popups with Wysiwyg in user preferences. Version 1.5.6_0 [B551+14.07.2016].

- 08.07.16  Do not allow editing of text within placeholders of category- elements. Reload buttons of WikiEditor. Elements related to references (Cite- extension) in Wysiwyg- mode are now text based elements (they were previously R- and References- special image- elements): placing pointer over reference shows text of reference as tooltip ("mouseover"), references are now numbered (ref- tags) and list of references are displayed as non-editable text- block at place of references- tag. Version 1.5.6_0 [B551+08.07.2016].

- 04.07.16  Fixed license information and desciption of extension. Version 1.5.6_0 [B551+04.07.2016].

- 04.07.16  LocalSettings.php: $wgCKEditorWikiEditorActive = true; Use this only with MW<=1.24: tells Wysiwyg that text based editor is WikiEditor. Version 1.5.6_0 [B551+04.07.2016].

- 02.07.16  Extension can be activated using wfLoadExtension- method (old require_once- method is supported too). Updated lists of magic words of MW. Fixed qty of parameters for makeFreeExternalLink. Version 1.5.6_0 [B551+02.07.2016].

- 01.07.16  Fixed Wysiwyg related js-variables when WikiEditor is started. Version 1.5.6_0 [B551++01.07.2016].

- 01.07.16  Fixed mw-config.get/set with js- variables related to html- comments. Version 1.5.6_0 [B551+01.07.2016].   

- 27.06.16  Replaced some deprecated methods with those compatible with MW1.27. Use mv.config.get/set with js-variables. Fixed error with data pasted from excel table. Fixed usage of classic editor and WikiEditor with toggle link (IE, FF, Chrome: added .htaccess files and reload of WikiEditor). Branch wysiwyg_mw127, version 1.5.6_0 [B551+27.06.2016]. 

- 25.06.16  Fixed regexec definition when pasting table from excel using IE. Version 1.5.6_0 [B551+25.06.2016].

- 11.06.16  Changed $wgResourceModules = array(.. to $wgResourceModules += array(.. because of IntraACL plugin (by 0x539 nero). Hide advanced- tab of table- dialog. Version 1.5.6_0 [B551+11.06.2016].

- 04.06.16  Fixed php parser error by changing [] => array() with js- variable. Version 1.5.6_0 [B551+04.06.2016].

- 03.05.16  Fixed version info. Version 1.5.6_0 [B551+03.05.2016].

- 03.05.16  Upgraded WikiEditor v0.4.0 (of MW 1.23.3) to v0.5.0 (of MW 1.26.2).

- 01.05.16  Fixed usage of formats with internal relative links to subpages. Version 1.5.6_0 [B551+01.05.2016].

- 30.04.16  Fixed relative links to internal subpages "[[../SomePage|LinkText]]". This makes fix "B551++24.04.2016" unnesessary, but it was left untouched. Version 1.5.6_0 [B551+30.04.2016].

- 24.04.16  Fixed issue with "[[../SomePage|LinkText]]" which was converted to "&#x5B;&#x5B;../SomePage|LinkText&#x5D;&#x5D;" in wikitext- mode. Version 1.5.6_0 [B551++24.04.2016].

- 24.04.16  Update of CKEditor from version CKeditor 4.5.4 [revision d4677a3] to CKeditor 4.5.8 [revision c1fc9a9] (runtime- and source files)). Removed some old samples (f.ex samples_old). Source files of pastetext- plugin not included with runtime files. Version 1.5.6_0 [B551+24.04.2016].

- 18.04.16  Updated instructions about using source files of CKeditor. Version 1.5.6_0 [B551+18.04.2016].

- 17.04.16  Fixed source mode of CKeditor: does not use resourceloader and requires setting variables $wgWYSIWYGSourceMode = true and $wgResourceLoaderDebug = true in LocalSettings.php (and rename ckeditor_source=>ckeditor). Version 1.5.6_0 [B551++17.04.2016].

- 27.03.16  Hide window of wikieditor when page is opened in Wysiwyg mode. Version 1.5.6_0 [B551++27.03.2016].

- 27.03.16  Parallel loading of modules with resourceloader. Modification with injected definitions for style sheets. Version 1.5.6_0 [B551+27.03.2016].

- 26.03.16  Fixed line deletion issue in case there were syntaxhighlight- block on page and view was toggled between Wysiwyg-wikitext multiple times. Version 1.5.6_0 [B551++26.03.2016].

- 26.03.16  Use resourceloader also with CKeditor: variable CKEDITOR_BASEPATH (javascript) fixed problems at start, variable $wgCKEditor_BASEPATH of LocalSettings.php can be used to change default path ('extensions/WYSIWYG/ckeditor/'). Removed functions InitializeScripts and ToggleScript because code has been earlier moved into ext.wysiwyg.func.js and ext.wysiwyg.init.js files. Changed start mode of editor to read-only. Source- button and toggle- link: show text "page is loading..." on editor area. Version 1.5.6_0 [B551+26.03.2016].

- 24.03.16  Changed definitions of ext.CKEDITOR (module is unused at this moment because of issues with file paths). Version 1.5.6_0 [B551+24.03.2016].

- 23.03.16  Modifications: resourceloader of MW, hybrid solution where javascript of ckeditor is injected directly on page while wysiwyg related javascripts are loaded using resourceloader of MW, variable $wgFCKEditor_delay_addonloadhook of LocalSettings.php removed. Source files of ckeditor seem to require setting $wgResourceLoaderDebug = true; in LocalSettings.php. Version 1.5.6_0 [B551+22.03.2016].

- 28.02.16  Modifications because of MW1.26: replaced deprecated calls of sajax_do_call and addOnloadHook. Known issue: async. loading of javascript files by MW1.26 may cause Wysiwyg fail when page is opened for editing => variable $wgFCKEditor_delay_addonloadhook of LocalSettings.php can be used to define delay in ms as temporary fix for this (f.ex 1000 = delay of 1s). Version 1.5.6_0 [B551+22.02.2016].

- 29.11.15  Fixed handling of space indented text (in MW wikitext mode) resulting pre- block in Wysiwyg mode (related to class _fck_mw_lspace and variable _inLSpace). Version 1.5.6_0 [B551+29.11.2015].

- 06.11.15  Fixed version data of Wysiwyg. Version 1.5.6_0 [B551+02.11.2015].

- 02.11.15  Fixed special characters of image names in wfSajaxGetImageUrl (by Aarakast 29.04.15). Cancelled previous File- prefix modification, because it is reserved for images in Wysiwyg. Version 1.5.6_0 [B551+02.11.2015].

- 01.11.15  Fixed copy-paste issue with table cells (by VA). Fixed File- prefix to act as link. Version 1.5.6_0 [B551+01.11.2015].

- 30.10.15  Modifications with table captions: added attribute support, fixed error which caused Wysiwyg to crash with table caption. Version 1.5.6_0 [B551+30.10.2015].

- 25.10.15  Updated version of CKeditor source files to version 4.5.4 [revision d4677a3]. Moved source- files of CKeditor-WYSIWYG into ckeditor_source- directory, removed old plugins and other files, updated compile-minify instructions. Fixed error of previous WYSIWYG versions from [B551+31.01.2015] to [B551+19.10.2015] which prevented WYSIWYG to start in source mode. Version 1.5.6_0 [B551+25.10.2015].

- 19.10.15  Update of CKEditor from version 4.5.1 [revision a513a92] to CKeditor 4.5.4 [revision d4677a3] (_source directory was not yet updated). In About- dialog of CKeditor, show also info about version of WYSIWYG. Version 1.5.6_0 [B551+19.10.2015].

- 01.09.15  Show names of categories in Wysiwyg mode (by Varlin 28.07.15). Fixed double click of category element and tooltip of category button in menu. Workaround to avoid manual modifications because of "protected property OutputPage". Version 1.5.6_0 [B551+01.09.2015].

- 07.07.15  Fixed in link dialog: when editing existing external link without separate display text (just save, no modifications), display text was changed to something like this "[1]". Version 1.5.6_0 [B551+07.07.2015].

- 06.07.15  Update of CKEditor from version 4.4.5 [revision 25cdcad] to CKeditor 4.5.1 [revision a513a92]. Version 1.5.6_0 [B551+13.03.2015].

- 06.07.15  Created branch CKeditor_v45 for update of CKeditor v4.5.1 [revision a513a92]. Version 1.5.6_0 [B551+13.03.2015].

- 13.03.15  Merge pull request #64 from Varlin/patch-27: French translation. Version 1.5.6_0 [B551+13.03.2015].

- 11.03.15  Created branch CKeditor_V4_Test for easier management of merged contributions. Fixed display of right version number. Version 1.5.6_0 [B551+07.03.2015].

- 10.03.15  Merged modifications of branch Syntaxhighlight-Nowiki-Pre into branch CKeditor_v4. Version 1.5.6_0 [B551+07.03.2015].

- 07.03.15  Modified place of class attribute "fck_mv_" with img-elements to be last one (tag:06.03.15). Version 1.5.6_0 [B551+07.03.2015].

- 06.03.15  Allow every kind of templates (batch-18 #51). Fix <caption> support ("titles" of tables, batch-20 #55). Set "$wgDefaultUserOptions['riched_use_popup'] = 0;" by default (batch-23 #58). Avoid getting an upper case to selflink, do not apply to category/property (batch-21 #56). Modified enabling/disabling link buttons (batch-22 #57).  All prev. modications by Varlin (tag:06.03.15). Version 1.5.6_0 [B551+06.03.2015].

- 05.03.15  Wysiwyg does not support IE versions below or eq. to IE8. Fixed double click error of pre- element when "$wgFCKEditorSpecialElementWithTextTags = 1". Fixed test when wikitext to html conversion can be started "editorSrcToWswTrigger = true". Removed one br- tag which caused extra line feeds when toggling source-wysiwyg mode. Version: 1.5.6_0 [B551+05.03.2015], branch CKeditor_v4_Nowiki-Synt-Pre (tags: Syntaxhighlight-Nowiki-Pre, "03.03.15").

- 26.02.15  Edit texts inside nowiki and syntaxhighlight tags directly on page: removed unnecessary html decode/encode calls. Version: 1.5.6_0  [B551++26.02.2015]. Branch CKeditor_v4_Nowiki-Synt-Pre (Syntaxhighlight-Nowiki-Pre).

- 26.02.15  Edit texts inside nowiki and syntaxhighlight tags directly on page: toolbar button to create/remove nowiki/syntaxhighlight format; variable "$wgFCKEditorSpecialElementWithTextTags = 1" in LocalSettings.php to get img- element with nowiki/syntaxhighlight tags. Icon of toolbar button for template- dialog changed. Version: 1.5.6_0  [B551+26.02.2015]. Branch CKeditor_v4_Nowiki-Synt-Pre (Syntaxhighlight-Nowiki-Pre).

- 23.02.15  Added language variables for link- and template- dialogs (by Varlin). Modified translations: fi, de. Version: 1.5.6_0  [B551+23.02.2015].

- 10.02.15  Fixed activation of undo/redo buttons when switching from source to Wysiwyg view.  Version: 1.5.6_0 [B551+10.02.2015].

- 08.02.15  Show paragraph format "Formatted" with light grey background. Version: 1.5.6_0 [B551+08.02.2015].

- 05.02.14  Created branch "CKeditor_v4_preTag" for tests of pre -tag etc and merged modifications of pre- tag (by rchouine). Fixed text corruption with sequential pre- tags. Use special element with pre- tags in case $wgFCKEditorSpecialElementWithPreTag = 1 in LocalSettings.php. Fixed extra line break with magic words like __TOC__ etc. Version: 1.5.6_0 [B551+05.02.2015].

- 04.02.15  Merged branch "CKeditor_v4_HtmlComments" to "CKeditor_v4". Version: 1.5.6_0 [B551+02.02.2015].

- 02.02.15  Fix with new category dialog in case name of category contains double quotes. Show text "Double-click to edit the value" with editable elements in Wysiwyg mode. Show link target as tooltip with external links. Show text of caption as tooltip with images. Version: 1.5.6_0 [B551+02.02.2015].

- 31.01.15  Removed modification "disabled unknown object message of CKeditor" which is not needed after new category dialog. Version: 1.5.6_0 [B551+31.01.2015].

- 24.01.15  Created new branch "CKeditor_v4_HtmlComments": fix for html comment -tags when commented block contains incomplete html code, catch exceptions in _getNodeFromHtml; fix for location of image file when defining original size of image; disabled unknown object message of CKeditor; fix for spaces in external link. Version: 1.5.6_0 [B551+24.01.2015].

- 24.01.15  Merged branch "CKeditor_v4_Category" to "CKeditor_v4" (=new dialog for category definitions). Version: 1.5.6_0 [B551+23.01.2015].

- 23.01.15  Fixed doubleclick problem with selection lists in new dialog of categories (by DavidBeaumier). Version: 1.5.6_0 [B551+23.01.2015].

- 22.01.15  Merged tooltip modifications of new category -dialog (by DavidBeaumier). Version: 1.5.6_0 [B551+22.01.2015].

- 20.01.15  Merged modifications of new category -dialog (by DavidBeaumier). Added support for selected user language. Version: 1.5.6_0 [B551+20.01.2015].

- 19.01.15  Created new branch "CKeditor_v4_Category" for modifications of new category dialog by DavidBeaumier.

- 12.01.15  Modified wikitext to html conversions so that toHtml function is not called unnecessarily two times (with page is opening, source button and toggle link). Keep editor in read-only mode and buttons of Wysiwyg menu disabled during wysiwyg-wikitext conversion in both directions (this has visible effect with big wiki pages, when conversion takes long time). Added partial support of text "Page is loading, please wait...". Version: 1.5.6_0 [B551+12.01.2015].

- 09.01.15  Updated WYSIWYG\ckeditor\_source directory. Version: 1.5.6_0 [B551+09.01.2015].

- 04.01.15  Modification related to formats of link texts (old "B551+27.12.2014"). Version: 1.5.6_0 [B551+04.01.2015].

- 02.01.15  Cancelled modification related to formats of link texts (old "B551+27.12.2014"), because it caused problems with html related characters '&', '"', '\'', '<', '>' which were used in other texts than links. Version: 1.5.6_0 [B551+02.01.2015].

- 31.12.14  Modifications with image dialog: canceled use of default size with images; width and height can both be specified, only one of them or none of them; size definition "upright"; horizontal alignment "none"; vertical alignments "baseline, sub, super, top, text-top, middle, bottom, text-bottom"; link target (external or internal); disable link. Merged some french translations (by Varlin). Version: 1.5.6_0 [B551+31.12.2014].

- 30.12.14  Fixed resizing of image which did not always work with FF (related to merged modification of batch-9 "Fix resizing problem in Firefox #17" at 27.08.14). If size has not been given in dialog, use (and display) default size of the image. Version: 1.5.6_0 [B551+30.12.2014].

- 27.12.14  Fixed use of formats italic, bold and undeline inside display text of internal/external link. Version: 1.5.6_0 [B551+27.12.2014].

- 23.12.14  Fixed handling of image link in case image file is not yet available in MW and link is edited in Wysiwyg (=noimage.png is always considered internal link). Version: 1.5.6_0 [B551+++23.12.2014].

- 23.12.14  Fixed clearing preview of image (uploading of new image failed). Version: 1.5.6_0 [B551++23.12.2014].

- 23.12.14  When existing image is double clicked, display preview of image in image dialog. Version: 1.5.6_0 [B551+23.12.2014].

- 22.12.14  Fixed issue with caption: in case existing image was double clicked, caption was lost (by Aarakast). Version: 1.5.6_0 [B551+22.12.2014].

- 12.12.14  Updated version info: 1.5.6_0 [B551+12.12.2014]

- 12.12.14  Fixed handling of sort key with categories: earlier spaces in category name caused sort key to be name of category, now sort key obeys name of page by default.

- 11.12.14  Fixed French translation (by Varlin, commit b5bc0784af2b4e481d6195439a733ed78bce8874 [b5bc078]). Fixed $wgGroupPermissions in sample LocalSettings.php below (by nemobis).

- 05.12.14  Fixed handling of some special characters (f.ex: '&' and '"') with category -dialog (character '_' will still be converted to space).

- 26.11.14  Added possibility to use mediawiki variables, f.ex ROOTPAGENAME, with internal links. Added new variable names and magic words of latest MW versions.

- 25.11.14  Fixed handling of empty lines inside numbered and bulleted lists.

- 23.11.14  Fixed tag- dialog (try to parse any simple tags of wikitext unknown to Wysiwyg): pass name of attributes of wikitags to special.js using own special attribute (_fck_mw_tagattributes); removed extension specific predefined attribute list; do not use tag names of MW in tag -dialog (except converting source -tag to syntaxhighlight -tag).

- 21.11.14  It is possible to enter also template definition with tag -dialog (template dialog, template.js, is preferred method to work with template definitions).

- 21.11.14  Fixed data of gallery -tag to be edited with tag -dialog (tag is displayed as gallery -element in Wysiwyg). Enabled use of attributes for hovergallery -tag (tag is displayed as special -element in Wysiwyg).

- 20.11.14  Fixed tag- dialog: support comments -tag (about 99% compatible); try to parse any simple tags of wikitext unknown to Wysiwyg.

- 20.11.14  Fixed tag- dialog: allow more advanced tag definitions in tag -dialog; reactivated text-html-text conversions using browser (related to fix dated 19.11.14 below); use tag -dialog to edit math -formulas. Changed handling of math -element from img- to span- tag making it identical with other similar elements of Wysiwyg.

- 19.11.14  Fixed tag- dialog: support multiple nested tags of wikitext or html syntax by converting inserted text to html format (related to fix dated 30.10.14 below).

- 17.11.14  Modified Wysiwyg to work with poll- extension (by default all unkown simple wikitext tags should now work as "special" -element).

- 07.11.14  Updated CKBuilder and run instructions of _source directory. Fixed CKBuilder warnings with smwtoolbar/plugin.js. Added command _source/dev/builder/build_leave-js-unminified.sh.

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

- MediaWiki: 1.21, 1.22, 1.23, 1.24, 1.25, 1.26, 1.27.
- SemanticForms: 2.7
- SyntaxHighlight GeSHi: version must be >= rev:50696
- PHP 5.5.6,  MySQL 5.6.14, Apache 2.4.7  (=XAMPP for Linux 1.8.3-2)
- PHP 5.5.15, MySQL 5.6.20, Apache 2.4.10 (=XAMPP for Linux 1.8.3-5)

-----------------
**File: LocalSettings.php**

Make sure your LocalSettings.php has been set up properly, certain name spaces should be excluded from wysiwyg by default and some of the other settings should be in specific way for wysiwyg and wikieditor to work together. Activation of wysiwyg -extension using require_once( ... ) should be the last of all extensions in your LocalSettings.pgp so that wysiwyg will know all possible tag names of other extensions.

    #02.07.16->
    #Enable WYSIWYG- extension,	MW >= 1.25
    wfLoadExtension( 'WYSIWYG' ); 
    #02.07.16<-

    #10.11.13->
    #Enable WYSIWYG- extension,	MW <= 1.24 (with newer versions will use wfLoadExtension, if supported)
    #require_once( "$IP/extensions/WYSIWYG/WYSIWYG.php" );
    #10.11.13->
	
    #13.11.13->
	#WikiEditor may not be compatible with WYSIWYG editor, use it with caution.
	#WikiEditor vers. <= 0.4.0
    #require_once( "$IP/extensions/WikiEditor/WikiEditor.php" );    
	
	#WikiEditor vers. >= 0.5.0
	#wfLoadExtension( 'WikiEditor' );
	
	#Use this only with MW<=1.24: tells wysiwyg that text based editor is WikiEditor
	#$wgCKEditorWikiEditorActive = true;  

    # Examples of setting permissions using $wgGroupPermissions, for more detailed explanation see:
    #   https://www.mediawiki.org/wiki/Manual:$wgGroupPermissions#Example
    # $wgGroupPermissions['user']['wysiwyg'] = true; //Only registered users are allowed to use wysiwyg
    # $wgGroupPermissions['*']['wysiwyg'] = true;    //Everyone is allowed to use wysiwyg
    $wgGroupPermissions['*']['wysiwyg'] = true;

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

    #These are for SemanticForms. Wysiwyg is not fully compatiple with SemanticForms and SemanticMediawiki,
	#so this is experimental feature.
    #enableSemantics( );
    #include_once( "$IP/extensions/SemanticForms/SemanticForms.php" );

    #Optional excludes of wysiwyg in case SemanticForms and SemanticMediawiki are installed:
    #$wgFCKEditorExcludedNamespaces[] = SF_NS_FORM;
    #$wgFCKEditorExcludedNamespaces[] = SMW_NS_PROPERTY;
    #27.03.14<-

    #06.02.15->
    #Setting value of following variables eq. to 1 will cause wikitext text blocks
    #within specified tags to be displayed as image- element in wysiwyg mode.
    #Value eq. to 0 makes texts inside these tags editable directly as text in wysiwyg mode
    #using pre- parent tag + child tag.
    $wgFCKEditorSpecialElementWithPreTag   = 0; // 1= <pre> tags with attributes only => img- element
    #06.02.15<-

    #26.02.15->
    $wgFCKEditorSpecialElementWithTextTags = 0; // 1= <nowiki>, <source> and <syntaxhighlight> tags => img- element
    #26.02.15<-

	#24.03.16->
	#In case CKEDITOR is installed in some special place, define installation path
	#with $wgCKEditor_BASEPATH. If variable is undefined, default value is 'extensions/WYSIWYG/ckeditor/'.
	#NOTE! Path must end with character '/' in linux (opsys. windows is untested).
	#$wgCKEditor_BASEPATH = 'extensions/WYSIWYG/ckeditor/';

	#Debug- mode of resource loader (use only for testing purposes):
    #$wgResourceLoaderDebug = true;
	#24.03.16<-

	#17.04.16->
	#In case source files of WYSIWYG/CKeditor are used, they will work only if wgWYSIWYGSourceMode is set to true.
	#NOTE! At this point source- mode of WYSIWYG/Ckeditor does not use resourceloaded of MW.
	#$wgWYSIWYGSourceMode = true;
	#17.04.16<-


--------------
**WikiEditor:**

You should replace at least this file in WikiEditor extension of MW with modified file of this bundle:
- WikiEditor/modules/ext.wikiEditor.toolbar.js

--------------
**SemanticForms:**

NOTE! This extension is not mandatory with wysiwyg extension.
Wysiwyg is not fully compatiple with SemanticForms and SemanticMediawiki.

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
- IE versions 8 or below may not fully work with this bundle.

- With IE9, IE10, IE11 browsers, DO NOT ENABLE browsers compatibility settings for your wiki site, if you do have them enabled then wysiwyg will not work.

**Browser versions known to work with this bundle of WYSIWYG:**
- IE11
- FireFox (26.x - 48.x)
- Chrome  (v.32.x, v.52.x)

- Recommended browser: FireFox

