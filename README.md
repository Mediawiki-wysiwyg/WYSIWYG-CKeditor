WYSIWYG-CKeditor
================

Mediawiki extension: WYSIWYG. Includes extension and other related modifed components.

These files are originally based on extension:WYSIWYG from MediaWiki site www.mediawiki.org

Environment:
  MediaWiki 1.22
  PHP 5.5.6, MySQL 5.6.14, Apache 2.4.7 (XAMPP for Linux 1.8.3-2)
  Browsers: IE11 and FireFox v26.0, Chrome

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

Versions of WYSIWYG sources [they all have CKEditor 3.6 (revision 6902)]:
1.5.6_0 [B551]  Version of WYSIWYG_MW_v1.20.2.zip and WYSIWYG_MV_v1.22.0.zip
1.7.0_2_PSA     Version of http://github.com/Ciges/CKEditor_in_MediaWiki (by Ciges IE10+MW.122)
1.7.2           Version of https://git.wikimedia.org/git/mediawiki/extensions/WYSIWYG.git (MediaWiki master)
                           (same as https://github.com/wikimedia/mediawiki-extensions-WYSIWYG)

-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

History of modifications (in reverse order):

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
