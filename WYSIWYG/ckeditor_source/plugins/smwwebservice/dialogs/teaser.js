CKEDITOR.dialog.add( 'SMWwebservice', function( editor ) {

	return {
        title: 'SMW Webservice',
        minWidth : 390,
		minHeight : 230,
        buttons: [
            CKEDITOR.dialog.okButton
        ],
		contents : [
			{
				id : 'tab1',
				label : '',
				title : '',
				expand : true,
				padding : 0,
				elements : [
					{
						type: 'html',
                        html:
                            '<style type="text/css">' +
								'.cke_smwWws_container' +
								'{' +
									'color:#000 !important;' +
									'padding:10px 10px 0;' +
									'margin-top:5px' +
								'}' +
								'.cke_smwWws_container p' +
								'{' +
									'margin: 0 0 10px;' +
								'}' +
								'.cke_smwWws_container a' +
								'{' +
									'cursor:pointer !important;' +
									'color:blue !important;' +
									'text-decoration:underline !important;' +
								'}' +
							'</style>' +
							'<div class="cke_smwWws_container">' +
                                '<p>' +
                                    'You have requested to open the Webservice Wizzard, which is helpful if you want<br/>' +
                                    'to use data coming from web services.'+
                                '</p>' +
                                '<p>' +
                                    'In order to use this feature you require the "Data Import extension" which you<br/>'+
                                    'can download here for free: click here to download<br/>'+
                                    '(<a href="http://smwforum.ontoprise.com/smwforum/index.php/Data_Import_extension" target="new">'+
                                    'http://smwforum.ontoprise.com/smwforum/index.php/Data_Import_extension</a>)' +
                                '</p>' +
                            '</div>'
					}
				 ]
			}
		 ]

	};

} );