<?php


/*
Plugin Name: WordPress Social Ring
Description: Let visitors share posts/pages on Social Networks.
Author: Niccol&ograve; Tapparo & Fabio Gioria
Version: 1.3.0
Author URI: http://wordpress.altervista.org/
Plugin URI: http://wordpress.altervista.org/wordpress-social-ring/
*/

define( 'WP_SOCIAL_RING', 'wp_social_ring' );
define( 'WP_SOCIAL_RING_PATH', plugin_dir_path(__FILE__) );
define( 'WP_SOCIAL_RING_URL', plugin_dir_url(__FILE__) );
register_activation_hook(__FILE__,'social_ring_install');
load_plugin_textdomain(WP_SOCIAL_RING, false, dirname(plugin_basename(__FILE__)).'/langs/');


//Set defaults if not defined
$wp_social_ring_options = get_option(WP_SOCIAL_RING.'_options');

if( ! isset ($altervista) ) {
	include WP_SOCIAL_RING_PATH.'/includes/library.php';
	include WP_SOCIAL_RING_PATH.'/includes/widgets.php';

	if(is_admin()) {
		include WP_SOCIAL_RING_PATH.'/admin/admin.php';
	}
} else {
	include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
	deactivate_plugins( 'wordpress-social-ring/wp-social-ring.php' );
}

function social_ring_install() {

	$wp_social_ring_options = get_option(WP_SOCIAL_RING.'_options');

	if(empty($wp_social_ring_options)) {

		$wp_social_ring_options = array (
			'social_visible_buttons_list' => 'social_facebook_like_button|social_facebook_share_button|social_twitter_button|social_google_button|social_pin_it_button|',
			'social_available_buttons_list' => 'social_google_share_button|social_linkedin_button|social_stumble_button|social_print_pdf_email_button|',				'social_retrocompatibility' => 1,
			'social_facebook_like_button' => 1,
			'social_facebook_share_button' => 1,
			'social_twitter_button' => 1,
			'social_google_button' => 1,
			'social_google_share_button' => 0,
			'social_pin_it_button' => 1,
			'social_linkedin_button' => 0,
			'social_stumble_button' => 0,
			'social_print_pdf_email_button' => 0,
			'social_print_button' => 0,
			'social_create_pdf_button' => 0,
			'social_send_email_button' => 0,
			'social_on_home' => 0,
			'social_on_pages' => 0,
			'social_on_posts' => 1,
			'social_on_category' => 0,
			'social_on_archive' => 0,
			'social_before_content' => 1,
			'social_after_content' => 0,
			'language' => 'Englsh',
			'facebook_language' => 'en_US',
			'google_language' => 'en-US',
			'twitter_language' => 'en',
			'button_counter' => 'horizontal'

		);
		update_option(WP_SOCIAL_RING.'_options', $wp_social_ring_options);
	}
}
?>