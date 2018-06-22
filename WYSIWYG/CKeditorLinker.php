<?php

/**
* Since the core parser have moved to use a static method pattern for
* rendering links, the functionality from CKeditorSkin has been moved
* here and now relies on hooks.
*
* The methods in the skin that as of 1.19 are no longer called from
* core has been ignored, which means that some extensions might break.
*
* The method 'makeSelfLinkObj' is called directly from the core
* parser, but no hook is available for it, so a patch to core is
* required to support it.
*
* The public methods of CKeditorSkin are:
* 
* makeImageLink2 - used in core, hook available: ImageBeforeProduceHTML
* makeLinkObj - deprecated, unused in core
* makeKnownLinkObj - deprecated, unused in core
* makeColouredLinkObj - deprecated, unused in core
* makeBrokenLinkObj - only used in makeImageLink2
* makeSelfLinkObj - used by core parser, impossible to hook
* makeMediaLinkObj - only used by formatComment in core
* makeExternalLink - used in core, hook available: LinkerMakeExternalLink
*/
class CKeditorLinker {

      public static function addHooks() {
              global $wgHooks;

              $wgHooks['ImageBeforeProduceHTML'][] = 'CKeditorLinker::makeImageLink2';
              $wgHooks['LinkerMakeExternalLink'][] = 'CKeditorLinker::makeExternalLink';
              $wgHooks['LinkEnd'][]                = 'CKeditorLinker::linkEnd';
              $wgHooks['LinkBegin'][]              = 'CKeditorLinker::linkBegin';
      }

      public static function removeHooks() {
              self::removeHook('ImageBeforeProduceHTML', 'CKeditorLinker::makeImageLink2');
              self::removeHook('LinkerMakeExternalLink', 'CKeditorLinker::makeExternalLink');
              self::removeHook('LinkEnd', 'CKeditorLinker::linkEnd');
              self::removeHook('LinkBegin', 'CKeditorLinker::linkBegin');
      }

      private static function removeHook($hookName, $function) {
              global $wgHooks;
              $hook = $wgHooks[$hookName];
              $i = array_search($function, $hook);
   
              /*13.11.13 RL->  
              if ($i) {
                      $wgHooks[$hookName] = array_splice($hook, $i, 1);
              }
              ****/
              if ($i !== FALSE) { 
                     array_splice($wgHooks[$hookName], $i, 1); 
              }
              /*13.11.13 RL<-*/
      }

      /**Mediakiki 1.22
         * Given parameters derived from [[Image:Foo|options...]], generate the
         * HTML that that syntax inserts in the page.
         *
         * @param $parser Parser object
         * @param $title Title object of the file (not the currently viewed page)
         * @param $file File object, or false if it doesn't exist
         * @param array $frameParams associative array of parameters external to the media handler.
         *     Boolean parameters are indicated by presence or absence, the value is arbitrary and
         *     will often be false.
         *          thumbnail       If present, downscale and frame
         *          manualthumb     Image name to use as a thumbnail, instead of automatic scaling
         *          framed          Shows image in original size in a frame
         *          frameless       Downscale but don't frame
         *          upright         If present, tweak default sizes for portrait orientation
         *          upright_factor  Fudge factor for "upright" tweak (default 0.75)
         *          border          If present, show a border around the image
         *          align           Horizontal alignment (left, right, center, none)
         *          valign          Vertical alignment (baseline, sub, super, top, text-top, middle,
         *                          bottom, text-bottom)
         *          alt             Alternate text for image (i.e. alt attribute). Plain text.
         *          class           HTML for image classes. Plain text.
         *          caption         HTML for image caption.
         *          link-url        URL to link to
         *          link-title      Title object to link to
         *          link-target     Value for the target attribute, only with link-url
         *          no-link         Boolean, suppress description link
         *
         * @param array $handlerParams associative array of media handler parameters, to be passed
         *       to transform(). Typical keys are "width" and "page".
         * @param string $time timestamp of the file, set as false for current
         * @param string $query query params for desc url
         * @param $widthOption: Used by the parser to remember the user preference thumbnailsize
         * @since 1.20
         * @return String: HTML for an image, with links, wrappers, etc.
       */
      static function makeImageLink2( $skin, Title $nt, $file, $frameParams = array(), $handlerParams = array(), $time, &$ret ) {	          
			  global $IP, $wgUploadDirectory;
			  
			  //error_log(sprintf("DEBUG makeImageLink2 fp:%s hp:%s",print_r($fp,true), print_r($hp,true) ));
			  
			  $orginal = $nt->getText();
              $file = RepoGroup::singleton()->getLocalRepo()->newFile( $nt );
              $found = $file->exists();

              if( !empty( $frameParams['alt'] ) && $frameParams['alt'] == 'RTENOTITLE' ){ // 2223
                      $frameParams['alt'] = '';
              }
              if( $found ) {
                      $type = 'image';
                      if ($file->getMediaType() == MEDIATYPE_VIDEO) {
                              $type = 'video';
                      } else if ($file->getMediaType() == MEDIATYPE_AUDIO) {
                              $type = 'audio';
                      }
                      if ($type == 'image') {
                              $url = $file->getUrl();
                      } else {
                              $url = $file->createThumb( 230 );
                      }
              }

              // Shortcuts
              $fp =& $frameParams;
              $hp =& $handlerParams;	
			  
              if( !isset( $fp['align'] ) ) {
                      $fp['align'] = '';
              }

              $ret = '<img ';
              $class = '';
			  $style = '';     //31.12.14 RL
			  $imgSize = '';   //30.12.14 RL->
			  $imgWidth = '';
			  $imgHeight = ''; //30.12.14 RL<-			  

              if( $found ) {
                      $ret .= "src=\"{$url}\" ";
					  /**getimagesize returns array (requires php 4 or php 5), f.ex:
							[0] => 378
							[1] => 281
							[2] => 3
							[3] => width="378" height="281"
							[bits] => 8
							[mime] => image/png
					  **/
					  if ($type == 'image') {
						  // 22.01.15 RL Check also $wgUploadDirectory
						  // '/..' tests are because of case where $url depends somehow on local configuration or possible filesystem links.
						  if     ( isset($wgUploadDirectory) && file_exists($wgUploadDirectory . '/..' . $url) ) $imgDir = $wgUploadDirectory . '/..';
						  elseif ( isset($wgUploadDirectory) && file_exists($wgUploadDirectory .         $url) ) $imgDir = $wgUploadDirectory;
						  elseif ( isset($IP) && file_exists($IP . '/..' . $url) ) $imgDir = $IP . '/..';
						  elseif ( isset($IP) && file_exists($IP .         $url) ) $imgDir = $IP;
						  else {
							  $imgDir = '';
							  error_log(sprintf("ERROR: Image file not found! IP:%s url:%s", $IP, $url) );
							  if ( isset($wgUploadDirectory) ) error_log(sprintf("ERROR: Image file not found! wgUploadDirectory:%s", $wgUploadDirectory));
						  }
						  if ( $imgDir != '' ) $imgSize = getimagesize( $imgDir . $url ); 
					  }					  
              } else {
                      $ret .= "_fck_mw_valid=\"false"."\" ";
              }
              $ret .= "_fck_mw_filename=\"{$orginal}\" ";

              if( $fp['align'] ) { //Horizontal location
                      $ret .= "_fck_mw_location=\"" . strtolower( $fp['align'] ) . "\" ";
              }
			  
              if( isset( $fp['valign'] ) ) { //Vertical location  //31.12.14 RL
					  $ret   .= "_fck_mw_vertical-align=\"" . strtolower( $fp['valign'] ) . "\" "; //For wysiwyg: _fck_mw_vertical-align="middle"
					  $style .= "vertical-align:"           . strtolower( $fp['valign'] ) . ";";   //For MW: style="vertical-align: middle;"
              } else {
                      $style .= "vertical-align:middle;"; //Default of MW for wysiwyg
			  }
			  
			  if( isset( $fp['upright'] ) ) { //Resize automatically  //31.12.14 RL
					  $ret   .= '_fck_mw_upright="1" ';
              } 

              if( !empty( $hp ) ) {
					if( isset( $hp['width'] ) ) {
						//$ret .= "_fck_mw_width=\"" . $hp['width'] . "\" ";
						//$ret .= "width=\"" . $hp['width'] . "\" ";    //10.01.14 RL
						$imgWidth = $hp['width'];       //30.12.14 RL
					}
					if( isset( $hp['height'] ) ) {
						//$ret .= "_fck_mw_height=\"" . $hp['height'] . "\" ";
						//$ret .= "height=\"" . $hp['height'] . "\"  "; //10.01.14 RL
						$imgHeight = $hp['height'];     //30.12.14 RL
					}
					
					/**31.12.14 RL*** MW does not necessarily need both width and height info of image so we do not use this. 
					
					// F.ex. [[image:picture.png|none|120px]] => missing value is then calculated automatically by MW.
					// In case we want size to be displayed in image dialog calculate missing proportional values here:
					// imgHeight = realHeight * (imgWidth / realWidth), using integer value rounded down
					// imgWidth  = realWidth  * (imgHeight / realHeight)
					if ( $found && isset( $hp['width'] ) && !isset( $hp['height'] ) ) {
						$imgHeight = floor( $imgSize['1'] * ( $imgWidth / $imgSize['0'] ) ); 
					} elseif ( $found && isset( $hp['height'] ) && !isset( $hp['width'] ) ) {
						$imgWidth  = floor( $imgSize['0'] * ( $imgHeight / $imgSize['1'] ) );						
					} elseif ( $found && !isset( $hp['height'] ) && !isset( $hp['width'] ) ) {
						$imgWidth  = $imgSize['0'];            
						$imgHeight = $imgSize['1'];            
					}
					*******/
              } 
			  /****
			  elseif ( $found ) { //30.12.14 RL
					$imgWidth  = $imgSize['0'];            
					$imgHeight = $imgSize['1'];            
			  } 
			  *****/
			  
              if( !empty( $imgWidth ) ) {                     //30.12.14 RL->  
                    //$ret .= "_fck_mw_width=\"" . $imgWidth . "\" ";   //30.12.14 RL Not used
				    $ret .= "width=\"" . $imgWidth . "\" ";   //10.01.14 RL To resize image properly in edit mode of wysiwyg
              }			  
              if( !empty( $imgHeight ) ) {
                    //$ret .= "_fck_mw_height=\"" . $imgHeight . "\" "; //30.12.14 RL Not used
				    $ret .= "height=\"" . $imgHeight . "\" "; //10.01.14 RL To resize image properly in edit mode of wysiwyg
              }                                               //30.12.14 RL<-
			  
			  if ( $found && $type == 'image' && $imgDir != '' ) { //22.01.15 RL  //30.12.14 RL->  
			        //Inform image dialog about original size of the image
			        $ret .= "_fck_mw_origimgwidth=\"" . $imgSize['0'] . "\" _fck_mw_origimgheight=\"" . $imgSize['1'] . "\" ";
              }                                               //30.12.14 RL<-
			  
              if( isset( $fp['thumbnail'] ) ) {
                      $ret .= "_fck_mw_type=\"thumb" . "\" ";
                      $class .= ( $class ? ' ' : '' ) . 'fck_mw_frame';
              } elseif( isset( $fp['border'] ) ) {
                      $ret .= "_fck_mw_type=\"border" . "\" ";
                      $class .= ( $class ? ' ' : '' ) . 'fck_mw_border';
              } elseif( isset( $fp['framed'] ) ) {
                      $ret .= "_fck_mw_type=\"frame" . "\" ";
                      $class .= ( $class ? ' ' : '' ) . 'fck_mw_frame'; 
              } elseif( isset( $fp['frameless'] ) ) {                           //07.01.14 RL New style for picture
                      $ret .= "_fck_mw_type=\"frameless" . "\" ";  
                      $class .= ( $class ? ' ' : '' ) . 'fck_mw_frameless';     //31.12.14 RL
              }
			  
              // Alignment info can not be simply added into class of image element
              // => use own "img." styles to position element on page properly (defined in plugin.js).
              if( $fp['align'] == 'none' ) {
                      $class .= ( $class ? ' ' : '' ) . 'fck_mw_none';		    //31.12.14 RL		  
              } elseif( $fp['align'] == 'right' ) {
                      $class .= ( $class ? ' ' : '' ) . 'fck_mw_right';
              } elseif( $fp['align'] == 'center' ) {
                      $class .= ( $class ? ' ' : '' ) . 'fck_mw_center';
              } elseif( $fp['align'] == 'left' ) {
                      $class .= ( $class ? ' ' : '' ) . 'fck_mw_left';
              } elseif( isset( $fp['framed'] ) || isset( $fp['thumbnail'] ) ) {
                      $class .= ( $class ? ' ' : '' ) . 'fck_mw_right';
              }

              if( !$found ) {
                      $class .= ( $class ? ' ' : '' ) . 'fck_mw_notfound';
              }
			  
              if( isset( $fp['alt'] ) && !empty( $fp['alt'] ) && $fp['alt'] != 'Image:' . $orginal ) {
                      $ret .= "alt=\""  . htmlspecialchars( $fp['alt'] ) . "\" "
						   . "title=\"" . htmlspecialchars( $fp['alt'] ) . "\" ";     //31.01.15 RL
              } else if( isset( $fp['caption'] ) ) {  //22.12.14 RL
                      $ret .= "alt=\""  . htmlspecialchars( $fp['caption'] ) . "\" "  //22.12.14 RL (by Aarakast)
						   . "title=\"" . htmlspecialchars( $fp['caption'] ) . "\" "; //31.01.15 RL
              } else {
                      $ret .= "alt=\"\" " 
                           . "title=\"\" "; //31.01.15 RL
              }

              if( $class ) {
                      $ret .= "class=\"$class\" ";
              }
			  
              if ( $style ) { //31.12.14 RL
                      $ret .= "style=\"$style\" ";
              }
			  
              if (isset($fp['no-link']))
                  $ret .= 'no-link="1" ';
              if (isset($fp['link-title']) && is_object($fp['link-title']))
                  $ret .= 'link="'.htmlentities ($fp['link-title']->getFullText()).'" ';
              if (isset($fp['link-url']))
                  $ret .= 'link="'.$fp['link-url'].'" ';

              $ret .= '/>';

              return false;
      }

      static function makeExternalLink( $url, $text, &$link, &$attribs, $linktype ) {
		  
			  $url = htmlspecialchars( $url );
              
			  // Following html encoding of $text destroys formats inside link text (italic, bold, underline) 
			  // f.ex. [http://test.com ''bbb''] => <a href="http://test.com"><i>bbb<i></a>.
			  // If needed, encoding is parameter controlled action already in MW in Linker::makeExternalLink.
			  // => 04.01.15 RL commented out (by vadamovsky) 
              // $text = htmlspecialchars( $text );  
			  
              $url = preg_replace( "/^RTECOLON/", ":", $url ); // change 'RTECOLON' => ':'
              
			  $args = '';
              if( $text == 'RTENOTITLE' ){ // 2223
                      $args .= '_fcknotitle="true" ';
                      $text = $url;
              }
              //$link= '<a ' . $args . 'href="' . $url . '">' . $text . '</a>'; //31.01.15 RL: Added alt + title
			  $link= '<a ' . $args . 'href="' . $url . '" alt="' . $url . '" title="' . $url . '">' . $text . '</a>';

              return false;
      }

      function makeColouredLinkObj( $nt, $colour, $text = '', $query = '', $trail = '', $prefix = '' ) {
              return self::makeKnownLinkObj( $nt, $text, $query, $trail, $prefix, '', $style );
      }

      function makeKnownLinkObj( $nt, $text = '', $query = '', $trail = '', $prefix = '' , $aprops = '', $style = '' ) {
              /*wfProfileIn( __METHOD__ ); *21.06.18 RL*/

              $args = '';
              if ( !is_object( $nt ) ) {
                      /*wfProfileOut( __METHOD__ ); *21.06.18 RL*/
                      return $text;
              }

              $u = $nt->getFullText();
              $u = rawurlencode($u);  // Fix for links containing "
              //#Updating links tables -> #Updating_links_tables
              $u = str_replace( "#" . $nt->getFragment(), $nt->getFragmentForURL(), $u );

              if ( $nt->getFragment() != '' ) {
                      if( $nt->getPrefixedDBkey() == '' ) {
                              $u = '';
                              if ( '' == $text ) {
                                      $text = htmlspecialchars( $nt->getFragment() );
                              }
                      }

                      /**
                       * See tickets 1386 and 1690 before changing anything
                       */
                      if( $nt->getPartialUrl() == '' ) {
                              $u .= $nt->getFragmentForURL();
                      }
              }
              if ( $text == '' ) {
                      $text = htmlspecialchars( $nt->getPrefixedText() );
              }

              if( $nt->getNamespace() == NS_CATEGORY ) {
                      $u = ':' . $u;
              }

              list( $inside, $trail ) = Linker::splitTrail( $trail );
              $title = "{$prefix}{$text}{$inside}";

              $u = preg_replace( "/^RTECOLON/", ":", $u ); // change 'RTECOLON' => ':'
              if( substr( $text, 0, 10 ) == 'RTENOTITLE' ){ // starts with RTENOTITLE
                      $args .= '_fcknotitle="true" ';
                      $title = rawurldecode($u);
                      $trail = substr( $text, 10 ) . $trail;
              }

              $r = "<a {$args}href=\"{$u}\">{$title}</a>{$trail}";
              /*wfProfileOut( __METHOD__ ); *21.06.18 RL*/
              return $r;
      }

      function makeBrokenLinkObj( $nt, $text = '', $query = '', $trail = '', $prefix = '' ) {
              # Fail gracefully
              if ( !isset( $nt ) ) {
                      # throw new MWException();
                      return "<!-- ERROR -->{$prefix}{$text}{$trail}";
              }
              $args = '';

              /*wfProfileIn( __METHOD__ ); *21.06.18 RL*/

              $u = $nt->getFullText();
              $u = rawurlencode($u);  // Fix for links containing "
              
              //#Updating links tables -> #Updating_links_tables
              $u = str_replace( "#" . $nt->getFragment(), $nt->getFragmentForURL(), $u );

              if ( '' == $text ) {
                      $text = htmlspecialchars( $nt->getPrefixedText() );
              }
              if( $nt->getNamespace() == NS_CATEGORY ) {
                      $u = ':' . $u;
              }

              list( $inside, $trail ) = Linker::splitTrail( $trail );
              $title = "{$prefix}{$text}{$inside}";

              $u = preg_replace( "/^RTECOLON/", ":", $u ); // change 'RTECOLON' => ':'
              if( substr( $text, 0, 10 ) == 'RTENOTITLE' ){   // starts with RTENOTITLE
                      $args .= '_fcknotitle="true" ';
                      $title = rawurldecode($u);
                      $trail = substr( $text, 10 ) . $trail;
              }
              $s = "<a {$args}href=\"{$u}\">{$title}</a>{$trail}";

              /*wfProfileOut( __METHOD__ ); *21.06.18 RL*/
              return $s;
      }

      static function makeSelfLinkObj( $nt, $text = '', $query = '', $trail = '', $prefix = '' ) {
              $args = '';
              if ( '' == $text ) {
                      $text = $nt->mDbkeyform;
              }
              list( $inside, $trail ) = Linker::splitTrail( $trail );
              $title = "{$prefix}{$text}";
              if( $text == 'RTENOTITLE' ){ // 2223
                      $args .= '_fcknotitle="true" ';
                      $title = $nt->mDbkeyform;
              }
              return "<a {$args}href=\"".$nt->mDbkeyform."\" class=\"selflink\">{$title}</a>{$inside}{$trail}";
      }

      /**
       * Create a direct link to a given uploaded file.
       *
       * @param $title Title object.
       * @param $text  String: pre-sanitized HTML
       * @return string HTML
       *
       * @todo Handle invalid or missing images better.
       */
      static function makeMediaLinkObj( $title, $text = '' ) {
              if( is_null( $title ) ) {
                      ### HOTFIX. Instead of breaking, return empty string.
                      return $text;
              } else {
                      $args = '';
                      $orginal = $title->getPartialURL();
                      $img = wfFindFile( $title );
                      if( $img ) {
                              $url  = $img->getURL();
                              $class = 'internal';
                      } else {
                              $upload = SpecialPage::getTitleFor( 'Upload' );
                              $url = $upload->getLocalUrl( 'wpDestFile=' . urlencode( $title->getDBkey() ) );
                              $class = 'new';
                      }
                      $alt = htmlspecialchars( $title->getText() );
                      if( $text == '' ) {
                              $text = $alt;
                      }
                      $orginal = preg_replace( "/^RTECOLON/", ":", $orginal ); // change 'RTECOLON' => ':'
                      if( $text == 'RTENOTITLE' ){ // 2223
                              $args .= '_fcknotitle="true" ';
                              $text = $orginal;
                              $alt = $orginal;
                      }
                      return "<a href=\"{$orginal}\" class=\"$class\" {$args} _fck_mw_filename=\"{$orginal}\" _fck_mw_type=\"media\" title=\"{$alt}\">{$text}</a>";
              }
      }

      static function linkBegin( $skin, Title $target, &$text, array &$attribs, &$query, &$options, &$ret) {
              if ( $target->isExternal() ) {
                      $args = '';
                      $u = $target->getFullURL();
                      $link = $target->getPrefixedURL();
                      if ( '' == $text ) {
                              $text = $target->getPrefixedText();
                      }
                      $style = Linker::getInterwikiLinkAttributes( $link, $text, 'extiw' );

                      if( $text == 'RTENOTITLE' ) { // 2223
                              $text = $u = $link;
                              $args .= '_fcknotitle="true" ';
                      }
                      $t = "<a {$args}href=\"{$u}\"{$style}>{$text}</a>";

                      /*wfProfileOut( __METHOD__ );  *21.06.18 RL*/
                      $ret = $t;
                      return false;
              }

              return true;
      }

      static function linkEnd(  $skin, Title $target, array $options, &$text, array &$attribs, &$ret ) {

              if ( in_array('known', $options) ) {
                      $args = '';
                      if ( !is_object( $target ) ) {
                              /*wfProfileOut( __METHOD__ );  *21.06.18 RL*/
                              return $text;
                      }

                      $u = $target->getFullText();
                      $u = rawurlencode($u);  // Fix for links containing "
                      //#Updating links tables -> #Updating_links_tables
                      $u = str_replace( "#" . $target->getFragment(), $target->getFragmentForURL(), $u );

                      if ( $target->getFragment() != '' ) {
                              if( $target->getPrefixedDBkey() == '' ) {
                                      $u = '';
                                      if ( '' == $text ) {
                                              $text = htmlspecialchars( $target->getFragment() );
                                      }
                              }

                              /**
                               * See tickets 1386 and 1690 before changing anything
                               */
                              if( $target->getPartialUrl() == '' ) {
                                      $u .= $target->getFragmentForURL();
                              }
                      }
                      if ( $text == '' ) {
                              $text = htmlspecialchars( $target->getPrefixedText() );
                      }

                      if( $target->getNamespace() == NS_CATEGORY ) {
                              $u = ':' . $u;
                      }

                      $u = preg_replace( "/^RTECOLON/", ":", $u ); // change 'RTECOLON' => ':'
                      if( substr( $text, 0, 10 ) == 'RTENOTITLE' ){ // starts with RTENOTITLE
                              $args .= '_fcknotitle="true" ';
                              $text = rawurldecode($u);
                      }

                      $r = "<a {$args}href=\"{$u}\">{$text}</a>";
                      /*wfProfileOut( __METHOD__ ); *21.06.18 RL*/

                      $ret = $r;

                      return false;
              }


              if (in_array('broken', $options)) {
                      if ( !isset( $target ) ) {
                              # throw new MWException();
                              return "<!-- ERROR -->{$prefix}{$text}";
                      }
                      $args = '';

                      /*wfProfileIn( __METHOD__ ); *21.06.18 RL*/

                      $u = $target->getFullText();
                      $u = rawurlencode($u);  // Fix for links containing "
              
                      //#Updating links tables -> #Updating_links_tables
                      $u = str_replace( "#" . $target->getFragment(), $target->getFragmentForURL(), $u );

                      if ( '' == $text ) {
                              $text = htmlspecialchars( $target->getPrefixedText() );
                      }
                      if( $target->getNamespace() == NS_CATEGORY ) {
                              $u = ':' . $u;
                      }

                      $u = preg_replace( "/^RTECOLON/", ":", $u ); // change 'RTECOLON' => ':'
                      if( substr( $text, 0, 10 ) == 'RTENOTITLE' ){   // starts with RTENOTITLE
                              $args .= '_fcknotitle="true" ';
                              $text = rawurldecode($u);
                      }
                      $s = "<a {$args}href=\"{$u}\">{$text}</a>";

                      /*wfProfileOut( __METHOD__ ); *21.06.18 RL*/
                      $ret = $s;
                      return false;
              }
              
              return true;
      }

}
