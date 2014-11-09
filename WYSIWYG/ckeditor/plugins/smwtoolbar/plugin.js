if (('SMW_HALO_VERSION').InArray(window.parent.wgCKeditorUseBuildin4Extensions)) {
(function(){
/**
 * Class which has the same functionality as SMWEditInterface except for the fact
 * that this must work for the CKEditor.
 * This class provides access to the edited text, returns a selection, changes
 * the content etc. The class is used in the semantic toolbar.
 */
// global variable for the edit interface (connector class for the STB to the
// current used editor)
var gEditInterface;

// these variables are used in the CKeditInterface class only. They should go
// inside the class but for some reason the class is reinitiated and the data
// in the member variables is lost
        // if set, contains the new text that will be inserted in the editor area
        var gEnewText = '',
        // the selection in the editor window may be null if selection is invalid.
        // When set, at least element 0 is set. All other are optional depending
        // on the selected element.
        // 0 => the selected text
        // 1 => namespace number (14 => Category, 102 => Property)
        // 2 => name of the property/category
        // 3 => value of the property
        // 4 => representation of the property
        gEselection = Array(),
        // the HTML element that contains the selected text
        gEselectedElement = null,
        // start and end for selection when in wikitext mode
        gEstart = -1,
        gEend = -1,
        // store here error message if selection can't be annotated
        gEerrMsgSelection = '',
        // puffer output before changing FCKtext
        gEoutputBuffering = false,
        gEeditor,
        gEflushedOnce;
var CKeditInterface = function( editor ) {
    gEeditor = editor;
};
CKeditInterface.prototype = {

   /**
    * gets the selected string. This is the  simple string of a selected
    * text in the editor arrea.
    *
    * @access public
    * @return string selected text or null
    * */
    getSelectedText: function() {
        this.getSelectionAsArray();
        return (gEselection.length > 0) ? gEselection[0] : null;
    },

    /**
     * returns the error message, if a selection cannot be annotated
     *
     * @access public
     * @return string error message
     */
    getErrMsgSelection: function() {
        return gEerrMsgSelection;
    },

    /**
     * Get the current selection of the FCKeditor and replace it with the
     * annotated value. This works on a category or property annotation only.
     * All other input is ignored and nothing will be replaced.
     *
     * @access public
     * @param  string text wikitext
     */
    setSelectedText: function(text) {
        // get the current editor instance
        var ckeditor = window.parent.wgCKeditorInstance;
        // check if start and end are set, then simply replace the selection
        // in the textarea
        if (ckeditor.mode != 'wysiwyg' && gEstart != -1 && gEend != -1) {
            var txtarea = ckeditor.getData();
            var newtext = txtarea.substr(0, gEstart) + text + txtarea.substr(gEend);
            this.clearSelection();
            HideContextPopup();
            this.setValue(newtext);
            return;
        }

        // WYSIWYG mode: continue using the functions of the FCK editor
        // Get the ancestor node. If we have a selection of some property
        // or category text there is a ancestor SPAN node. If this is not the
        // case, oSpan will be null. Then we create a new element. This will be
        // inserted at cursor position.
        var selection = ckeditor.getSelection();
        var oSpan = (selection) ? selection.getStartElement() : null;
        if (oSpan && oSpan.$.nodeName.toUpperCase() == 'SPAN')
            ckeditor.getSelection().selectElement( oSpan )
        else
            oSpan = new CKEDITOR.dom.element( 'span', ckeditor.document );

        // check the param text, if it's valid wiki text for a property or
        // category information.
        // check property first
        var regex = new RegExp('^\\[\\[(.*?)::(.*?)(\\|(.*?))?\\]\\]$')
        var match = regex.exec(text);
        if (match) {
            oSpan.addClass('fck_mw_property');
            if (match[4]) {
                oSpan.setAttribute( 'property',  match[1] + '::' + match[2] );
                oSpan.setHtml( match[4] );
            } else {
                oSpan.setAttribute( 'property',  match[1] );
                oSpan.setHtml( match[2] );
            }
            if (oSpan.getHtml().length == 0) oSpan.setHtml('&nbsp;');
        // no match for property, check category next
        } else {
            regex = new RegExp('^\\[\\[' + window.parent.gLanguage.getMessage('CATEGORY') + '(.*?)(\\|(.*?))?\\]\\]$');
            match = regex.exec(text);

            if (match) {
                oSpan.addClass('fck_mw_category') ;
                oSpan.setHtml(match[1]);
            }
            // no category neighter, something else (probably garbage) was in
            // the wikitext, then quit and do not modify the edited wiki page
            else return;
        }
        if ( oSpan ) {
            if ( ckeditor.mode == 'wysiwyg' )
                ckeditor.insertElement(oSpan);
            else
                ckeditor.insertElement(text);
        }
        HideContextPopup();
    },
	
	setEditAreaName: function (ean) {
		// not needed in this implementation
	},

    /**
     * returns the text of the edit window. This is wiki text.
     * If gEnewText is set, then something on the text has changed but the
     * editarea is not yet updated with the new value. Therefore return this
     * instead of fetching the text (with still the old value) from the editor
     * area
     *
     * @access public
     * @return string wikitext of the editors textarea
     */
    getValue: function() {
        return (gEnewText) ? gEnewText : gEeditor.getData();
    },

    /**
     * set the text in the editor area completely new. The text in the function
     * argument is wiki text. Therefore an Ajax call must be done, to transform
     * this text into proper html what is needed by the FCKeditor. To parse the
     * wiki text, the parser of the FCK extension is used (the same when the
     * editor is started and when switching between wikitext and html).
     *
     * After parsing the text can be set in the editor area. This is done with
     * FCK.SetData(). When doing this all Event listeners are lost. Therefore
     * these must be added again. Also the variable gEnewText which contains
     * the new text (runtime issues), can be flushed again.
     * In this case the global variable gEditInterface.newText is used to get
     * the correct instance of the class.
     *
     * Since the Semantic toolbar changes text quite frequently, we enable some
     * kind of output buffering. If this is set (makes sence in the WYSIWYG mode
     * only) then the text is saved in an internal variable. When output
     * buffering is not selected, then the text is imediately written to the
     * editor.
     *
     * @access public
     * @param  string text with wikitext
     */
    setValue: function(text) {
        if (text) {
            if (gEeditor.mode == 'wysiwyg') {
                gEnewText = text;
                if (!gEoutputBuffering)
                    this.flushOutputBuffer();
            }
            else {
                gEeditor.setData(text);
            }
        }
    },

    /**
     * returns the element were the selection is in.
     *
     * @access private
     * @return HtmlNode
     */
    getSelectedElement: function() {
        return gEselectedElement;
    },

    /**
     * gets the selected text of the current selection from the FCK
     * and fill up the member variable selection. This is an array of
     * maximum 4 elements which are:
     * 0 => selected text
     * 1 => namespace (14 = category, 102 = property) not existend otherwise
     * 2 => name of property or not set
     * 3 => actual value of property if sel. text is representation only not
     *      existend otherwise
     * If the selection is valid at least gEselection[0] must be set. The
     * selection is then returned to the caller
     *
     * @access public
     * @return Array(mixed) selection
     */
    getSelectionAsArray: function() {
        // flush the selection array
        gEselection = [];
        // remove any previously set error messages
        gEerrMsgSelection = '';

        // if we are in wikitext mode, return the selection of the textarea
        if (gEeditor.mode != 'wysiwyg' ) {
            this.getSelectionWikitext();
            return gEselection;
        }

        // selection text only without any html mark up etc.
        var ckSel = gEeditor.getSelection();
		if (ckSel == null) {
			// nothing selected
			gEselection[0] = '';
			return gEselection;
		}
		
        var browserSel = ckSel.getNative(),
            selTextCont;

        if(browserSel.createRange) {
            var srange = browserSel.createRange();
            selTextCont = srange.text;
        } else {
            var srange = browserSel.getRangeAt(ckSel.rangeCount - 1).cloneRange();
            selTextCont = srange.cloneContents().textContent;
        }
        // nothing was really selected, this always happens when a single or
        // double click is done. The mousup event is fired even though the user
        // might have positioned the cursor somewhere only.
        if (selTextCont == '') {
            gEselection[0] = '';
            return gEselection;
        }

        // selected element node
        gEselectedElement = ckSel.getSelectedElement();
        // parent element of the selected text (mostly a <p>)
        var parent = ckSel.getStartElement();
        // selection with html markup of the imediate parent element, if required
        var html = this.getSelectionHtml();
        // (partly) selected text within these elements can be annotated.
        var goodNodes = ['P', 'B', 'I', 'U', 'S', 'LI', 'DT', 'DIV', 'SPAN'];

        // selection is the same as the innerHTML -> no html was selected
		// trim strings to compare
		var tstc = selTextCont.replace(/^\s*(.*?)\s*$/,'$1');
		var thtml = html.replace(/^\s*(.*?)\s*$/,'$1');
        if (tstc == thtml) {
            // if the parent node is <a> or a <span> (property, category) then
            // we automatically select *all* of the inner html and the annotation
            // works for the complete node content (this is a must for these nodes)
            if (parent.$.nodeName.toUpperCase() == 'A') {
                gEselection[0] = parent.getText();
                gEselectedElement = parent;
                return gEselection;
            }
            // check category and property that might be in the <span> tag,
            // ignore all other spans that might exist as well
            if (parent.$.nodeName.toUpperCase() == 'SPAN') {
                if (parent.hasClass('fck_mw_property')) {
                    gEselectedElement = parent;
                    gEselection[0] = parent.getText().replace(/&nbsp;/gi, ' ');
                    gEselection[1] = 102;
                    var val = parent.getAttribute('property');
                    // differenciation between displayed representation and
                    // actual value of the property
                    if (val.indexOf('::') != -1) {
                        gEselection[2] = val.substring(0, val.indexOf('::'));
                        gEselection[3] = val.substring(val.indexOf('::') +2);
                    } else
                        gEselection[2] = val;
                    return gEselection;
                }
                else if (parent.hasClass('fck_mw_category')) {
                    gEselectedElement = parent;
                    gEselection[0] = parent.getText().replace(/&nbsp;/gi, ' ');
                    gEselection[1] = 14;
                    return gEselection;
                }
                gEerrMsgSelection = window.parent.gLanguage.getMessage('WTP_SELECTION_OVER_FORMATS');
                gEerrMsgSelection = gEerrMsgSelection.replace('$1', '&lt;span&gt;');
                return;
            }
            // just any text was selected, use this one for the selection
            // if it was encloded between the "good nodes"
            for (var i = 0; i < goodNodes.length; i++) {
                if (parent.$.nodeName.toUpperCase() == goodNodes[i]) {
                    gEselectedElement = parent;
                    gEselection[0] = selTextCont.replace(/&nbsp;/gi, ' ');
                    return gEselection;
                }
            }
            // selection is invalid
            gEerrMsgSelection = window.parent.gLanguage.getMessage('WTP_SELECTION_OVER_FORMATS');
            gEerrMsgSelection = gEerrMsgSelection.replace('$1', '&lt;' + parent.$.nodeName + '&gt;');
            return;
        }
        // the selection is exactly one tag that encloses the selected text
        var ok = html.match(/^<[^>]*?>[^<>]*<\/[^>]*?>$/g);
        if (ok && ok.length == 1) {
            var tag = html.replace(/^<(\w+) .*/, '$1').toUpperCase();
            var cont = html.replace(/^<[^>]*?>([^<>]*)<\/[^>]*?>$/, '$1');
            // anchors are the same as formating nodes, we use the selected
            // node content as the value.
            goodNodes.push('A');
            for (var i = 0; i < goodNodes.length; i++) {
                if (tag == goodNodes[i]) {
                    this.MatchSelectedNodeInDomtree(parent, tag, cont);
                    gEselection[0] = cont.replace(/&nbsp;/gi, ' ');
                    return gEselection;
                }
            }
            // there are several span tags, we need to find categories and properties
            if (tag == 'SPAN') {
                if (html.indexOf('class="fck_mw_property"') != -1 ||
                    html.indexOf('class=fck_mw_property') != -1   // IE has class like this
                   ) {
                    this.MatchSelectedNodeInDomtree(parent, tag, cont);
                    gEselection[0] = cont.replace(/&nbsp;/gi, ' ');
                    gEselection[1] = 102;
                    var val = html.replace(/.*property="(.*?)".*/, '$1');
                    if (val.indexOf('::') != -1) {
                        gEselection[2] = val.substring(0, val.indexOf('::'));
                        gEselection[3] = val.substring(val.indexOf('::') +2);
                    } else {
                        gEselection[2] = val;
                    }
                    return gEselection;
                }
                if (html.indexOf('class="fck_mw_category"') != -1 ||
                    html.indexOf('class=fck_mw_property') != -1
                   ) {
                    this.MatchSelectedNodeInDomtree(parent, tag, cont);
                    gEselection[0] = cont.replace(/&nbsp;/gi, ' ');
                    gEselection[1] = 14;
                    return gEselection;
                } // below here passing all closing brakets means that the selection
                  // was invalid
            }
            gEerrMsgSelection = window.parent.gLanguage.getMessage('WTP_SELECTION_OVER_FORMATS');
            gEerrMsgSelection = gEerrMsgSelection.replace('$1', '&lt;' + tag + '&gt;');
            return;
        }
        gEerrMsgSelection = window.parent.gLanguage.getMessage('WTP_SELECTION_OVER_FORMATS');
        gEerrMsgSelection = gEerrMsgSelection.replace('$1', '').replace(/:\s+$/, '!');
    },

   /**
    * from the parent node go over the child nodes and
    * select the appropriate child based on the string match that was
    * done before
    *
    * @access private
    * @param  DOMNode parent html element of the node (defined by name and value)
    * @param  string nodeName tag name
    * @param  string nodeValue content text of
    */
   MatchSelectedNodeInDomtree: function (parent, nodeName, nodeValue) {
        for(var i = 0; parent.childNodes && i < parent.childNodes.length; i++) {
            if (parent.childNodes[i].nodeType == 1 &&
                parent.childNodes[i].nodeName.toUpperCase() == nodeName &&
                parent.childNodes[i].innerHTML.replace(/^\s*/, '').replace(/\s*$/, '') == nodeValue) {
                gEselectedElement = parent.childNodes[i];
                return;
            }
        }
   },

   /**
    * Checks the current selection and returns the html content of the
    * selection.
    * i.e. select: "perty value show" and the returned string would be:
    * <span class="fck_mw_property property="myName">property value shown</span>
    *
    * @access private
    * @return string html selection including surounding html tags
    */
    getSelectionHtml: function() {

        var ckSel = gEeditor.getSelection(),
            selection = ckSel.getNative();
        if(selection.createRange) {
            var range = selection.createRange();
            var html = range.htmlText;
        }
        else {
            var range = selection.getRangeAt(selection.rangeCount - 1).cloneRange();
            var clonedSelection = range.cloneContents();
            var div = document.createElement('div');
            div.appendChild(clonedSelection);
            var html = div.innerHTML;
            // check if selection contains a html tag of span or a
            // i.e. link, property, category, because in these cases
            // we must select all of the inner content.
            var lowerTags = html.toLowerCase();
            if (lowerTags.indexOf('<span') == 0 || lowerTags.indexOf('<a') == 0) {
                // even though in the original the tag look like <span property...>This is my property rep</span>
                // the selected html might contain <span property...>property rep</span> only. To select all make
                // a text match of the content of the ancestor tag content.
                var parentContent = selection.getRangeAt(selection.rangeCount -1).commonAncestorContainer.innerHTML;
                // build a pattern of <span property...>property rep</span>
                var pattern = html.replace(/([().|?*{}\/])/g, '\\$1');
                pattern = pattern.replace('>', '>.*?');
                pattern = pattern.replace('<\\/', '.*?<\\/');
                pattern = '(.*)(' + pattern + ')(.*)';
                // the pattern is now: (.*)(<span property\.\.\.>.*?property rep.*?<\/span>)(.*)
                var rex = new RegExp(pattern)
                if (rex instanceof RegExp)
                    html = parentContent.replace(rex, '$2');
            }
        }
        return html.replace(/^\s*/, '').replace(/\s*$/, ''); // trim the selected text
    },

    /**
     * If in wikitext mode, this function gets the seleced text and must also
     * select the complete annotation if the selection is inside of [[ ]]. Also
     * selections inside templates etc. must be ignored.
     * Evaluated parameter will be stored in variable gEselection.
     *
     * @access private
     * @see    getSelectionAsArray() for details on the selection
     */
    getSelectionWikitext: function() {
        // selected text by the user in the textarea
        var selection = this.getSelectionFromTextarea();
        if (selection.length == 0) { // nothing selected
            gEselection[0] = "";
            return;
        }

        // complete text from the editing area
        var txt = gEeditor.getData();

        var p; // position marker for later

        var currChar; // current character that is observed

        // start look at the left side of the selection for any special character
        var currPos = gEstart;
        var stopper = -1;
        while (currPos > 0) {
            // go back one position in text area string.
            currPos--;
            currChar = txt.substr(currPos, 1);
            // "[" found, move the selection start there if there are two of them
            if (currChar == '[') {
                // one [ is in the selection and we didn't run over ] yet
                if (selection.substr(0, 1) == '[' && stopper < currPos) {
                    gEstart = currPos;        // is at position, stop here
                }
                else if (currPos > 0 &&
                         txt.substr(currPos -1, 1) == '[' &&
                         stopper < currPos) {         // previous pos
                    gEstart = currPos - 1;         // also contains a [
                    currPos--;
                }
            }
            // "]" found, stop looking further if there are two of them
            if (currChar == ']' && currPos > 0 && txt.substr(currPos -1, 1) == ']') {
                stopper = currPos;
                currPos--;
            }
            // ">" found, check it's the end of a tag, and if so, which type of tag
            if (currChar == '>') {
                // look for the corresponding <
                p = txt.substr(0, currPos).lastIndexOf('<');
                if (p == -1) continue; // no < is there, just go ahead
                var tag = txt.substr(p, currPos - p + 1);
                if (tag.match(/^<[^<>]*>$/)) { // we really found a tag
                    if (tag[1] == '/')  // we are at the end of a closing tag
                        break;          // stop looking any further back
                    else if (tag.match(/\s*>$/)) // it's a <tag />, stop here as well
                        break;
                }
            }
            // maybe we are inside a tag and found it's begining. Check that
            if (currChar == '<') {
                // look for the corresponding >
                p = selection.indexOf('>');
                if (p == -1) continue;
                var tag = txt.substr(currPos, gEstart + p + 1 - currPos);
                if (tag.match(/^<[^<>]*>$/)) { // we really found a tag
                    gEerrMsgSelection = window.parent.gLanguage.getMessage('WTP_NOT_IN_TAG');
                    gEerrMsgSelection = gEerrMsgSelection.replace('$1', txt.substr(gEstart, gEend - gEstart));
                    gEerrMsgSelection = gEerrMsgSelection.replace('$2', tag);
                    return this.clearSelection();
                }
            }
            // we are inside a template or parser function or whatever
            if (currChar == '{' && currPos > 0 && txt.substr(currPos - 1, 1) == '{') {
                gEerrMsgSelection = window.parent.gLanguage.getMessage('WTP_NOT_IN_TEMPLATE');
                gEerrMsgSelection = gEerrMsgSelection.replace('$1', txt.substr(gEstart, gEend - gEstart));
                return;
            }
            // end of a template or parser function found, stop here
            if (currChar == '}' && currPos > 0 && txt.substr(currPos - 1, 1) == '}')
                break;
        }

        // adjust selection if we moved the start position
        selection = txt.substr(gEstart, gEend - gEstart);

        // look for any special character at the right side of the selection
        currPos = gEend - 1;
        stopper = txt.length;
        while (currPos < txt.length - 2) {
            // move the possition one step forward in the string
            currPos++;
            currChar = txt.substr(currPos, 1);
            // if we find an open braket, move the selection start there
            if (currChar == ']') {
                if (selection.substr(selection.length - 1, 1) == ']' && stopper > currPos) {
                    gEend = currPos + 1;
                }
                else if (currPos < txt.length - 1 && txt.substr(currPos + 1, 1) == ']' && stopper > currPos) {
                    currPos++;
                    gEend = currPos + 1;
                }
            }
            // "[" found, stop looking further if there are two of them
            if (currChar == '[' && currPos < txt.length - 1 && txt.substr(currPos + 1, 1) == '[') {
                currPos++;
                stopper = currPos;
            }
            // we are inside a template or parser function or whatever
            if (currChar == '}' && currPos < txt.length - 1 && txt.substr(currPos + 1, 1) == '}') {
                gEerrMsgSelection = window.parent.gLanguage.getMessage('WTP_NOT_IN_TEMPLATE');
                gEerrMsgSelection = gEerrMsgSelection.replace('$1', txt.substr(gEstart, gEend - gEstart));
                return;
            }
            // we are facing the begining of a template or parser function, stop here
            if (currChar == '{' && currPos < txt.length - 1 && txt.substr(currPos + 1, 1) == '{')
                break;

            // "<" found, check it's the start of a tag, and if so, which type of tag
            if (currChar == '<') {
                // look for the corresponding >
                p = txt.substr(currPos).indexOf('>');
                if (p == -1) continue; // no > is there, just go ahead
                var tag = txt.substr(currPos, p + 1);
                if (tag.match(/^<[^<>]*>$/)) { // we really found a tag
                    if (tag.substr(1, 1) == '/') {  // we are at the end of a closing tag
                        gEerrMsgSelection = window.parent.gLanguage.getMessage('WTP_NOT_IN_TAG');
                        gEerrMsgSelection = gEerrMsgSelection.replace('$1', txt.substr(gEstart, gEend - gEstart));
                        gEerrMsgSelection = gEerrMsgSelection.replace('$2', tag);
                        return this.clearSelection(); // stop looking any further and quit
                    }
                    else if (tag.match(/\s*>$/)) // it's a <tag />, stop here as well
                        break;
                }
            }
            // maybe we are inside a tag and found it's end. Check that
            if (currChar == '>') {
                // look for the corresponding <
                p = selection.lastIndexOf('<');
                if (p == -1) continue;
                var tag = txt.substr(gEstart + p, currPos - gEstart - p + 1);
                if (tag.match(/^<[^<>]*>$/)) { // we really found a tag
                    gEerrMsgSelection = window.parent.gLanguage.getMessage('WTP_NOT_IN_TAG');
                    gEerrMsgSelection = gEerrMsgSelection.replace('$1', txt.substr(gEstart, gEend - gEstart));
                    gEerrMsgSelection = gEerrMsgSelection.replace('$2', tag);
                    return this.clearSelection();
                }
            }
        }
        // adjust selection if we moved the end position
        selection = txt.substr(gEstart, gEend - gEstart);

        // trim the selection
        selection = selection.replace(/^\s*/, '').replace(/\s+$/, '');
        gEselection[0] = selection;

        // now investigate the selected text and fill up the gEselection array

        // check for a property
        var regex = new RegExp('^\\[\\[(.*?)::(.*?)(\\|(.*?))?\\]\\]$');
        var match = regex.exec(selection);
        if (match) {
            gEselection[0] = match[2];
            gEselection[3] = match[2];
            gEselection[1] = 102;
            gEselection[2] = match[1];
            if (match[4])
                gEselection[0] = match[4];
            return;
        }
        // check for a category
        regex = new RegExp('^\\[\\[' + window.parent.gLanguage.getMessage('CATEGORY') + '(.*?)(\\|(.*?))?\\]\\]$');
        var match = regex.exec(selection);
        if (match) {
            gEselection[1] = 14;
            gEselection[0] = match[1];
            return;
        }
        // link
        regex = new RegExp('^\\[\\[:?(.*?)(\\|(.*?))?\\]\\]$');
        var match = regex.exec(selection);
        if (match) {
            gEselection[0] = match[1];
            return;
        }
        // check if there are no <tags> in the selection
        if (selection.match(/.*?(<\/?[\d\w:_-]+(\s+[\d\w:_-]+="[^<>"]*")*\s*(\/\s*)?>)+.*?/)) {
            gEerrMsgSelection = window.parent.gLanguage.getMessage('WTP_SELECTION_OVER_FORMATS');
            gEerrMsgSelection = gEerrMsgSelection.replace('$1', '').replace(/:\s+$/, '!');
            return this.clearSelection();
        }
        // if there are still [[ ]] inside the selection then more that a
        // link was selected making this selection invalid.
        if (selection.indexOf('[[') != -1 || selection.indexOf(']]') != -1 ) {
            gEerrMsgSelection = window.parent.gLanguage.getMessage('CAN_NOT_ANNOTATE_SELECTION');
            return this.clearSelection();
        }
        // if there are still {{ }} inside the selection then template or parser function
        // is inside the selection, make it invalid
        if (selection.indexOf('{{') != -1 || selection.indexOf('}}') != -1 ) {
            gEerrMsgSelection = window.parent.gLanguage.getMessage('WTP_NOT_IN_TEMPLATE');
            gEerrMsgSelection = gEerrMsgSelection.replace('$1', txt.substr(gEstart, gEend - gEstart));
            return this.clearSelection();
        }



        // finished, assuming the selection is good without any further modifying.
        return;
    },

    /**
     * Retrieve the selected text from the textarea when in wikitext mode.
     * If nothing is selected an empty string will be returned. Return value is
     * the selected text within the text area. If selection is not empty, then
     * gEstart and gEend are not -1.
     *
     * @access private
     * @return string selection
     */
    getSelectionFromTextarea: function() {

        var myArea = CKEditorTextArea( gEeditor ),
            selection = '';

        if ( CKEDITOR.env.ie ) {
            if (document.selection) {
                // The current selection
                var range = document.selection.createRange();
                // We'll use this as a 'dummy'
                var stored_range = range.duplicate();
                // Select all text
                stored_range.moveToElementText( myArea );
                // Now move 'dummy' end point to end point of original range
                stored_range.setEndPoint( 'EndToEnd', range );
                // Now we can calculate start and end points
                myArea.selectionStart = stored_range.text.length - range.text.length;
                myArea.selectionEnd = myArea.selectionStart + range.text.length;
            }
        }
        if (myArea.selectionStart != undefined) {
            gEstart = myArea.selectionStart;
            gEend = myArea.selectionEnd;
            selection = myArea.value.substr(gEstart, gEend - gEstart);
        }
        return selection;
    },

    /**
     * Make a previously selected text invalid, remove all markers in the
     * variables
     *
     * @access private
     */
    clearSelection: function() {
        gEstart = -1;
        gEend = -1;
        gEselection = Array();
    },

    // not needed but exists for compatiblity reasons
    setSelectionRange: function(start, end) {},
    // not needed but exists for compatiblity reasons
    getTextBeforeCursor: function() {},
    // not needed but exists for compatiblity reasons. The handling of selecting
    // the complete annotation is done in the getSelectionAsArray()
    selectCompleteAnnotation: function() {},

    focus: function() {
        gEeditor.focus();
    },

    /**
     *  enable output buffering. Text is not imediately written to the text
     *  area of the editor window. Changes are collected in the newText variable
     *  and then written once only to the editor area.
     *
     *  @access public
     */
    setOutputBuffer: function() {
        gEoutputBuffering = true;
    },


    /**
     *  flush the output buffer. Text is now written to the text area of the
     *  FCK editor. See the documentation of setValue() for a detailed
     *  documentation of the whole process.
     *
     *  @access public
     */
    flushOutputBuffer: function() {
        gEflushedOnce= false;
        if (gEflushedOnce) {
        function ajaxResponseSetHtmlText(request) {
            if (request.status == 200) {
                // success => store wikitext as FCK HTML
                gEeditor.setData(request.responseText);

            }
            gEditInterface.newText = '';
            gEditInterface.outputBuffering = false;
            gEoutputBuffering = false;
        };
        window.parent.sajax_do_call('wfSajaxWikiToHTML', [gEnewText],
                                    ajaxResponseSetHtmlText);
        return;
        }
        gEflushedOnce = true;
        gEeditor.setData(gEnewText);
        gEditInterface.outputBuffering = false;
        gEoutputBuffering = false;
    }

};


// global variable for the context menu itself
var ckePopupContextMenu;

/**
 * Create a new context menu for annotating a selection that is not yet annotated.
 * Both property and category container will be shown.
 *
 * @param Event event
 * @param string value selected text
 */
ShowNewToolbar = function(event, value) {
        var pos = CalculateClickPosition(event);
        var wtp = new window.parent.WikiTextParser();
        ckePopupContextMenu = new window.parent.ContextMenuFramework();
        ckePopupContextMenu.setPosition(pos[0], pos[1]);
        var relToolBar = new window.parent.RelationToolBar();
        var catToolBar = new window.parent.CategoryToolBar();
        relToolBar.setWikiTextParser(wtp);
        catToolBar.setWikiTextParser(wtp);
        relToolBar.createContextMenu(ckePopupContextMenu, value, value);
        catToolBar.createContextMenu(ckePopupContextMenu, value);
        ckePopupContextMenu.showMenu();
}

/**
 * Create a new context menu for annotating a property.
 * Only the property container will be shown.
 * The selected text is the representation at least. If value and represenation
 * are equal then the selected text is the value as well.
 *
 * @param Event event
 * @param string name of the property
 * @param string value of the property
 * @param string representation of the property
 */
ShowRelToolbar = function(event, name, value, show) {
        var pos = CalculateClickPosition(event);
        var wtp = new window.parent.WikiTextParser();
        ckePopupContextMenu = new window.parent.ContextMenuFramework();
        ckePopupContextMenu.setPosition(pos[0], pos[1]);
        var toolBar = new window.parent.RelationToolBar();
        toolBar.setWikiTextParser(wtp);
        toolBar.createContextMenu(ckePopupContextMenu, value, show, name);
        ckePopupContextMenu.showMenu();
}

ShowRelToolbarByOffset = function(element, propertyName, propertyValue, displayedText){
	var pos = CalculateElementPosition(element);
    var wtp = new window.parent.WikiTextParser();
    ckePopupContextMenu = new window.parent.ContextMenuFramework();
    ckePopupContextMenu.setPosition(pos[0], pos[1]);
    var toolBar = new window.parent.RelationToolBar();
    toolBar.setWikiTextParser(wtp);
    toolBar.createContextMenu(ckePopupContextMenu, propertyValue, displayedText, propertyName);
    ckePopupContextMenu.showMenu();
}

/**
 * Create a new context menu for annotating a category.
 * Only the category container will be shown.
 * The selected text is the category name.
 *
 * @param Event event
 * @param string name selected text
 */
ShowCatToolbar = function(event, name) {
        var pos = CalculateClickPosition(event);
        var wtp = new window.parent.WikiTextParser();
        ckePopupContextMenu = new window.parent.ContextMenuFramework();
        ckePopupContextMenu.setPosition(pos[0], pos[1]);
        var toolBar = new window.parent.CategoryToolBar();
        toolBar.setWikiTextParser(wtp);
        toolBar.createContextMenu(ckePopupContextMenu, name);
        ckePopupContextMenu.showMenu();
}

ShowCatToolbarByOffset = function(element, name) {
		var pos = CalculateElementPosition(element);
	    var wtp = new window.parent.WikiTextParser();
	    ckePopupContextMenu = new window.parent.ContextMenuFramework();
	    ckePopupContextMenu.setPosition(pos[0], pos[1]);
	    var toolBar = new window.parent.CategoryToolBar();
	    toolBar.setWikiTextParser(wtp);
	    toolBar.createContextMenu(ckePopupContextMenu, name);
	    ckePopupContextMenu.showMenu();
}




/**
 * Calculate correct x and y coordinates of event in browser window
 *
 * @param Event event
 * @return Array(int, int) coordinates x, y
 */
CalculateClickPosition = function(event) {
    var offset = GetOffsetFromOuterHtml();
    var pos = [];

    pos[0] = offset[0] + event.clientX;
    pos[1] = offset[1] + event.clientY;

    var sx;
    var sy;
    if (CKEDITOR.env.ie) {
        sx = (window.parent.document.documentElement.scrollLeft)
            ? window.parent.document.documentElement.scrollLeft
            : window.parent.document.body.scrollLeft;
        sy = (window.parent.document.documentElement.scrollTop)
            ? window.parent.document.documentElement.scrollTop
            : window.parent.document.body.scrollTop;
    }
    else {
        sx = window.parent.pageXOffset;
        sy = window.parent.pageYOffset;
    }
    if (sx > 0 && sx < pos[0]) pos[0] -= sx;
    if (sy > 0 && sy < pos[1]) pos[1] -= sy;

    return pos;
}


CalculateElementPosition = function(element) {
    var offset = GetOffsetFromOuterHtml();
    var pos = [0, 0];
    
    if(element.$){
	    pos[0] = offset[0] + element.$.offsetTop;
	    pos[1] = offset[1] + element.$.offsetLeft;
    }
    else if(jQuery(element).offset()){
    	pos[0] = offset[0] + jQuery(element).offset().top;
	    pos[1] = offset[1] + jQuery(element).offset().left;
    }

    var sx;
    var sy;
    if (CKEDITOR.env.ie) {
        sx = (window.parent.document.documentElement.scrollLeft)
            ? window.parent.document.documentElement.scrollLeft
            : window.parent.document.body.scrollLeft;
        sy = (window.parent.document.documentElement.scrollTop)
            ? window.parent.document.documentElement.scrollTop
            : window.parent.document.body.scrollTop;
    }
    else {
        sx = window.parent.pageXOffset;
        sy = window.parent.pageYOffset;
    }
    if (sx > 0 && sx < pos[0]) pos[0] -= sx;
    if (sy > 0 && sy < pos[1]) pos[1] -= sy;

    return pos;
}

/**
 * get offset from elements around the iframe
 *
 * @access public
 * @return array(int, int) offsetX, offsetY
 */
GetOffsetFromOuterHtml = function() {
    var id = (window.parent.wgAction == "formedit") // Semantic Forms?
        ? 'cke_free_text'
        : 'editform';
    var el = window.parent.document.getElementById(id);
    var offset = [];
    var editorName = window.parent.wgCKeditorInstance.name;
    offset[0] = 0; // x coordinate
    // y ccordinate gets hight of CKeditor toolbar added
    offset[1] = document.getElementById('cke_top_'+editorName).offsetHeight;
    offset[1] += 1;

    if (el.offsetParent) {
        do {
            offset[0] += el.offsetLeft;
            offset[1] += el.offsetTop;
        } while (el = el.offsetParent);
    }
    return offset;
}

/**
 * reomove the context menu from the DOM tree
 */
HideContextPopup = function() {
    if (ckePopupContextMenu) {
        ckePopupContextMenu.remove();
        ckePopupContextMenu = null;
    }
    // AC selection if there, remove it as well
   if (window.parent.autoCompleter) {
       window.parent.autoCompleter.hideSmartInputFloater();
   }
   window.parent.smwhgAnnotationHints.hideHints();
}

/**
 * Get the current frame with the wikipage. Skip the iframe from YUI (this
 * one has set an id).
 * This function should be more robust but's working for now.
 */
GetWindowOfEditor = function() {
    var frame;
    for (var i = 0; i < window.frames.length; i++) {
        if (window.frames[i].frameElement.id)
            continue;
        frame = window.frames[i];
        break;
    }
    return frame;
}

/**
 * fetches the current selected text from the gEditInterface (i.e. the FCK editor
 * area) and creates a context menu for annotating the selected text or modifying
 * the selected annotation.
 *
 * @param Event event
 */
CheckSelectedAndCallPopup = function(event) {
        if (!event) {
            var frame = GetWindowOfEditor();
            event = frame.event;
        }
        // handle here if the popup box for a selected annotation must be shown
        var selection = gEditInterface.getSelectionAsArray();
        if (selection == null || selection.length == 0) {
            var pos = CalculateClickPosition(event);
            var msg = gEditInterface.getErrMsgSelection();
            msg = msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            window.parent.smwhgAnnotationHints.showMessageAndWikiText(
                msg, '', pos[0], pos[1]);
            return;
        }
        // something is selected, this will be a new annotation,
        // offer both category and property toolbox
        if (selection.length == 1 && selection[0] != "") {
            ShowNewToolbar(event, selection[0]);
            return
        }
        // an existing annotation will be edited
        if (selection.length > 1) {
            if (selection[1] == 102) { // Property
                var show = selection[0];
                var val = show;
                if (selection.length == 4)  // an explizit property value is set, then
                    val = selection[3];     // it's different from the selected (show)
                ShowRelToolbar(event, selection[2], val, show);
            }
            else if (selection[1] == 14) { // Category
                ShowCatToolbar(event, selection[0]);
            }
        }
}

var CKEditorTextArea = function(editor) {
    return document.getElementById('cke_contents_' + editor.name).
               getElementsByTagName('textarea')[0];

}

CKEDITOR.plugins.smwtoolbar = {
    stbIsActive : false,
    stbEditorText : '',
    EnableAnnotationToolbar : function( editor ) {
        this.stbIsActive = true;
        window.parent.stb_control.initialize();
        window.parent.smwhgAnnotationHints = new window.parent.AnnotationHints();
        window.parent.propToolBar = new window.parent.PropertiesToolBar();

        window.parent.AdvancedAnnotation.create();
        window.parent.stb_control.stbconstructor();
        window.parent.stb_control.setCloseFunction('wgCKeditorInstance.execCommand(\'SMWtoolbar\')');
        window.parent.stb_control.createForcedHeader();
        window.parent.obContributor.registerContributor();
        window.parent.relToolBar.callme();
        window.parent.catToolBar.callme();
        window.parent.propToolBar.callme();
        // rule toolbar, only available if SemanticRuls extension is included
        // disable it for now, because the rule editor doesn't work with the FCK
        if (window.parent.ruleToolBar)
            window.parent.ruleToolBar.callme();
        // Annotations toolbar, only if SemanticGardening extension is included
        if (window.parent.smwhgGardeningHints)
            window.parent.smwhgGardeningHints.createContainer();
        window.parent.smw_links_callme();
        // enable draging
        window.parent.smwhg_dragresizetoolbar.draggable=null;
        window.parent.smwhg_dragresizetoolbar.callme();
        this.SetEventHandler4AnnotationBox( editor );
        editor.getCommand('SMWtoolbar').setState(CKEDITOR.TRISTATE_ON);
    },
    DisableAnnotationToolbar: function( editor ) {
        this.stbIsActive = false;
        HideContextPopup();
        window.parent.AdvancedAnnotation.unload();
        this.ClearEventHandler4AnnotationBox(editor);
        editor.getCommand('SMWtoolbar').setState(CKEDITOR.TRISTATE_OFF)
    },
    EditorareaChanges : function() {
        if (! this.stbIsActive) return;
        var editorData = this.editor.getData();
        if (this.stbEditorText != editorData) {
            window.parent.relToolBar.fillList();
            window.parent.catToolBar.fillList();
            this.stbEditorText = editorData;
        }
    },
    SetEventHandler4AnnotationBox : function (editor) {
        //        var element = CKEDITOR.document.getById('cke_contents_' + editor.name);
        this.editor = editor;
        if ( editor.mode == 'wysiwyg' ) {
            var frame = GetWindowOfEditor();
            if (CKEDITOR.env.ie) {
                var iframe = frame;
                var iframeDocument = iframe.document || iframe.contentDocument;
                iframeDocument.onkeyup = this.EditorareaChanges.bind(this);
                iframeDocument.onmouseup = CheckSelectedAndCallPopup;
                iframeDocument.onmousedown = HideContextPopup;
            } else {
                window.parent.Event.observe(frame, 'keyup', this.EditorareaChanges.bind(this));
                window.parent.Event.observe(frame, 'mouseup', CheckSelectedAndCallPopup);
                window.parent.Event.observe(frame, 'mousedown', HideContextPopup);
            }
//            window.parent.obContributor.activateTextArea(frame);
        } else {
            var Textarea = CKEditorTextArea(editor);
            window.parent.Event.observe(Textarea, 'keyup', this.EditorareaChanges.bind(this));
            window.parent.Event.observe(Textarea, 'mouseup', CheckSelectedAndCallPopup);
            window.parent.Event.observe(Textarea, 'mousedown', HideContextPopup);
            window.parent.obContributor.activateTextArea(Textarea);
        }
    },
    ClearEventHandler4AnnotationBox : function(editor) {
        this.editor = editor;
        if ( editor.mode == 'wysiwyg' ) {
            if (CKEDITOR.env.ie) {
                var iframe = window.frames[0];
                var iframeDocument = iframe.document || iframe.contentDocument;
                iframeDocument.onkeyup = null;
                iframeDocument.onmouseup = null;
                iframeDocument.onmousedown = null;
            } else {
                window.parent.Event.stopObserving(window.frames[0], 'keyup', this.EditorareaChanges);
                window.parent.Event.stopObserving(window.frames[0], 'mouseup', CheckSelectedAndCallPopup);
                window.parent.Event.stopObserving(window.frames[0], 'mousedown', HideContextPopup);
            }
        } else {
            var Textarea = CKEditorTextArea(editor);
            window.parent.Event.stopObserving(Textarea, 'keyup', this.EditorareaChanges);
            window.parent.Event.stopObserving(Textarea, 'mouseup', CheckSelectedAndCallPopup);
            window.parent.Event.stopObserving(Textarea, 'mousedown', HideContextPopup);
        }
    },
    loadToolbar : function ( editor ) {
        if (this.stbIsActive) {
            delete gEditInterface;
			if (CKEDITOR.env.ie) {
				window.parent.gEditInterface = null;
			} else {
	            delete window.parent.gEditInterface;
			}
            this.DisableAnnotationToolbar(editor);
        }
        else {
            gEditInterface = new CKeditInterface(editor);
            window.parent.gEditInterface = gEditInterface;
            this.EnableAnnotationToolbar(editor);
        }
    }

}

var plugin = CKEDITOR.plugins.smwtoolbar;
var commandDefinition =
	{
		preserveState : false,
		editorFocus : false,
		canUndo : false,
        modes : { wysiwyg : 1, source : 1 },

		exec: function( editor )
		{
			plugin.loadToolbar( editor );
		}
	};

CKEDITOR.plugins.add('smwtoolbar', {

    requires : [ 'mediawiki', 'editingblock' ],

    beforeInit : function( editor ) {
        // disable STB by default when loading the editor
        window.parent.AdvancedAnnotation.unload();
    },

	init : function( editor )
	{
		
		if (editor.contextMenu)
		{
			var editPropertyCommmand =
			{
					preserveState : false,
					editorFocus : true,
					canUndo : true,
			        modes : { wysiwyg : 1, source : 1 },

					exec: function( editor )
					{
						var propertyAttr = editPropertyCommmand.element.getAttribute('property');
						var classAttr = editPropertyCommmand.element.getAttribute('class');
						var jQueryLocator = '.' + classAttr + '[property=' + propertyAttr + ']'; 
						jQuery('iframe').contents().find(jQueryLocator).trigger('dblclick');
					}
			};
			
			var editCategoryCommmand =
			{
					preserveState : false,
					editorFocus : true,
					canUndo : true,
			        modes : { wysiwyg : 1, source : 1 },

					exec: function( editor )
					{
						var sortAttr = editCategoryCommmand.element.getAttribute('sort');
						var classAttr = editCategoryCommmand.element.getAttribute('class');
						var jQueryLocator = '.' + classAttr + '[sort=' + sortAttr + ']'; 
						jQuery('iframe').contents().find(jQueryLocator).trigger('dblclick');
					}
			};
			var removePropertyCommmand =
			{
					preserveState : false,
					editorFocus : true,
					canUndo : true,
			        modes : { wysiwyg : 1, source : 1 },

					exec: function( editor )
					{
						var propertyAttr = editPropertyCommmand.element.getAttribute('property');
						var displayedText = editPropertyCommmand.element.getText();
						var classAttr = editPropertyCommmand.element.getAttribute('class');
						
//						removePropertyCommmand.element.getParent().replaceChild(document.createTextNode(displayedText), editPropertyCommmand.element)
						var jQueryLocator = 'span:contains(\'' + displayedText + '\')[class=\'' + classAttr + '\'][property=\'' + propertyAttr + '\']'; 
						jQuery('iframe').contents().find(jQueryLocator).filter(function(){
							return jQuery(this).text() == displayedText;
						}).replaceWith(displayedText);
					}
			};
			
			var removeCategoryCommmand =
			{
					preserveState : false,
					editorFocus : true,
					canUndo : true,
			        modes : { wysiwyg : 1, source : 1 },

					exec: function( editor )
					{
						var sortAttr = editCategoryCommmand.element.getAttribute('sort');
						var classAttr = editCategoryCommmand.element.getAttribute('class');
						var jQueryLocator = '.' + classAttr + '[sort=' + sortAttr + ']'; 
						jQuery('iframe').contents().find(jQueryLocator).remove();
					}
			};
			editor.addCommand( 'editProperty', editPropertyCommmand);
			editor.addCommand( 'editCategory', editCategoryCommmand);
			editor.addCommand( 'removeProperty', removePropertyCommmand);
			editor.addCommand( 'removeCategory', removeCategoryCommmand);
			editor.addMenuGroup( 'mediawiki' );
			editor.addMenuItem( 'editPropertyItem',
					{
						label : 'Edit Property',
						command : 'editProperty',
						group : 'mediawiki'
					});
			
			editor.addMenuItem( 'editCategoryItem',
					{
						label : 'Edit Category',
						command : 'editCategory',
						group : 'mediawiki'
					});
			editor.addMenuItem( 'removePropertyItem',
					{
						label : 'Remove Property',
						command : 'removeProperty',
						group : 'mediawiki'
					});
			
			editor.addMenuItem( 'removeCategoryItem',
					{
						label : 'Remove Category',
						command : 'removeCategory',
						group : 'mediawiki'
					});
			
			editor.contextMenu.addListener( function( element )
			{
				if (element.getAttribute('class') === 'fck_mw_category'){
					editCategoryCommmand.categoryName = element.getAttribute('sort');
					editCategoryCommmand.element = element;
					removeCategoryCommmand.element = element;
		 			return { removeCategoryItem: CKEDITOR.TRISTATE_ON  //07.11.14 RL CKBuilder warning: Internet Explorer has a non-standard intepretation of trailing commas.
		 				/*, editCategoryItem  : CKEDITOR.TRISTATE_ON*/};
				}
				else if (element.getAttribute('class') === 'fck_mw_property'){
					editPropertyCommmand.element = element;
					removePropertyCommmand.element = element;
		 			return { removePropertyItem: CKEDITOR.TRISTATE_ON  //07.11.14 RL CKBuilder warning: IE + trailing commas
		 				/*, editPropertyItem  : CKEDITOR.TRISTATE_ON*/};
				}
				return null;
			});

		}
		
		editor.addCommand( 'SMWtoolbar', commandDefinition);
        if ( editor.ui.addButton ) {
            editor.ui.addButton( 'SMWtoolbar',
                {
                    label : 'Semantic Toolbar',
                    command : 'SMWtoolbar',
                    icon: this.path + 'images/tb_icon_semtoolbar.gif',
                    title: 'Semantic Toolbar'
                });
            editor.getCommand('SMWtoolbar').setState(CKEDITOR.TRISTATE_OFF);
        }
        
        // disable toolbar when switching mode
		editor.on( 'beforeCommandExec', function( ev ) {
			if ( !plugin.stbIsActive )
				return;
				
			if ( ( ev.data.name == 'source' || ev.data.name == 'newpage' ) && editor.mode == 'wysiwyg' ) {
				plugin.DisableAnnotationToolbar( editor );
            }
			if ( ( ev.data.name == 'wysiwyg' || ev.data.name == 'newpage' ) && editor.mode == 'source' ) {
				plugin.DisableAnnotationToolbar( editor );
            }
		});
        editor.on("dataReady", function(event) {
            if (plugin.stbIsActive) {
                gEnewText='';
                delete gEditInterface;
				if (CKEDITOR.env.ie) {
					window.parent.gEditInterface = null;
				} else {
		            delete window.parent.gEditInterface;
				}
				gEditInterface = new CKeditInterface(editor);
                window.parent.gEditInterface = gEditInterface;
                plugin.SetEventHandler4AnnotationBox(editor);
            }
//            jQuery('iframe').contents().find('.fck_mw_property').dblclick(function(dblClickEvent) {
//            	var element = jQuery(this);
//    			var property = element.attr('property').split('::');
//    			var displayedText = element.text();
//    			var propertyName = property[0];
//    			var propertyValue = property[1];
//    			ShowRelToolbarByOffset(element, propertyName, propertyValue, displayedText);
//    			dblClickEvent.preventDefault();
//    		});
//            
//            jQuery('iframe').contents().find('.fck_mw_category').dblclick(function(dblClickEvent) {
//            	var element = jQuery(this);
//    			var categoryName = element.attr('sort');
//    			ShowCatToolbarByOffset(element, categoryName);
//    			dblClickEvent.preventDefault();
//    		});
            
        });
        editor.on("resize", function(event) {
            if (plugin.stbIsActive) {
                var ontomenu = window.parent.document.getElementById('ontomenuanchor');
                // I have no clue how to know in which mode we are, so just set the z-index to some
                // value that works in both modes
                ontomenu.style.zIndex = editor.config.baseFloatZIndex + 10;
            }
        })

	}
});
})();
} else {
// SMWHalo not installed
CKEDITOR.plugins.add( 'smwtoolbar',
{
	requires : [ 'dialog' ],
	init : function( editor )
	{
		var command = editor.addCommand( 'SMWtoolbar', new CKEDITOR.dialogCommand( 'SMWtoolbar' ) );
		command.canUndo = false;

		editor.ui.addButton( 'SMWtoolbar',
			{
				label : 'Semantic Toolbar',
                title : 'Semantic Toolbar',
				command : 'SMWtoolbar',
                icon: this.path + 'images/tb_icon_semtoolbar.gif'
			});

		CKEDITOR.dialog.add( 'SMWtoolbar', this.path + 'dialogs/teaser.js' );
	}
});

}