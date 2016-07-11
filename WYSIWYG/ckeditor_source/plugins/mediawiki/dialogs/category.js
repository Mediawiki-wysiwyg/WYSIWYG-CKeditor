//
// File: WYSIWYG/ckeditor/plugins/mediawiki/dialogs/category.js
//
// Versions:
// 08.01.14 RL  More advanced dialog based on link.js, selection list for existing categories.
// 19.01.15 DB  Support for hierarchical categories, more user friendly dialog to work with categories.
// 20.01.15 RL  Translations based on user preferences.
// 28.07.15 Varlin: Restored parts of original code of category handling and fixed missing parts. 
// 01.09.15 RL  Doubleclick of category element fixed in plugin.js. Problem: Category element is editable 
//              in wysiwyg mode, which may cause problems. Users must be advised to edit categories using dialog.
// 22.02.16 RL  Modifications because of some legacy functions were removed with MW1.26.

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
	    cat = cat.replace(/_/g, ' ');
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

	    // window.parent.sajax_do_call('wfSajaxSearchCategoryCKeditor', [], InitCategoryTree); // 22.02.16 RL
		window.parent.$.post( mw.util.wikiScript(), { // 22.02.16 RL
				action: 'ajax', 
				rs: 'wfSajaxSearchCategoryCKeditor', 
				rsargs: [] 
				},
				InitCategoryTree
			); 	

	    function InitCategoryTree(result) {
	        catTree = new Object();
	        var levelsHead = new Array('root');
	        var levelsBody = new Array('');
	        var previousLvl = -1;
	        var results;

			if (typeof result.responseText != 'undefined')         // 22.02.16 RL
				results = result.responseText.Trim().split('\n');
			else 
				results = result.Trim().split('\n');               // 22.02.16 RL


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
	    var select = GetControl(dialog, 'categoryList');
	    ShowCategoriesSubTree(dialog, select.value);
	}

	var OnDblClickCategoryList = function () {
	    var dialog = this.getDialog();
	    var select = GetControl(dialog, 'categoryList');
	    var row = parseInt(select.value);

	    if ( row >= 0 ) {
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
	    var select = GetControl(dialog, 'categoryValues');
	    UpdateSelection(dialog, select.value);
	}

	var OnClickAddButton = function () {
	    var dialog = this.getDialog();
	    var e = dialog.getContentElement('mwCategoryTab1', 'categorySearch');
	    var value = e.getValue().Trim();
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

	var loadElements = function (element) {
		
		element.editMode = true;

		//Get values of category and sort key 
		var category = element.getText().replace(/_/g, ' ');
		var selectedCategories = GetControl(this, 'categoryValues');

		if (category.length > 0) {
		    selectedCats[category] = category;
		    AddSelectOption(selectedCategories, category, category);
		}
	}
	   
        return {
            title : editor.lang.mwplugin.categoryTitle, //Modify categories of page
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
                            size: 6,
                            label: editor.lang.mwplugin.categorySelected, //Page belongs to these categories
                            title: editor.lang.mwplugin.categorySelected,
                            required: false,
                            style: 'border: 1px; width: 100%;',
                            onLoad: OnDialogLoad,
                            onDblClick: OnDblClickCategoryValues,
                            items: []
                        },
                        {
                            id: 'categorySearch',
                            type: 'text',
                            label: editor.lang.mwplugin.category, //Type text to search for or to create a new category
                            title: editor.lang.mwplugin.category,
                            style: 'border: 1px;',
                            onKeyUp: OnSearchChange,
                            onChange: OnSearchChange
                        },
                        {
                            id: 'categoryAdd',
                            type: 'button',
                            label: editor.lang.mwplugin.categorybtn, //Create new category
                            title: editor.lang.mwplugin.categorybtn,
                            onClick: OnClickAddButton
                        },
                        {
                            id: 'categoryList',
                            type: 'select',
                            size: 22,
                            label: editor.lang.mwplugin.selfromCategoryList, //Select category from list of existing categories
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
				
                //Clear old categories
                var catList = editor.document.find('.fck_mw_category');   // 28.07.2015 : was FCK__MWCategory
                if (catList.count() > 0) {
                    for (var i = catList.count() - 1; i > -1  ; i--) {
                        catList.getItem(i).remove();
                    }
                }

                // Move selection to the end of the editable element.
                var range = editor.createRange();
                range.moveToPosition(range.root, CKEDITOR.POSITION_BEFORE_END);
                editor.getSelection().selectRanges([range]);

                //Insert new categories
				for ( var category in selectedCats ) {
					var realElement = CKEDITOR.dom.element.createFromHtml('<span></span>');

					//Name FCK class for category element.	
					realElement.setAttribute('class','fck_mw_category');
					realElement.setAttribute('contenteditable','false'); //disable editing of object
					
					//Name of category	 
					if ( category.length > 0 )
						realElement.setText( category );
											
					//Are there any additional attributes used by html format?  
					/*28.07.2015***	
					var fakeElement = editor.createFakeElement(realElement, 'FCK__MWCategory', 'span', false);  
					fakeElement.$.alt = category.replace(/"/g,'');   //31.01.15 RL Replace quotes
					fakeElement.$.title = category.replace(/"/g,''); //31.01.15 RL Replace quotes
					****/
					editor.insertElement(realElement);  // was fakeElement
                }
            },

    		onShow : function()
    		{
    		    selectedCats = new Array();
    		    ClearList(this, 'categoryValues');
    		    ClearList(this, 'categoryList');
    		    ShowCategoriesSubTree(this, -1);

				/*This was taken from first simple dialog for category definitions.*/
				this.editObj = false;
				this.fakeObj = false;
				this.editMode = false;
		
    		    //Load categories
                var catList = editor.document.find('.fck_mw_category'); //28.07.2015 : Was FCK__MWCategory
                if (catList.count() > 0) {
                    for (var i=0;i<catList.count();i++) {
                        this.fakeObj = catList.getItem(i);
                        var element = this.fakeObj;                     //28.07.2015 : Was var element = editor.restoreRealElement(this.fakeObj);
				        loadElements.apply(this, [element]);
				    }

                } else {
				    var selection = editor.getSelection();
                    this.setValueOf('mwCategoryTab1', 'categorySearch', selection.getSelectedText().replace(/ /g, '_')); //09.09.14 RL 
                }

				this.getContentElement('mwCategoryTab1', 'categorySearch').focus();
        	}
        }
}
} );
