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

      /**
       * Make an image link in MediaWiki 1.11
       * @param Title $title Title object
       * @param File $file File object, or false if it doesn't exist
       *
       * @param array $frameParams Associative array of parameters external to the media handler.
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
       *          caption         HTML for image caption.
       *
       * @param array $handlerParams Associative array of media handler parameters, to be passed
       *       to transform(). Typical keys are "width" and "page".
       */
      static function makeImageLink2( $skin, Title $nt, $file, $frameParams = array(), $handlerParams = array(), $time, &$ret ) {
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

              if( $found ) {
                      $ret .= "src=\"{$url}\" ";
              } else {
                      $ret .= "_fck_mw_valid=\"false"."\" ";
              }
              $ret .= "_fck_mw_filename=\"{$orginal}\" ";

              if( $fp['align'] ) {
                      $ret .= "_fck_mw_location=\"" . strtolower( $fp['align'] ) . "\" ";
              }
              if( !empty( $hp ) ) {
                      if( isset( $hp['width'] ) ) {
                              $ret .= "_fck_mw_width=\"" . $hp['width'] . "\" ";
							  $ret .= "width=\"" . $hp['width'] . "\" ";         //10.01.14 RL To resize image properly in edit mode of wysiwyg
                      }
                      if( isset( $hp['height'] ) ) {
                              $ret .= "_fck_mw_height=\"" . $hp['height'] . "\" ";
							  $ret .= "height=\"" . $hp['height'] . "\"  ";      //10.01.14 RL To resize image properly in edit mode of wysiwyg
                      }
              }
              $class = '';
              if( isset( $fp['thumbnail'] ) ) {
                      $ret .= "_fck_mw_type=\"thumb" . "\" ";
                      $class .= 'fck_mw_frame';
              } else if( isset( $fp['border'] ) ) {
                      $ret .= "_fck_mw_type=\"border" . "\" ";
                      $class .= 'fck_mw_border';
              } else if( isset( $fp['framed'] ) ) {
                      $ret .= "_fck_mw_type=\"frame" . "\" ";
                      $class .= 'fck_mw_frame';
              } else if( isset( $fp['frameless'] ) ) {             //07.01.14 RL New style for picture
                      $ret .= "_fck_mw_type=\"frameless" . "\" ";  //07.01.14 RL
                    //$class .= 'fck_mw_frame';                    //07.01.14 RL
              }

              if( $fp['align'] == 'right' ) {
                      $class .= ( $class ? ' ': '' ) . 'fck_mw_right';
              } else if( $fp['align'] == 'center' ) {
                      $class .= ( $class ? ' ' : ''  ) . 'fck_mw_center';
              } else if( $fp['align'] == 'left' ) {
                      $class .= ( $class ? ' ': '' ) . 'fck_mw_left';
              } else if( isset( $fp['framed'] ) || isset( $fp['thumbnail'] ) ) {
                      $class .= ( $class ? ' ' : '' ) . 'fck_mw_right';
              }

              if( !$found ) {
                      $class .= ( $class ? ' ' : '' ) . 'fck_mw_notfound';
              }

              if( isset( $fp['alt'] ) && !empty( $fp['alt'] ) && $fp['alt'] != 'Image:' . $orginal ) {
                      $ret .= "alt=\"" . htmlspecialchars( $fp['alt'] ) . "\" ";
              } else {
                      $ret .= "alt=\"\" ";
              }

              if( $class ) {
                      $ret .= "class=\"$class\" ";
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
              $text = htmlspecialchars( $text );
              $url = preg_replace( "/^RTECOLON/", ":", $url ); // change 'RTECOLON' => ':'
              $args = '';
              if( $text == 'RTENOTITLE' ){ // 2223
                      $args .= '_fcknotitle="true" ';
                      $text = $url;
              }
              $link= '<a ' . $args . 'href="' . $url . '">' . $text . '</a>';

              return false;
      }

      function makeColouredLinkObj( $nt, $colour, $text = '', $query = '', $trail = '', $prefix = '' ) {
              return self::makeKnownLinkObj( $nt, $text, $query, $trail, $prefix, '', $style );
      }

      function makeKnownLinkObj( $nt, $text = '', $query = '', $trail = '', $prefix = '' , $aprops = '', $style = '' ) {
              wfProfileIn( __METHOD__ );

              $args = '';
              if ( !is_object( $nt ) ) {
                      wfProfileOut( __METHOD__ );
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
              wfProfileOut( __METHOD__ );
              return $r;
      }

      function makeBrokenLinkObj( $nt, $text = '', $query = '', $trail = '', $prefix = '' ) {
              # Fail gracefully
              if ( !isset( $nt ) ) {
                      # throw new MWException();
                      return "<!-- ERROR -->{$prefix}{$text}{$trail}";
              }
              $args = '';

              wfProfileIn( __METHOD__ );

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

              wfProfileOut( __METHOD__ );
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

                      wfProfileOut( __METHOD__ );
                      $ret = $t;
                      return false;
              }

              return true;
      }

      static function linkEnd(  $skin, Title $target, array $options, &$text, array &$attribs, &$ret ) {

              if ( in_array('known', $options) ) {
                      $args = '';
                      if ( !is_object( $target ) ) {
                              wfProfileOut( __METHOD__ );
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
                      wfProfileOut( __METHOD__ );

                      $ret = $r;

                      return false;
              }


              if (in_array('broken', $options)) {
                      if ( !isset( $target ) ) {
                              # throw new MWException();
                              return "<!-- ERROR -->{$prefix}{$text}";
                      }
                      $args = '';

                      wfProfileIn( __METHOD__ );

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

                      wfProfileOut( __METHOD__ );
                      $ret = $s;
                      return false;
              }
              
              return true;
      }

}
