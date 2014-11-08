
This directory is intended for development and debug purposes only.
Do not use this in production environments.

Origin of files is "stable" release of github repository "ckeditor/ckeditor-dev" located at
https://github.com/ckeditor/ckeditor-dev.git.


Directories and files below are needed to run source codes of CKeditor with WYSIWYG and MW.

1. Download stable version of CKeditor source files from github repository.

2. Merge following files into source files of CKeditor:

 _source\plugins\
   mediawiki
   mwtemplate
   smwqueryinterface
   smwrichmedia
   smwrule
   smwtoolbar
   smwwebservice

 _source\
   ckeditor.asp
   ckeditor.pack
   ckeditor.php
   ckeditor_basic.js
   ckeditor_basic_source.js
   ckeditor_php4.php
   ckeditor_php5.php
   ckeditor_source.js

 _source\
   config.js
   config.js_SOURCE   #Modified CKeditor setup with source files of CKeditor
   config.js_ORIG     #Original setup of CKeditor source files

3. Directory "_source" should be copied to your wiki test environment and
   renamed to "ckeditor" (=>".../WYSIWYG/ckeditor/").
