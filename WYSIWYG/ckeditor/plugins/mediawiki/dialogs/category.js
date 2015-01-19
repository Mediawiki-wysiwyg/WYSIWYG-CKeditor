//
// File: WYSIWYG/ckeditor/plugins/mediawiki/dialogs/category.js
//
// Versions:
// 08.01.14 RL  More advanced dialog based on link.js, selection list for existing categories
//
CKEDITOR.dialog.add( 'MWCategory', function( editor ) {
{
    // need this to use the getSelectedLink function from the plugin
    var plugin = CKEDITOR.plugins.link;
    var searchTimer;
    var catTree;
    var selectedCats;
	var placeholder = '.';

	function GetControl(dialog, controlName) {
	    var e = dialog.getContentElement('mwCategoryTab1', controlName);
	    var div = document.getElementById(e.domId);
        return div.getElementsByTagName('select')[0];
	}

	function AddSelectOption(select, text, value) {
	    var option = document.createElement("option");
	    option.value = value;
	    option.text = text;
	    select.add(option);
	    return option;
	}

	function ShowCategoriesSubTree(dialog, rowInTree) {

	    if (catTree == null)
	        return;

	    var select = GetControl(dialog, 'categoryList');
	    var row = parseInt(rowInTree);
	    var root = 'root';
	    var lvl = -1;
	    var prefix = '';
	    if (row >= 0) {
	        root = select.options[row].text;
	        lvl = 0;
	        while (root.charAt(lvl) == placeholder)
	            lvl++;
	        root = root.slice(lvl);
	        if (root.charAt(0) == '[' && root.charAt(root.length - 1) == ']')
	            root = root.substring(1, root.length - 1);
	        prefix = new Array(lvl + 1 + 3).join(placeholder);
	    }
	    if (!catTree[root])
	        return;

	    var itCount = select.options.length;
	    var itSkip = row + 1;
	    var opts = new Array();
	    for (var i = row + 1 ; i < itCount ; i++) {
	        var t = select.options[i].text;
	        var sublvl = 0;
	        while (t.charAt(sublvl) == placeholder)
	            sublvl++;
	        if (sublvl > lvl)
	            itSkip = i + 1;
	        else
	            break;
	    }
	    for (var i = itCount - 1 ; i > row ; i--) {
	        var t = select.options[i].text;
	        if (i >= itSkip)
	            opts.push(t);
	        select.remove(i);
	    }
	    if (itSkip == row + 1) {
	        var cats = catTree[root].split(' ');

	        for (var k in cats) {
	            var p = cats[k];
	            if (catTree[cats[k]])
	                p = '[' + p + ']';
	            var e = AddSelectOption(select, prefix + p, ++row);
	            if (catTree[cats[k]])
	                e.style.color = '#00f';

	        }
	    }
	    for (var i = opts.length - 1 ; i >= 0 ; i--) {
	        var e = AddSelectOption(select, opts[i], ++row);
	        if (opts[i].indexOf('[') >= 0)
	            e.style.color = '#00f';
	    }
	}

	function ShowFilteredCategories(dialog, filter) {

	    var select = GetControl(dialog, 'categoryList');
	    ClearList(dialog, 'categoryList');

	    var found = new Object();
	    if (filter.length == 0) {
	        ShowCategoriesSubTree(dialog, -1);
	        return;
	    }
	    filter = filter.toLowerCase();
	    var row = -1;
	    for (var folder in catTree) {
	        var cats = catTree[folder].split(' ');
	        for (var k in cats) {
	            var p = cats[k].toLowerCase();
	            if (p.indexOf(filter) >= 0) {
	                if (found[cats[k]])
	                    ;
	                else {
	                    found[cats[k]] = cats[k];
	                    AddSelectOption(select, cats[k], ++row);
	                }
	            }
	        }
	    }
	}

	function ClearList(dialog, controlName) {
	    var e = dialog.getContentElement('mwCategoryTab1', controlName);
	    e.items = [];
	    var div = document.getElementById(e.domId),
            select = div.getElementsByTagName('select')[0];
	    while (select.options.length > 0)
	        select.remove(0);
	}

	function UpdateSelection(dialog, cat) {
	    if ( selectedCats[ cat ] )
	        delete selectedCats[ cat ];
	    else
	        selectedCats[ cat ] = cat;

	    ClearList(dialog, 'categoryValues');
	    var select = GetControl(dialog, 'categoryValues');
	    for (cat in selectedCats)
	        AddSelectOption( select, cat, cat );
    }

	var OnDialogLoad = function () {
	    var dialog = this.getDialog();

	    window.parent.sajax_do_call('wfSajaxSearchCategoryCKeditor', [], InitCategoryTree);

	    function InitCategoryTree(result) {
	        catTree = new Object();
	        var levelsHead = new Array('root');
	        var levelsBody = new Array('');

	        var results = result.responseText.Trim().split('\n');
	        var previousLvl = -1;
	        for (var i = 0 ; i < results.length ; i++) {
	            var lvl = 0;
	            while (results[i].charAt(lvl) == ' ')
	                lvl++;
	            var t = results[i].slice(lvl);
	            for (var j = previousLvl ; j > lvl - 1 ; j--) {
	                if (levelsBody[j + 1] != '')
	                    catTree[levelsHead[j + 1]] = levelsBody[j + 1];
	                delete levelsHead[j + 1];
	                delete levelsBody[j + 1];
	            }
	            if (lvl > previousLvl)
	                levelsBody[lvl] = t;
	            else
	                levelsBody[lvl] = levelsBody[lvl] + ' ' + t;
	            levelsHead[lvl + 1] = t;
	            levelsBody[lvl + 1] = '';
	            previousLvl = lvl;
	        }
	        for (var j = previousLvl ; j >= -1 ; j--) {
	            if (levelsBody[j + 1] != '')
	                catTree[levelsHead[j + 1]] = levelsBody[j + 1];
	            delete levelsHead[j + 1];
	            delete levelsBody[j + 1];
	        }

	        ShowCategoriesSubTree(dialog , - 1);
	    }
	}

	var OnClickCategoryList = function () {
	    var dialog = this.getDialog();
	    ShowCategoriesSubTree(dialog, event.srcElement.value);
	}

	var OnDblClickCategoryList = function () {
	    var dialog = this.getDialog();
	    var row = parseInt(event.srcElement.value);
	    var select;

	    if ( row >= 0 ) {
	        select = GetControl(dialog, 'categoryList');
	        var cat = select.options[ row ].text;
	        var lvl = 0;
	        while ( cat.charAt( lvl ) == placeholder )
	            lvl++;
	        cat = cat.slice( lvl );
	        if ( cat.charAt( 0 ) == '[' && cat.charAt( cat.length - 1 ) == ']' )
	            cat = cat.substring(1, cat.length - 1);

	        UpdateSelection(dialog, cat);
	    }
	}

	var OnDblClickCategoryValues = function () {
	    var dialog = this.getDialog();
	    UpdateSelection(dialog, event.srcElement.value);
	}

	var OnClickAddButton = function () {
	    var dialog = this.getDialog();
	    var e = dialog.getContentElement('mwCategoryTab1', 'categorySearch');
        var value = e.getValue().Trim().replace(/ /g, '_');
        if (value != "")
            UpdateSelection(dialog, value);
        dialog.setValueOf('mwCategoryTab1', 'categorySearch', "");
	}

	var OnSearchChange = function () {
	
	    var dialog = this.getDialog();

	    var e = dialog.getContentElement('mwCategoryTab1', 'categorySearch'),
        value = e.getValue().Trim().replace(/ /g, '_'); //12.12.14 RL ' '=>'_'
	    ShowFilteredCategories(dialog, value);
    }

	var loadElements = function (editor, selection, element) {
		
		element.editMode = true;

		//Get values of category and sort key 
		var category = element.getText().replace(/ /g, '_');  //08.09.14 RL Added replace
		var SelectedCategories = GetControl(this, 'categoryValues');

		ClearList(this, 'categoryValues')
		if (category.length > 0) {
		    selectedCats[category] = category;
            AddSelectOption(SelectedCategories, category, category)
		}
	}
	   
        return {
            title : editor.lang.mwplugin.categoryTitle, //'Add/modify category'
            minWidth : 350,
            minHeight : 500,
            resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
			contents : [
				{
					id : 'mwCategoryTab1',
					label : 'Add category',
                    title : 'Add category',
					elements :
					[
                        {
                            id: 'categoryValues',
                            type: 'select',
                            size: 4,
                            label: editor.lang.mwplugin.category,
                            title: 'Write name of category',
                            required: false,
                            style: 'border: 1px; width:100%;',
                            onLoad: OnDialogLoad,
                            onDblClick: OnDblClickCategoryValues,
                            items: []
                        },
                        {
                            id: 'categorySearch',
                            type: 'text',
                            label: 'Recherche',
                            title: 'Recherche',
                            style: 'border: 1px;',
                            onKeyUp: OnSearchChange,
                            onChange: OnSearchChange
                        },
                        {
                            id: 'categoryAdd',
                            type: 'button',
                            label: 'Ajouter',
                            title: 'Ajouter',
                            onClick: OnClickAddButton
                        },
                        {
                            id: 'searchMsg',
                            type: 'html',
                            style: 'font-size: smaller; font-style: italic;',
                            html: editor.lang.mwplugin.startTyping
                        },
                        {
                            id: 'categoryList',
                            type: 'select',
                            size: 20,
                            label: editor.lang.mwplugin.selfromCategoryList, //'Select from list of existing categories:'
                            title: 'Category list',
                            required: false,
                            style: 'border: 1px; width:100%;',
                            onClick: OnClickCategoryList,
                            onDblClick: OnDblClickCategoryList,
                            items: []
                        }
		            ]
                }
            ],

            onOk : function() {
				
				var editor = this.getParentEditor();

				for ( var category in selectedCats ) {
					var realElement = CKEDITOR.dom.element.createFromHtml('<span></span>');

					//Name FCK class for category element.	
					realElement.setAttribute('class','fck_mw_category');					
					
					//Name of category	 
					if ( category.length > 0 )
						realElement.setText( category );
											
					//Are there any additional attributes used by html format?  
					var fakeElement = editor.createFakeElement( realElement , 'FCK__MWCategory', 'span', false );
					editor.insertElement(fakeElement);
				}
            },

    		onShow : function()
    		{
    		    selectedCats = new Array();
    		    // clear old selection list from a previous call
                var editor = this.getParentEditor(),
                    e = this.getContentElement('mwCategoryTab1', 'categoryList');
                    e.items = [];
                var div = document.getElementById(e.domId),
                    select = div.getElementsByTagName('select')[0];
                while (select != null && select.options != null && select.options.length > 0)
                    select.remove( 0 );
                var e = this.getContentElement( 'mwCategoryTab1', 'searchMsg' );
                var message = editor.lang.mwplugin.startTyping;
                e.html = message;
                document.getElementById(e.domId).innerHTML = message;

				/*This was taken from first simple dialog for category definitions.*/
				this.editObj = false;
				this.fakeObj = false;
				this.editMode = false;
		
				var selection = editor.getSelection();
				var element = selection.getSelectedElement();
				var seltype = selection.getType();

				//12.12.14 RL CKEDITOR.SELECTION_NONE=0 (no selection), CKEDITOR.SELECTION_TEXT=2, CKEDITOR.SELECTION_ELEMENT=3
				if (element != null && element.getAttribute('class') == 'FCK__MWCategory' && (seltype == CKEDITOR.SELECTION_TEXT || seltype == CKEDITOR.SELECTION_ELEMENT) )
				{
					this.fakeObj = element;
					element = editor.restoreRealElement( this.fakeObj );
					loadElements.apply( this, [ editor, selection, element ] );
					selection.selectElement( this.fakeObj );
				}
				else if ( seltype == CKEDITOR.SELECTION_TEXT )
				{
				    this.setValueOf('mwCategoryTab1', 'categorySearch', selection.getSelectedText().replace(/ /g, '_')); //09.09.14 RL<- 
                }
				this.getContentElement('mwCategoryTab1', 'categorySearch').focus();
        	}
        }
}
} );
