---------------------------------------------------------------------------------
Versions of ckeditor_source directory (updated 25.10.15 RL):
  Wysiwyg  1.5.6_0 [B551+25.10.2015]
  CKeditor 4.5.4   (5.10.2015 16:57 timestamp of version in git repository)

---------------------------------------------------------------------------------
This directory is intended for development and debug purposes only.
Do not use this in production environments.

Origin of files is "stable" release of github repository "ckeditor/ckeditor-dev" located at
https://github.com/ckeditor/ckeditor-dev.git.

---------------------------------------------------------------------------------
How to run source codes of CKeditor with WYSIWYG and MW...

1. Download stable version of CKeditor source files from github repository https://github.com/ckeditor/ckeditor-dev.git

2. Merge following files of Wysiwyg into source files of CKeditor:

 ckeditor_source\plugins\
   mediawiki
   mwtemplate
   smwqueryinterface
   smwrichmedia
   smwrule
   smwtoolbar
   smwwebservice
   textselection              #Heavily modified with MediaWiki, not fully functional
   texttransform              #Included in ckeditor runtime bundle but not in source bundle => manual download/update

 ckeditor_source\
   ckeditor.asp
   ckeditor.pack
   ckeditor.php
   ckeditor_php4.php
   ckeditor_php5.php          #It seems like this is the only one needed

3.
 ckeditor_source\
   config.js                  #Modified CKeditor setup with source files of CKeditor: all the installed plugins should be listed here

4.
 ckeditor_source\ckeditor.js  #CKEDITOR.skinName should be set to 'kama'.

5. Directory "ckeditor_source" should be copied to your wiki test environment and
   renamed to "ckeditor" (=> ".../WYSIWYG/ckeditor/").
   Verify that owner and group are set properly for copied directory based on your environment 
   (f.ex chown -R apache:apache ckeditor).

6. For compile purposes
 ckeditor_source\dev\builder\build-config.js #Set: "skin: 'kama'" and list all included plugins.

   
---------------------------------------------------------------------------------
How to compile CKeditor and WYSIWYG...

1. You need f.ex linux system (bash shell) with git and internet connection. 
   Build command "build.sh" requires java. It also may require connection to X-window system. 
   You may get java error messages in case X-window system is not set up properly in your terminal.
   
2. Prepare ckeditor_source directory using abowe procedure. Source files of CKeditor needs to be downloaded from github repository and merged with abowe WYSIWYG specific files. If you do not want to use git, you can also unpack .git.zip in order to build CKeditor directly (compilation requires internet connection).

3. Go to directory ckeditor_source/dev/builder

4. Modify skin of CKeditor to be "kama" (skin: 'kama',) in build-config.js (list of included plugins)

5. Compile using command: ./build.sh (may require X-server connection if used through ssh -session)

6. Compiled CKeditor with WYSIWYG specific files will be under directory "release/ckeditor" or in compressed zip and tar.gz files. 
   Compiled and minified version can be used to replace WYWIWYG/ckeditor of your mediawiki environment.
   Compiled and minified version gives faster responce times but error tracking is more difficult because of minified files.

7. Example of compile messages (files of CKBuilder were already downloaded by previous run):

[~@localhost builder]# ./build.sh
CKBuilder - Builds a release version of ckeditor-dev.

Checking/Updating CKBuilder...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0

Starting CKBuilder...

Setting version to 4.5.4
Cleaning up target folder
Copying files (relax, this may take a while)
    Time taken.....: 40.026seconds
Merging language files
    Time taken.....: 5.964seconds
Generating plugins sprite image
Building ckeditor.js
Minifying ckeditor.js
Created ckeditor.js (525KB)
    Time taken.....: 11.586seconds
Building skins
    Time taken.....: 4.717seconds
Cleaning up target folder

Creating compressed files...

    Created ckeditor_4.5.4.zip...: 2279651 bytes (43% of original)
    Created ckeditor_4.5.4.tar.gz: 1693142 bytes (32% of original)
    Time taken.....: 3.404seconds

==========================
Release process completed:

    Number of files: 1228
    Total size.....: 5344528 bytes
    Time taken.....: 65.901seconds


Release created in the "release" directory.
[~@localhost builder]#

---------------------------------------------------------------------------------
