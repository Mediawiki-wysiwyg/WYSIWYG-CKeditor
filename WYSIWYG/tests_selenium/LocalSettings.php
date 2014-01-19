<?php

# set permissions for registered users and anonymous
$wgGroupPermissions['*']['wysiwyg']=true;
$wgGroupPermissions['user']['wysiwyg']=true;

#Import SMW, SMWHalo
include_once('extensions/SemanticMediaWiki/includes/SMW_Settings.php');
enableSemantics('http://wiki', true);
 
include_once('extensions/SMWHalo/includes/SMW_Initialize.php');
enableSMWHalo('SMWHaloStore2');

# the FCK Editor itself
require_once('extensions/WYSIWYG/WYSIWYG.php');

