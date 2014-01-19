CKEDITOR.dialog.add( 'SMWqi', function( editor ) {

	return {
        title: 'Query Interface',
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
								'.cke_smwqi_container' +
								'{' +
									'color:#000 !important;' +
									'padding:10px 10px 0;' +
									'margin-top:5px' +
								'}' +
								'.cke_smwqi_container p' +
								'{' +
									'margin: 0 0 10px;' +
								'}' +
								'.cke_smwqi_container a' +
								'{' +
									'cursor:pointer !important;' +
									'color:blue !important;' +
									'text-decoration:underline !important;' +
								'}' +
							'</style>' +
							'<div class="cke_smwqi_container">' +
                                '<p>' +
                                    'You have requested to open the Query Interface, which is helpful if you want<br/>' +
                                    'query for semantic data in this Wiki.'+
                                '</p>' +
                                '<p>' +
                                    'In order to use this feature you require the "Halo extension" which you<br/>'+
                                    'can download here for free: click here to download<br/>'+
                                    '(<a href="http://smwforum.ontoprise.com/smwforum/index.php/HaloExtension_Product_Information">'+
                                    'http://smwforum.ontoprise.com/smwforum/index.php/HaloExtension_Product_Information</a>)' +
                                '</p>' +
                            '</div>'
					}
				 ]
			}
		 ]

	};

} );