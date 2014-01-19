<?php
/**
 * Applies a patch file. Files are denoted by relative paths, a directory
 * which make this paths absolute is provideded as parameter. As well as the
 * patch file itself.
 *
 *  Usage: php patch.php -d <wiki path> -p <patch file>
 *
 * Both are absolute paths
 *
 * @author: Kai K�hn / ontoprise / 2009
 */

$reversePatch = "";
$dryRun = "";
$onlypatch = false;
$returnCode = 0;
$patchTool = "patch";

// prevent that the script can be started from the webserver
 if (array_key_exists('SERVER_NAME', $_SERVER) && $_SERVER['SERVER_NAME'] != NULL) {
    echo "Run this script from the command line only";
    exit();
}

// get parameters
for( $arg = reset( $argv ); $arg !== false; $arg = next( $argv ) ) {
	//-d => absolute path to extend relative
	if ($arg == '-d') {
		$absPath = next($argv);
		continue;
	}
	//-p => patch file
	if ($arg == '-p') {
		$patchFile = next($argv);
		continue;
	}
    
	//-r => reverse patch
    if ($arg == '-r') {
       $reversePatch = "-R";
        continue;
    }
    
    //--dry => reverse patch
    if ($arg == '--dry-run') {
        $dryRun = "--dry-run";
        continue;
    }
    //--onlypatch => only patch output
    if ($arg == '--onlypatch') {
        $onlypatch = true;
        continue;
    }
    
    //--no error
    if ($arg == '--noerror') {
        $noerror = true;
        continue;
    }
    
    //--location of patch tool
    if ($arg == '--patchtool') {
        $patchTool = next($argv);
        continue;
    }
}

// usage message if wrong or missing params
if (!isset($absPath) || !isset($patchFile)) {
	echo "\nUsage: php patch.php -d <wiki path> -p <patch file>\n";
	die();
}

// make platform independant paths
$absPath = trim(str_replace("\\","/", $absPath));
$patchFile = trim(str_replace("\\","/", $patchFile));
if (substr($absPath, -1) != '/') $absPath .= "/";

if (!$onlypatch) echo "\nRead patch file:\n $patchFile";
$patchFileContent = file_get_contents($patchFile);

// split patch file in array of single patches for each file.
$patches = $patchFileContent = preg_split('/Index:\s+(.+)[\n|\r\n]+=+[\n|\r\n]+/', $patchFileContent);

foreach($patches as $p) {
	if ($p == '') continue;

	// get (relative path of) file to patch
	preg_match('/\+\+\+\s+([^\s]+)/', $p, $matches);
	$path = dirname($matches[1]);
	 
	if (!$onlypatch) echo "\nApplying patch to:\n $matches[1]";
	if (isWindows()) {
		// make sure patch file is windows style
		$p = str_replace("\r\n","\n",$p);
		$p = str_replace("\n","\r\n",$p);
	} else {
		// make sure patch file is unix style
		$p = str_replace("\r\n","\n",$p);
	}

	// write patch file
	if (!$onlypatch) echo "\nWrite patch file:\n $absPath$path/__patch__.txt";
	$handle = fopen($absPath.$path.'/__patch__.txt', 'w');
	fwrite($handle, $p);
	fclose($handle);
    
	/*
	 * GNU-Patch parameters:
	 * 
	 * -u: unified format
	 * -l: ignore whitespaces
	 * -t: batch (no questions)
	 * -s: quiet
	 * -f: Like -t, but ignore bad-Prereq patches, and assume unreversed.
	 * -no-backup-if-mismatch: Back up mismatches only if otherwise requested.
	 * -i patch file
	 * -d directory of patch file
	 * -R reverse patch
	 */
	
	// run patch
	//Note that if the array already contains some elements, exec() will append to the end of the array. 
	//If you do not want the function to append elements, call unset() on the array before passing it to exec().
	unset($out); 
	if (!$onlypatch) echo "\nExecute patch:\n ".'patch -u -l -f -s '.$dryRun.' '.$reversePatch.' --no-backup-if-mismatch -i __patch__.txt -d "'.$absPath.$path.'"';
	exec($patchTool.' -u -l -f -s '.$dryRun.' '.$reversePatch.' --no-backup-if-mismatch -i __patch__.txt -d "'.$absPath.$path.'"', $out, $ret);
	
	foreach($out as $line) print "\n".$line;
	
	// delete patch file
	if (!$onlypatch) echo "\nDelete patch file:\n ".$absPath.$path.'/__patch__.txt';
	unlink($absPath.$path.'/__patch__.txt');
	
	if (!$onlypatch) echo "\n------------\n";
	$returnCode = $returnCode != 0 ? $returnCode : $ret;
}
exit(isset($noerror) && $noerror === true ? 0 : $returnCode);

function isWindows() {
	static $thisBoxRunsWindows;

	if (! is_null($thisBoxRunsWindows)) return $thisBoxRunsWindows;

    date_default_timezone_set('UTC');
	ob_start();
	phpinfo();
	$info = ob_get_contents();
	ob_end_clean();
	//Get Systemstring
	preg_match('!\nSystem(.*?)\n!is',strip_tags($info),$ma);
	//Check if it consists 'windows' as string
	if (preg_match('/[Ww]indows/',$ma[1])) {
		$thisBoxRunsWindows = true;
	} else {
		$thisBoxRunsWindows= false;
	}
	return $thisBoxRunsWindows;
}
?>