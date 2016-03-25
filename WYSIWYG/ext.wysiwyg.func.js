
// WYSIWYG javascript functions 
// 22.03.16 RL  Moved here from CKeditor.body.js
// 24.03.16 RL  At least these functions must be global: ToggleCKEditor, FCK_sajax

function stripTags(html) { //05.12.14 RL->
    return html.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
}


function htmlEncode(html) { //text=>html using browser
    return document.createElement( 'a' ).appendChild( document.createTextNode( html ) ).parentNode.innerHTML;
}
window.htmlEncode = htmlEncode;


function htmlDecode(html) { //html=>text using browser
    var tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}
window.htmlDecode = htmlDecode;


function convToHTML(text2html) {
	if ( htmlEncode('<\\n>') == '&lt;\\n&gt;' ) {
		//text to html using browser
		return htmlEncode(text2html);
    }
    else { //In case browser fails, text=>html using replace
        return text2html.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
}
window.convToHTML = convToHTML;


function convFromHTML(html){
    if ( htmlDecode('&lt;\\n&gt;') == '<\\n>' ) {
        //html=>text using browser
        return (htmlDecode(html));
    }
    else { //In case browser fails, html to text using replace
        return stripTags(html).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
        //return html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
    }
}	                       //05.12.14 RL<-
window.convFromHTML = convFromHTML;
		
		
//IE hack to call func from popup
function FCK_sajax(func_name, args, target) {

	/**22.02.16 RL mw.legacy.ajax has been removed starting from MW 1.26-> *****
	sajax_request_type = 'POST';
	sajax_do_call(func_name, args, function (x) {	
		// I know this is function, not object
		target(x);
		}
	);
	*******/

	$.post( mw.util.wikiScript(), {  //22.02.16 RL
			action: 'ajax', 
			rs: func_name, 
			rsargs: args 
			}, function (x) {			
				target(x); // I know this is function, not object
			}
		); 	

	/************
	alert('DEBUG01-ajax-call');
	$.ajax({
			type: 'POST',
			url: mw.util.wikiScript(),
			data: { func_name, args },
			dataType: 'text',
			success: function (x) {
				// I know this is function, not object
				target(x);
			},
			context: target
		});
	***********/
		
}
window.FCK_sajax = FCK_sajax; //This function must be global


// qi url tokens
function onLoadCKeditor(){
	
	if( !( showFCKEditor & RTE_VISIBLE ) )
		showFCKEditor += RTE_VISIBLE;
	firstLoad = false;
	realTextarea = document.getElementById( MWtextfield );
	
	if ( realTextarea ){

		var height = CKheight;  //22.03.16 RL Was $ckeHeight
		realTextarea.style.display = 'none';
		
		if ( height == 0 ){
			// Get the window (inner) size.
			var height = window.innerHeight || ( document.documentElement && document.documentElement.clientHeight ) || 550;

			// Reduce the height to the offset of the toolbar.
			var offset = document.getElementById( 'wikiPreview' ) || document.getElementById( 'toolbar' );
			while ( offset ){
				height -= offset.offsetTop;
				offset = offset.offsetParent;
			}

			// Add a small space to be left in the bottom.
			height -= 20;
		}

		// Enforce a minimum height.
		height = ( !height || height < 300 ) ? 300 : height;
		// Create the editor instance and replace the textarea.
		realTextarea.style.height = height;

		wgCKeditorInstance = CKEDITOR.replace(realTextarea);  //22.03.16 RL With resourceloader + source files of CKeditor: FF, IE and Chrome fail here, all browsers work if $wgResourceLoaderDebug = true; in LocalSettings.php.
	
		// Hide the default toolbar.
        var toolbar = document.getElementById( 'toolbar' );
		if ( toolbar ) toolbar.style.display = 'none';

	}
	
    // enable semantic toolbar in the editor after 2s
    if ( loadSTBonStartup ) {
        setTimeout(function() {
            wgCKeditorInstance.execCommand('SMWtoolbar');
        }, 2000);
    }
}
window.onLoadCKeditor = onLoadCKeditor;


function checkSelected(){
	if( !selText ) {
		selText = sampleText;
		isSample = true;
	} else if( selText.charAt(selText.length - 1) == ' ' ) { //exclude ending space char
		selText = selText.substring(0, selText.length - 1);
		tagClose += ' '
	}
}
window.checkSelected = checkSelected;


function initEditor(){	

	//$('#wpTextbox1').hide(); //23.04.16 RL  Hide wikitext editor area
	//mw.util.jsMessage( '<a class="fckPageLoading"><i>' + editorWaitPageLoad + '</i></a>' );

    EnabledUseEditWarning = true;              //Enable onbeforeunload event. 13.04.14 RL->  
    window.onbeforeunload = null;              //Clear and unbind current "unload resources" event
    if (useEditwarning) {
		window.onbeforeunload = function(e) {  //To activate warning with Cancel -button on wysiwyg page
            //EnabledUseEditWarning is used to disable onbeforeunload event with:
            //  -ToggleCKEditor link with IE
            //  -save, preview and diff buttons with all browsers			
            if ( EnabledUseEditWarning ) { 
                var confirmationMessage = ' '; //Returned string is not displayed with FF, it is displayed with IE,Chrome..=>use empty string
                (e || window.event).returnValue = confirmationMessage;
                return confirmationMessage;
            }
			else return;
        }; 		
    }                                          //13.04.14 RL<-

	var toolbar = document.getElementById( 'toolbar' );
	// show popup or toogle link

	//21.02.14 RL-> In case of conflict page, revert back to WikiEditor mode. 
    /*******
	if ( showFCKEditor & RTE_VISIBLE & isConflict ) { 
		showFCKEditor -= RTE_VISIBLE;  
		if ( $('#wikiEditor-ui-toolbar') ) {
			$('#wikiEditor-ui-toolbar').show(); 
		}		
		return true	;
	}	
    ****/
    //24.02.14 RL-> In case of conflict, convert wikitext to html and open wysiwyg editor.
	//              Page will be corrupted in case user does refresh of page in wysiwyg mode.
	if ( showFCKEditor & RTE_VISIBLE & isConflict & firstLoad ) {
		var SRCtextarea = document.getElementById( MWtextfield );
		CKEDITOR_ready = false;

		/**22.02.16 RL mw.legacy.ajax has been removed starting from MW 1.26-> *****
		sajax_request_type = 'POST';
		sajax_do_call('wfSajaxWikiToHTML', [SRCtextarea.value], function( result ){
			if ( firstLoad ){ //still
				SRCtextarea.value = result.responseText; // insert parsed text
				onLoadCKeditor();
				CKEDITOR_ready = true;
			}
		});
		******/

		$.post( mw.util.wikiScript(), {  //22.02.16 RL
				action: 'ajax', 
				rs: 'wfSajaxWikiToHTML', 
				rsargs: [SRCtextarea.value] 
				}, function( result ){
					if ( firstLoad ){ //still
						if (typeof result.responseText != 'undefined')
							SRCtextarea.value = result.responseText; // insert parsed text						
						else
							SRCtextarea.value = result;              // insert parsed text
						onLoadCKeditor();
						CKEDITOR_ready = true;
					}
				}
			); 	
			
		return true;
	}

	//24.02.14 RL<-
	
	if( showFCKEditor & ( RTE_POPUP|RTE_TOGGLE_LINK ) ){
		// add new toolbar before wiki toolbar
		var ckTools = document.createElement( 'div' );
			ckTools.setAttribute('id', 'ckTools');
		var SRCtextarea = document.getElementById( MWtextfield );
        
		if (toolbar) toolbar.parentNode.insertBefore( ckTools, toolbar );
        else SRCtextarea.parentNode.insertBefore( ckTools, SRCtextarea );
		
		if( showFCKEditor & RTE_VISIBLE ) SRCtextarea.style.display = 'none';
	}


	if( showFCKEditor & RTE_TOGGLE_LINK ){
		//17.01.14 RL Original: ckTools.innerHTML='[<a class="fckToogle" id="toggle_$textfield" href="javascript:void(0)" onclick="ToggleCKEditor(\'toggle\',\'$textfield\')">'+ editorLink +'</a>] ';

		//17.01.14 RL-> Removed [] here because they would not move with link text when "toggle_$textfield" was repositioned =>
		//              instead brackets has been set into variables editorLink, editorMsgOn and editorMsgOff directly.
		//ckTools.innerHTML='<a class="fckToogle" id="toggle_$textfield" href="javascript:void(0)" onclick="ToggleCKEditor(\'toggle\',\'$textfield\')">'+ editorLink +'</a> ';
		ckTools.innerHTML='<a class="fckToogle" id="toggle_' + MWtextfield +  //22.03.16 RL
		                  '" href="javascript:void(0)" onclick="ToggleCKEditor(\'toggle\',\'' + MWtextfield + '\')">' + 
						  editorLink +'</a> ';

		//Do not hide WikiEditor toolbar if preferences told us to start with it.
		if (showFCKEditor & RTE_VISIBLE) { //10.04.14 RL 
			if ( $('#wikiEditor-ui-toolbar') ) {  //Hide WikiEditor toolbar
				$('#wikiEditor-ui-toolbar').hide(); 
			}	
		}	                               //10.04.14 RL

		//F.ex: $("#toggle_$textfield") equals to $('#toggle_wpTextbox1') 
		//$( "#toggle_$textfield" ).insertBefore('#ckTools');  //This worked with FireFox v26.0 but not with IE11
		
		//$( "#toggle_$textfield" ).insertBefore("#editform");   //This works with FF and IE //22.03.16 RL
		//$( "#toggle_$textfield" ).css('font-size','0.8em');
		
		$( "#toggle_" + MWtextfield ).insertBefore("#editform");   //This works with FF and IE //22.03.16 RL
		$( "#toggle_" + MWtextfield ).css('font-size','0.8em');
		
		//$( "#toggle_$textfield" ).css('float','left');       //This does not work with WikiEditor window, text disappears
		//17.01.14 RL<-
	}
    /*
	if( showFCKEditor & RTE_POPUP ){
		var style = (showFCKEditor & RTE_VISIBLE) ? 'style="display:none"' : "";    //$newWinMsg -> MWnewWinMsg
		ckTools.innerHTML+='<span ' + style + ' id="popup_$textfield">[<a class="fckPopup" href="javascript:void(0)" onclick="ToggleCKEditor(\'popup\',\'$textfield\')">{$newWinMsg}</a>]</span>';
	}
    */
	
	if( showFCKEditor & RTE_VISIBLE ){
		
		if ( toolbar ){	// insert wiki buttons
			for( var i = 0; i < mwEditButtons.length; i++ ) {
				mwInsertEditButton(toolbar, mwEditButtons[i]);
			}
			for( var i = 0; i < mwCustomEditButtons.length; i++ ) {
				mwInsertEditButton(toolbar, mwCustomEditButtons[i]);
			}
		}
		onLoadCKeditor();
	}
	
	return true;
}
window.initEditor = initEditor;


function ToggleCKEditor( mode, objId ){ 

	if (typeof window.toggleRTESemaphore !== 'undefined') {
		if (window.toggleRTESemaphore === true) {
			return false;
		}
	} 
	window.toggleRTESemaphore = true;
	document.getElementById('ckTools').style.display='none';

	EnabledUseEditWarning = false;     //13.04.14 RL This is needed because IE fires "unload resources" event when toggle link is pressed.
	setTimeout(function() {
		EnabledUseEditWarning = true;  //13.04.14 RL Enable "unload resources" event after timeout, because event fires after this procedure is finished
		window.toggleRTESemaphore = false;
		document.getElementById('ckTools').style.display='block';
    }, 2000);
	
	var SRCtextarea = document.getElementById( objId );
	if( mode == 'popup' ){
		if ( ( showFCKEditor & RTE_VISIBLE ) && ( CKEDITOR.status == 'basic_ready' ) ) { // if CKeditor is up-to-date
			var oEditorIns = CKEDITOR.instances[objId];
			var text = oEditorIns.getData();
			SRCtextarea.value = text; // copy text to textarea
		}
		FCKeditor_OpenPopup('CKEDITOR', objId);
		return true;
	}

	var oToggleLink = document.getElementById( 'toggle_' + objId );
	var oPopupLink = document.getElementById( 'popup_' + objId );

	if ( firstLoad ){

		if ( $('#wikiEditor-ui-toolbar') ) {  //10.04.14 RL->
			//Hide WikiEditor toolbar (in case preferences told us to start with it).
			$('#wikiEditor-ui-toolbar').hide(); 
		}                                     //10.04.14 RL<-

		SRCtextarea.readOnly = true;  //12.01.15 RL
		// firstLoad = true => FCKeditor start invisible
		CKEDITOR_ready = false;
		
		/**22.02.16 RL mw.legacy.ajax has been removed starting from MW 1.26-> *****
		sajax_request_type = 'POST';
		sajax_do_call('wfSajaxWikiToHTML', [SRCtextarea.value], function( result ){
			if ( firstLoad ){ //still
				SRCtextarea.value = result.responseText; // insert parsed text
				onLoadCKeditor();
				if( oToggleLink ) oToggleLink.innerHTML = editorMsgOff;
				SRCtextarea.readOnly = false;  //12.01.15 RL
				CKEDITOR_ready = true;
			}
		});
		*********/

		$.post( mw.util.wikiScript(), {  //22.02.16 RL
				action: 'ajax', 
				rs: 'wfSajaxWikiToHTML', 
				rsargs: [SRCtextarea.value] 
				}, function( result ){
					if ( firstLoad ){ //still
						if (typeof result.responseText != 'undefined')
							SRCtextarea.value = result.responseText; // insert parsed text						
						else
							SRCtextarea.value = result;              // insert parsed text
						onLoadCKeditor();
						if( oToggleLink ) oToggleLink.innerHTML = editorMsgOff;
						SRCtextarea.readOnly = false;  //12.01.15 RL
						CKEDITOR_ready = true;
					}
				}
			); 	
			
		return true;
	}
	

	if( ! CKEDITOR_ready ) {
		return false; // sajax_do_call in action
	}
	
	//01.03.14 RL: In CKeditor 3.6 'basic_ready', in 4.3.3 'loaded'
	if( ! ((CKEDITOR.status == 'basic_ready') || (CKEDITOR.status == 'loaded')) ) {
		return false; // not loaded yet
	}
	
    var oEditorIns = CKEDITOR.instances[objId];
	var oEditorIframe  = document.getElementById( 'cke_' + objId );
	var toolbar = document.getElementById( 'toolbar' );
	var bIsWysiwyg = ( oEditorIns.mode == 'wysiwyg' );

	//if( oToggleLink ) oToggleLink.innerHTML = editorWaitPageLoad;

	//CKeditor visible -> hidden
	if ( showFCKEditor & RTE_VISIBLE ){

		//17.01.14 RL-> Show WikiEditor toolbar
		if ( $('#wikiEditor-ui-toolbar') ) { 
			$('#wikiEditor-ui-toolbar').show();
			//objId contains string: wpTextbox1 => $('#toggle_wpTextbox1') is eq. to $('#toggle_' + objId)
			$('#toggle_' + objId).insertBefore('#wikiEditor-ui'); //-toolbar	
		}
		//17.01.14 RL<-

		var text = oEditorIns.getData();
		SRCtextarea.value = text;
		if( saveSetting ){
			/**22.02.16 RL mw.legacy.ajax has been removed starting from MW 1.26-> *****
			sajax_request_type = 'GET';
			sajax_do_call( 'wfSajaxToggleCKeditor', ['hide'], function(){} ); //remember closing in session
			********/
			$.get( mw.util.wikiScript(), {  //22.02.16 RL
						action: 'ajax', 
						rs: 'wfSajaxToggleCKeditor', 
						rsargs: ['hide'] 
					}, function(){}
			); 			
		}
        if( oToggleLink ) oToggleLink.innerHTML = editorMsgOn;

        if( oPopupLink ) oPopupLink.style.display = '';
		showFCKEditor -= RTE_VISIBLE;
		oEditorIframe.style.display = 'none';
		if (toolbar) {
            toolbar.style.display = 'inline';
            toolbar.style.visibility = 'visible';
        }
		SRCtextarea.style.display = 'inline';
        SRCtextarea.style.visibility = 'visible';
		
        if (CKEDITOR.plugins.smwtoolbar) {
            CKEDITOR.plugins.smwtoolbar.stbIsActive = false;
            smwhgAnnotationHints = new AnnotationHints();
            propToolBar = new PropertiesToolBar();
            AdvancedAnnotation.unload();
            AdvancedAnnotation.create();
            stb_control.stbconstructor();
            stb_control.createForcedHeader();
            obContributor.registerContributor();
            relToolBar.callme();
            catToolBar.callme();
            propToolBar.callme();
            smwhgASKQuery.createContainer();
            // webservice toolbar, only available if DataImport extension is included
            if (typeof wsToolBar != 'undefined')
                wsToolBar.callme();
            // rule toolbar, only available if SemanticRuls extension is included
            if (typeof ruleToolBar != 'undefined')
                ruleToolBar.callme();
            // Annotations toolbar, only if SemanticGardening extension is included
            if (typeof smwhgGardeningHints != 'undefined')
                smwhgGardeningHints.createContainer();
            smw_links_callme();
            gEditInterface = new SMWEditInterface();
            obContributor.activateTextArea(SRCtextarea);
            smwhg_dragresizetoolbar.draggable=null;
            smwhg_dragresizetoolbar.callme();
        }
	} else {
		window.parent.editorSrcToWswTrigger = true; //03.03.15 RL
		//17.01.14 RL-> Hide WikiEditor toolbar
		if ( $('#wikiEditor-ui-toolbar') ) {  
			$('#wikiEditor-ui-toolbar').hide();
			//objId contains string: wpTextbox1 => $('#toggle_wpTextbox1') is eq. to $('#toggle_' + objId)
			//$( '#toggle_' + objId ).insertBefore('#ckTools');  //This worked with FireFox v26.0 but not with IE11
			$( '#toggle_' + objId ).insertBefore("#editform");   //This works with FF and IE
		}	
		//17.01.14 RL<-
		
		// FCKeditor hidden -> visible
		//if ( bIsWysiwyg ) oEditorIns.SwitchEditMode(); // switch to plain
		SRCtextarea.style.display = 'none';              //hide window of wikitext editor
		// copy from textarea to FCKeditor
		oEditorIns.setData( SRCtextarea.value );         //set data into window of ckeditor

		if (toolbar) toolbar.style.display = 'none';
		oEditorIframe.style.display = '';
		//if ( !bIsWysiwyg ) oEditorIns.SwitchEditMode();	// switch to WYSIWYG
		showFCKEditor += RTE_VISIBLE; // showFCKEditor+=RTE_VISIBLE
        if( oToggleLink ) oToggleLink.innerHTML = editorMsgOff;
        if( oPopupLink ) oPopupLink.style.display = 'none';
        if (typeof AdvancedAnnotation != 'undefined')
            AdvancedAnnotation.unload();
        if ( loadSTBonStartup )
            CKEDITOR.instances[objId].execCommand('SMWtoolbar');
	}

	return true;
}
window.ToggleCKEditor = ToggleCKEditor; //This function must be global


function FCKeditor_OpenPopup(jsID, textareaID){
	popupUrl = wgFCKEditorExtDir + '/CKeditor.popup.html';
	popupUrl = popupUrl + '?var='+ jsID + '&el=' + textareaID;
	window.open(popupUrl, null, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=1,dependent=yes');
	return 0;
}
window.FCKeditor_OpenPopup = FCKeditor_OpenPopup;

