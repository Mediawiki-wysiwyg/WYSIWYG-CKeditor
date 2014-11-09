---------------------------------------------------------------------------------
Version of _source directory:
  07.11.2014 CKeditor 4.4.5 revision 25cdcad

---------------------------------------------------------------------------------
This directory is intended for development and debug purposes only.
Do not use this in production environments.

Origin of files is "stable" release of github repository "ckeditor/ckeditor-dev" located at
https://github.com/ckeditor/ckeditor-dev.git.

---------------------------------------------------------------------------------
How to run source codes of CKeditor with WYSIWYG and MW...

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
   ckeditor_php5.php        #It seems like this one is the only one needed
   ckeditor_source.js

 _source\
   config.js                #Modified CKeditor setup with source files of CKeditor
   config.js_SOURCE         #Copy of config.js
   config.js_ORIG           #Original setup of CKeditor source files

3. Directory "_source" should be copied to your wiki test environment and
   renamed to "ckeditor" (=>".../WYSIWYG/ckeditor/").


---------------------------------------------------------------------------------
How to compile CKeditor and WYSIWYG...

1. You need f.ex linux system (bash shell) with git and internet connection.

2. Prepare _source directory using abowe procedure (source files of CKeditor needs to be downloaded from github repository and merged with abowe WYSIWYG specific files).

3. Go to directory _source/dev/builder

4. Modify skin of CKeditor to be "kama" (skin: 'kama',) in build-config.js

5. Compile using command: ./build.sh

6. Compiled CKeditor with WYSIWYG specific files will be under directory "release/ckeditor". It can be used to replace WYWIWYG/ckeditor of your mediawiki environment.

---------------------------------------------------------------------------------
