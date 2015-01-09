var ar2Admin;
( function( $ ) {

ar2Admin = {
	
	init : function() {

		var curMediaUploadId;
	
		$( '.form-table input, .form-table select' ).live( 'change', function() {
			window.onbeforeunload = function() {
				//return ar2Admin_l10n.changedConfirmation;	
			}
		} );
		
		$( '.terms-multiselect' ).remove();
		
		$( 'input.tokeninput' ).each( function( index ) {
			ar2Admin.initTokenInput( this );
		} );
		
		$( '#ar2-theme-options-form' ).submit( function() {
			window.onbeforeunload = null;
		} );
		
		$( '.form-table select.post-dropdown' ).live( 'change', function() {
			ar2Admin.loadTaxonomies( this );
		} );
		
		$( '.form-table select.tax-dropdown' ).live( 'change', function() {
			var posttype_dropdown = $( this ).parents( '.form-table' ).find( 'select.post-dropdown' );
			ar2Admin.loadTerms( posttype_dropdown, this );
		} );
		
		
		$( '.reset-thumbnail-sizes' ).click( function() {
			var fields = $( this ).parents( '.thumbnail-size-fields' );
			
			$( fields ).find( 'input.thumb-width' ).val( $( fields ).find( '.thumbnail_default_width' ).html() );
			$( fields ).find( 'input.thumb-height' ).val( $( fields ).find( '.thumbnail_default_height' ).html() );
			
			$( this ).parents( 'td' ).css( 'backgroundColor', 'yellow' );
			$( this ).parents( 'td' ).animate( { backgroundColor: 'white' }, 500 );
		} );
		
		$( '#ar2-theme-options' ).tabs();

		$( '.media-upload-add' ).click( function() {

			curMediaUploadId = $( this ).attr( 'data-upload-field' );

			if ( ar2Admin_l10n.isNewMediaManager ) {
				var sendAttachmentBackup = wp.media.editor.send.attachment;

				wp.media.editor.send.attachment = function( props, attachment ) {
					$( '#media-upload-' + curMediaUploadId ).val( attachment.url );
					$( '#media-upload-img-' + curMediaUploadId ).attr( 'src', attachment.url );

					wp.media.editor.send.attachment = sendAttachmentBackup;
				}
				wp.media.editor.open( curMediaUploadId );
			} else {
				tb_show( ar2Admin_l10n.uploadMediaTitle, 'media-upload.php?referer=ar2-theme-options&type=image&TB_iframe=true&post_id=0', false );
			}
	
			return false;
		} );

		$( '.media-upload-remove' ).click( function() {

			var id = $( this ).attr( 'data-upload-field' );
			$( '#media-upload-' + id ).val( null );
			$( '#media-upload-img-' + id ).attr( 'src', null );
			return false;

		} );

		if ( !ar2Admin_l10n.isNewMediaManager ) {
			window.send_to_editor = function( html ) {
				var imageUrl = $( 'img', html ).attr( 'src' );

				$( '#media-upload-' + curMediaUploadId ).val( imageUrl );
				$( '#media-upload-img-' + curMediaUploadId ).attr( 'src', imageUrl );

				tb_remove();
				curMediaUploadId = null;
			}
		}

	},
	
	initTokenInput : function( input ) {
	
		$( input ).tokenInput( ajaxurl, {
			method		: 'POST',
			queryAction	: 'ar2_load_terms',
			queryParam	: 'query',
			minChars	: 2,
			preventDuplicates: true,
			prePopulate : ar2Admin_l10n[ $( input ).attr( 'id' ) ],
			limit		: $( input ).parents( '.form-table' ).find( 'select.tax-dropdown option:selected' ).val()
		} );
		
	},

	loadTaxonomies : function( posttype_ui ) {
	
		$( posttype_ui ).attr( 'disabled', 'disabled' );
		
		this.hideTermsFields( posttype_ui );
		
		var tax_dropdown 	= $( posttype_ui ).parents( '.form-table' ).find( 'select.tax-dropdown' );
		var tax_loading_img = $( posttype_ui ).parents( '.form-table' ).find( '.tax-dropdown-container .ajax-feedback' );
		
		$( tax_dropdown ).hide();
		$( tax_loading_img ).css( 'visibility', 'visible' );
		
		var data = {
			'action'	: 'ar2_load_taxonomies',
			'post_type'	: $( posttype_ui ).find( 'option:selected' ).val()
		};
		
		$.ajax( {
			'url'		: ajaxurl,
			'type'		: 'POST',
			'dataType'	: 'json',
			'data'		: data,
			'success'	: function( d ) {
				if ( typeof d == 'object' ) {
					$( tax_loading_img ).css( 'visibility', 'hidden' );
					$( posttype_ui ).removeAttr( 'disabled' );
					
					var no_tax = false;
					
					$( tax_dropdown ).empty();
					$.each( d, function( i, item ) {
						$( tax_dropdown ).append( '<option value="' + i + '">' + item + '</option>' );
						if ( i == 0 ) no_tax = true;
					} );
					
					if ( no_tax ) {
						$( tax_dropdown ).attr( 'disabled', 'disabled' );
						$( tax_dropdown ).show();
					} else {
						$( tax_dropdown ).removeAttr( 'disabled' );
						$( tax_dropdown ).children( 'option:first' ).attr( 'selected', 'selected' );
						$( tax_dropdown ).show();
						
						ar2Admin.loadTerms( this, tax_dropdown );
					}
				}
			}
		} );

	},
	
	loadTerms : function( posttype_ui, tax_ui ) {
	
		$( tax_ui ).parents( '.form-table' ).find( 'input.tokeninput' ).tokenInput( 'setLimit', $( tax_ui ).parents( '.form-table' ).find( 'select.tax-dropdown option:selected' ).val() );
		$( tax_ui ).parents( '.form-table' ).find( 'input.tokeninput' ).tokenInput( 'clear' );
		
		$( tax_ui ).parents( '.form-table' ).find( '.cat-dropdown-multiselect' ).show();
		$( tax_ui ).parents( '.form-table' ).find( '.cat-dropdown-container .choosetax' ).hide();
		
	},
	
	hideTermsFields : function( source_ui ) {
	
		$( source_ui ).parents( '.form-table' ).find( '.cat-dropdown-multiselect' ).hide();
		$( source_ui ).parents( '.form-table' ).find( '.cat-dropdown-container .choosetax' ).show();
		
	}
		
};

$( document ).ready( function() { ar2Admin.init(); } );

} )( jQuery );

