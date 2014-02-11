WYSIWYG-CKeditor
================

Mediawiki extension: WYSIWYG. Includes extension and other related modifed components.
These files are originally based on extension:WYSIWYG from MediaWiki site www.mediawiki.org

If you plan to use this bundle in your enviroment, requirement is that you will give feedback and description of your environment here:
https://www.mediawiki.org/wiki/Extension_talk:WYSIWYG#Version_of_source_bundles_38239


Environment:
  MediaWiki: 1.22.0, 1.22.1, 1.22.2
  PHP 5.5.6, MySQL 5.6.14, Apache 2.4.7 (XAMPP for Linux 1.8.3-2)
  Browsers: IE8, IE11 and FireFox (v26.0, v27.0), Chrome (32.0.1700.102 m)

  NOTE! IE11 requires that on page "Tools=>Compatibility View settings" option "Display intranet sites in compatibility view"
        is selected (in case your wiki is internal or add site name to the list if it is external).
        With this setting on wysiwyg works ok with IE11. If setting is deselected that setting in IE11,
        wysiwyg editor won't start and it reverts to wikieditor.

Origin of source bundle:
1. Version of WYSIWYG files were taken intially for MW 1.21 from here:
   https://docs.google.com/file/d/0B-aiZzKTmWI2bG8yVzBCOWNLamM/view?pli=1
   (WYSIWYG_MW_v1.20.2.zip)

2. Some modifications have been adapted into it from here:
   https://drive.google.com/file/d/0B-aiZzKTmWI2Q0wyd3FMRVpuZWM/view?pli=1
   (WYSIWYG_MV_v1.22.0.zip).

3. Further modifications where added on top of these.
   They include f.ex <reference> by Varlin taken from here
   http://wikirouge.net/nowiki/mediawiki/WYSIWYG/
   and some additional modifications made by me: category, image etc...

For more information of source bundle and their versions, see:
  https://www.mediawiki.org/wiki/Extension_talk:WYSIWYG#Version_of_source_bundles_38239
  https://www.mediawiki.org/wiki/Extension:WYSIWYG

-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

History of modifications on top of abowe "1.5.6_0 [B551]" (in reverse order):

10.02.14  Fixed two IE8 compatibility issues:

          -tagged/numbered list emptied the page when saving page or changing into wikitext mode

          -ref.js dialog crashed, unable to save definition

06.02.14  Modified fix for IE 11 with Category.js

04.02.14  Tag -dialog (special.js) with variables of MW

03.02.14  Double clicking template image dialog (template.js)

17.01.14  WYSIWYG -editor together with WIkiEditor extension

10.01.14  <Ref> dialog: translations
          image -dialog: width ja height values from image, resize image in edit mode

10.01.14  Category -button and dialog

09.01.14  Positions of [edit] link with headers

03.01.14  Ref, References -buttons

16.12.13  WYSIWYG_MV_v1.22.0.zip

          WYSIWYG / IE11:n "numbered and bulleted" list

          WYSIWYG / IE 11: Category -definition

          IE11 html format 'IE=9' /opt/lampp/htdocs/mediawiki/includes/OutputPage.php

05.12.13  MW 1.21.2 => 1.22.0

10.11.13  MW 1.21.2, WYSIWYG_MW_v1.20.2.zip + manual fixes based on talk page of extension:wysiwyg

------------------------------------------------------------------------------
