---------------------------------------------------------------------------------
Versions of _source directory (updated 09.01.15 RL):
  Wysiwyg  1.5.6_0 [B551+09.01.2015]
  CKeditor 4.4.5 revision 25cdcad

---------------------------------------------------------------------------------
This directory is intended for development and debug purposes only.
Do not use this in production environments.

Origin of files is "stable" release of github repository "ckeditor/ckeditor-dev" located at
https://github.com/ckeditor/ckeditor-dev.git.

---------------------------------------------------------------------------------
How to run source codes of CKeditor with WYSIWYG and MW...

1. Download stable version of CKeditor source files from github repository.

2. Merge following files of Wysiwyg into source files of CKeditor:

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

3.
 _source\ckeditor.js        #all the installed plugins should be listed here and CKEDITOR.skinName should be set to 'kama'.

4. Directory "_source" should be copied to your wiki test environment and
   renamed to "ckeditor" (=> ".../WYSIWYG/ckeditor/").
   Verify that owner and group are set properly for copied directory based on your environment (f.ex chown -R apache:apache ckeditor).

---------------------------------------------------------------------------------
How to compile CKeditor and WYSIWYG...

1. You need f.ex linux system (bash shell) with git and internet connection.

2. Prepare _source directory using abowe procedure. Source files of CKeditor needs to be downloaded from github repository and merged with abowe WYSIWYG specific files. If you do not want to use git, you can also unpack .git.zip in order to build CKeditor directly (compilation requires internet connection).

3. Go to directory _source/dev/builder

4. Modify skin of CKeditor to be "kama" (skin: 'kama',) in build-config.js

5. Compile using command: ./build.sh (may require X-server connection if used through ssh -session)

6. Compiled CKeditor with WYSIWYG specific files will be under directory "release/ckeditor". It can be used to replace WYWIWYG/ckeditor of your mediawiki environment.

---------------------------------------------------------------------------------
