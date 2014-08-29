<?php
/**
 * AJAX functions used by CKeditor extension
 */
/**
 * Function converts an Javascript escaped string back into a string with
 * specified charset (default is UTF-8).
 * Modified function from http://pure-essence.net/stuff/code/utf8RawUrlDecode.phps
 *
 * @param $source String escaped with Javascript's escape() function
 * @param $iconv_to String destination character set will be used as second parameter
 * in the iconv function. Default is UTF-8.
 * @return string
 */
function js_unescape( $source, $iconv_to = 'UTF-8' ) {
        $decodedStr = '';
        $pos = 0;
        $len = strlen ( $source );

        while ( $pos < $len ) {
                $charAt = substr ( $source, $pos, 1 );
                if ( $charAt == '%' ) {
                        $pos++;
                        $charAt = substr ( $source, $pos, 1 );

                        if ( $charAt == 'u' ) {
                                // we got a unicode character
                                $pos++;
                                $unicodeHexVal = substr ( $source, $pos, 4 );
                                $unicode = hexdec ( $unicodeHexVal );
                                $decodedStr .= code2utf( $unicode );
                                $pos += 4;
                        } else {
                                // we have an escaped ascii character
                                $hexVal = substr ( $source, $pos, 2 );
                                $decodedStr .= chr ( hexdec ( $hexVal ) );
                                $pos += 2;
                        }
                } else {
                        $decodedStr .= $charAt;
                        $pos++;
                }
        }

        if ( $iconv_to != "UTF-8" ) {
                $decodedStr = iconv( "utf-8", $iconv_to, $decodedStr );
        }

        return $decodedStr;
}

function wfSajaxGetMathUrl( $term ) {
	$originalLink = MathRenderer::renderMath( $term );

	if( false == strpos( $originalLink, 'src="' ) ) {
		return '';
	}

	$srcPart = substr( $originalLink, strpos( $originalLink, "src=" ) + 5 );
	$url = strtok( $srcPart, '"' );

	return $url;
}

function wfSajaxGetImageUrl( $term ) {
	global $wgExtensionFunctions, $wgTitle;

	$options = new CKeditorParserOptions();
	$options->setTidy( true );
	$parser = new CKeditorParser();

	if( in_array( 'wfCite', $wgExtensionFunctions ) ) {
		$parser->setHook( 'ref', array( $parser, 'ref' ) );
		$parser->setHook( 'references', array( $parser, 'references' ) );
	}
	$parser->setOutputType( OT_HTML );
	$originalLink = $parser->parse( '[[File:' . $term . ']]', $wgTitle, $options )->getText();
	if( false == strpos( $originalLink, 'src="' ) ) {
		return '';
	}

	$srcPart = substr( $originalLink, strpos( $originalLink, "src=" )+ 5 );
	$url = strtok( $srcPart, '"' );
    if (substr($url, -(strlen($term))) == $term)
        return $url;
    return "";
}

function wfSajaxSearchSpecialTagCKeditor( $empty ) {
	global $wgParser, $wgRawHtml;

	$ret = "nowiki\nincludeonly\nonlyinclude\nnoinclude\ngallery\n";
	if( $wgRawHtml ){
		$ret.= "html\n";
	}
	$wgParser->firstCallInit();
	foreach( $wgParser->getTags() as $h ) {
		if( !in_array( $h, array( 'pre', 'math', 'ref', 'references' ) ) ) {
			$ret .= $h . "\n";
		}
	}
	$arr = explode( "\n", $ret );
	sort( $arr );
	$ret = implode( "\n", $arr );

	return $ret;
}

function wfSajaxSearchImageCKeditor( $term ) {
	global $wgContLang;
	$limit = 40;

	$term = $wgContLang->checkTitleEncoding( $wgContLang->recodeInput( js_unescape( $term ) ) );
	$term1 = str_replace( ' ', '_', $wgContLang->ucfirst( $term ) );
	$term2 = str_replace( ' ', '_', $wgContLang->lc( $term ) );
	$term3 = str_replace( ' ', '_', $wgContLang->uc( $term ) );
	$term4 = str_replace( ' ', '_', $wgContLang->ucfirst( $term2 ) );
	$term = $term1;

	$dbr = wfGetDB( DB_SLAVE );
    // nothing yet typed in, get all images (actually up to $limit only)
   	if ( strlen( str_replace( '_', '', $term ) ) < 1 )
        $res = $dbr->select( 'page',
            'page_title',
    		array(
        		'page_namespace IN (' . NS_IMAGE . ',' . NS_FILE . ')'
            ),
            __METHOD__,
            array( 'LIMIT' => $limit + 1 )
        );
    // get list depending on the input
    else
        $res = $dbr->select( 'page',
            'page_title',
    		array(
        		'page_namespace IN (' . NS_IMAGE . ',' . NS_FILE . ')',
            	"page_title LIKE '%". $dbr->strencode( $term1 ) ."%'".
				"OR (LOWER(CAST(page_title AS CHAR)) LIKE '%". $dbr->strencode( $term2 ) ."%') ". //29.08.14 RL MySql+Postgres:convert(.,.)->cast(.AS.)
    			"OR (UPPER(CAST(page_title AS CHAR)) LIKE '%". $dbr->strencode( $term3 ) ."%') ". //29.08.14 RL MySql+Postgres:convert(.,.)->cast(.AS.)
        		"OR (page_title LIKE '%". $dbr->strencode( $term4 ) ."%') "
            ),
            __METHOD__,
            array( 'LIMIT' => $limit + 1 )
        );

	$ret = array();
	$i = 0;
	while ( ( $row = $dbr->fetchObject( $res ) ) && ( ++$i <= $limit ) ) {
        $pos = strrpos($row->page_title, '.');
        if ($pos === false) continue;
        $suffix = strtolower(substr($row->page_title, $pos + 1));
        if (! in_array($suffix,
                array('gif', 'jpg', 'jpeg', 'tif', 'tiff', 'svg', 'png')))
            continue;
		$ret[] = $row->page_title;
	}
    if (count($ret) == $limit )
        $ret[]= '___TOO__MANY__RESULTS___';

	return join("\n", $ret);
}

function wfSajaxSearchArticleCKeditor( $term ) {
	global $wgContLang, $wgExtraNamespaces;
	$limit = 30;
	$ns = array(NS_MAIN, NS_CATEGORY, NS_IMAGE, NS_TEMPLATE, NS_USER);
    if (defined('SF_NS_FORM')) $ns[]= SF_NS_FORM;
    if (defined('SMW_NS_PROPERTY')) $ns[]= SMW_NS_PROPERTY;

	$term = $wgContLang->checkTitleEncoding( $wgContLang->recodeInput( js_unescape( $term ) ) );
    $prefix = "";

    if ( $term[0] == ':' ) {
        $prefix= ':';
        $term= substr($term, 1);
    }
    $pos= strpos($term, ':');
    if ( $pos !== false ) {
        $nsName = strtolower(substr($term, 0, $pos));
        foreach ($ns as $idx) {
            if (strtolower(MWNamespace::getCanonicalName($idx)) == $nsName) {
                $prefix.= MWNamespace::getCanonicalName($idx) . ':';
                $term= substr($term, $pos + 1);
                $ns = array($idx);
                break;
            }
        }
    }
	if( strpos( strtolower( $term ), 'image:' ) === 0 ) {
		$ns = array(NS_IMAGE);
		$term = substr( strtolower( $term ), 6 );
		$prefix .= 'Image:';
	} else if( strpos( $term, ':' ) && is_array( $wgExtraNamespaces ) ) {
		$pos = strpos( $term, ':' );
		$find_ns = array_search( substr( $term, 0, $pos ), $wgExtraNamespaces );
		if( $find_ns ) {
			$ns = array($find_ns);
			$prefix .= substr( $term, 0, $pos + 1 );
			$term = substr( $term, $pos + 1 );
		}
	}

	$term1 = str_replace( ' ', '_', $wgContLang->ucfirst( $term ) );
	$term2 = str_replace( ' ', '_', $wgContLang->lc( $term ) );
	$term3 = str_replace( ' ', '_', $wgContLang->uc( $term ) );
	$term4 = str_replace( ' ', '_', $wgContLang->ucfirst( $term2 ) );
	$term = $term1;

	if ( ( strlen( str_replace( '_', '', $term ) ) < 1 ) && ( count($ns) > 1 ) ) {
		return '';
	}

    $dbr = wfGetDB( DB_SLAVE );
	$res = $dbr->select(
        'page',
        'page_title, page_namespace',
        array(
			'page_namespace in ('.implode(',', $ns).') and '.
			"( page_title LIKE '%". $dbr->strencode( $term1 ) ."%' ".
			"OR (LOWER(CAST(page_title AS CHAR)) LIKE '%". $dbr->strencode( $term2 ) ."%') ". //29.08.14 RL MySql+Postgres:convert(.,.)->cast(.AS.)
			"OR (UPPER(CAST(page_title AS CHAR)) LIKE '%". $dbr->strencode( $term3 ) ."%') ". //29.08.14 RL MySql+Postgres:convert(.,.)->cast(.AS.)
			"OR (page_title LIKE '%". $dbr->strencode( $term4 ) ."%') )"
		),
		__METHOD__,
		array( 'LIMIT' => $limit + 1 )
	);
	$ret = array();
	$i = 0;
	while ( ( $row = $dbr->fetchObject( $res ) ) && ( ++$i <= $limit ) ) {
        $title = '';
		if( isset( $prefix ) && !is_null( $prefix ) ) {
			$title .= $prefix;
		}
        else if ($row->page_namespace != NS_MAIN) {
            $title .= MWNamespace::getCanonicalName($row->page_namespace).':';
        }
        $title .= $row->page_title;
		$ret[]= $title;
	}
    // if we have not yet enough results, check the special pages
    if (count($ret) < $limit && $term2 != "") {
        global $wgSpecialPages;
        $specialPages = array_keys($wgSpecialPages);
        foreach ($specialPages as $page) {
            if (strpos(strtolower($page), $term2) !== FALSE ||
                strpos(strtoupper($page), $term3) !== FALSE )
                $ret[] = MWNamespace::getCanonicalName(NS_SPECIAL).':'.$page;
        }
    }
	return join("\n", $ret);
}

function wfSajaxSearchCategoryCKeditor( $term ){  //09.01.14 RL $term added

	global $wgContLang;                           //09.01.14 RL
	$term = $wgContLang->checkTitleEncoding( $wgContLang->recodeInput( js_unescape( $term ) ) ); //09.01.14 RL
	$ns = NS_CATEGORY;                            //=14
	$dbr = wfGetDB( DB_SLAVE );
	/** @todo FIXME: should use Database class */

	//09.01.14 RL->
	$term1 = $wgContLang->ucfirst( $term );
	$term2 = $wgContLang->lc( $term );
	$term3 = $wgContLang->uc( $term );
	$term4 = $wgContLang->ucfirst( $term2 );
	$term  = $term1;	

	if( $term != "" ) {
		// $search will be added to mysql query string below
		$searchr = 	"AND ( tmpSelectCat1.cl_to LIKE '%".$dbr->strencode( $term1 )."%' ".
							"OR (LOWER(CAST(tmpSelectCat1.cl_to AS CHAR)) LIKE '%".$dbr->strencode( $term2 )."%') ". //29.08.14 RL MySql+Postgres:convert(.,.)->cast(.AS.)
							"OR (UPPER(CAST(tmpSelectCat1.cl_to AS CHAR)) LIKE '%".$dbr->strencode( $term3 )."%') ". //29.08.14 RL MySql+Postgres:convert(.,.)->cast(.AS.)
							"OR (tmpSelectCat1.cl_to LIKE '%".$dbr->strencode( $term4 )."%') ".
						") ";
	} else {
		$searchr = 	"";
	}
	//09.01.14 RL<-

	$m_sql = "SELECT tmpSelectCat1.cl_to AS title FROM ".$dbr->tableName('categorylinks')." AS tmpSelectCat1 ".
		"LEFT JOIN ".$dbr->tableName('page')." AS tmpSelectCatPage ON ( tmpSelectCat1.cl_to = tmpSelectCatPage.page_title ".
		"AND tmpSelectCatPage.page_namespace =$ns ) ".
		"LEFT JOIN ".$dbr->tableName('categorylinks')." AS tmpSelectCat2 ON tmpSelectCatPage.page_id = tmpSelectCat2.cl_from ".
		"WHERE tmpSelectCat2.cl_from IS NULL ".
		$searchr." ".                            //14.01.14 RL
		"GROUP BY tmpSelectCat1.cl_to";
	
	$res = $dbr->query( $m_sql, __METHOD__ );

	$ret = '';
	$i = 0;
	while ( ( $row = $dbr->fetchObject( $res ) ) ) {
		$ret .= $row->title . "\n";
		$sub = explode( "\n", wfSajaxSearchCategoryChildrenCKeditor( $row->title ) );
		foreach( $sub as $subrow )
			if( strlen( $subrow ) > 0 )
				$ret.= ' ' . $subrow . "\n";
	}

	return $ret;
}

function wfSajaxSearchCategoryChildrenCKeditor( $m_root ){
	$limit = 50;
	$ns = NS_CATEGORY;
	$dbr = wfGetDB( DB_SLAVE );
	/// @todo FIXME: should use Database class
	$sql = "SELECT tmpSelectCatPage.page_title AS title FROM ".$dbr->tableName('categorylinks')." AS tmpSelectCat ".
			"LEFT JOIN ".$dbr->tableName('page')." AS tmpSelectCatPage ON tmpSelectCat.cl_from = tmpSelectCatPage.page_id ".
			"WHERE tmpSelectCat.cl_to LIKE ".$dbr->addQuotes($m_root)." AND tmpSelectCatPage.page_namespace = $ns"; 

	$res = $dbr->query( $sql, __METHOD__ );
	$ret = '';
	$i = 0;
	while ( ( $row = $dbr->fetchObject( $res ) ) ) {
		$ret .= $row->title . "\n";
		$sub = explode( "\n", wfSajaxSearchCategoryChildrenCKeditor( $row->title ) );
		foreach( $sub as $subrow )
			if( strlen( $subrow ) > 0 )
				$ret.= ' ' . $subrow . "\n";
	}

	return $ret;
}

function wfSajaxSearchTemplateCKeditor( $empty ) {
	$dbr = wfGetDB( DB_SLAVE );
	$res = $dbr->select( 'page',
		'page_title',
		array( 'page_namespace' => NS_TEMPLATE ),
		__METHOD__,
		array( 'ORDER BY' => 'page_title' )
	);

	$ret = '';
	while ( $row = $dbr->fetchObject( $res ) ) {
		$ret .= $row->page_title . "\n";
	}

	return $ret;
}

function wfSajaxWikiToHTML( $wiki, $title = '' ) {
	global $wgTitle;

    if ($title)
        $wgTitle = Title::newFromText($title);

	$options = new CKeditorParserOptions();
	$options->setTidy( true );
	$parser = new CKeditorParser();
	$parser->setOutputType( OT_HTML );

	wfSajaxToggleCKeditor( 'show' ); // FCKeditor was switched to visible
	return str_replace( '<!-- Tidy found serious XHTML errors -->', '', $parser->parse( $wiki, $wgTitle, $options )->getText() );
}

function wfSajaxToggleCKeditor( $data ) {
	if( $data == 'show' ){
		$_SESSION['showMyFCKeditor'] = RTE_VISIBLE;	// visible last time
	} else {
		$_SESSION['showMyFCKeditor'] = 0; // invisible
	}
	return 'SUCCESS';
}
