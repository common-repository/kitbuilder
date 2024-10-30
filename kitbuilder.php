<?php
/**
 * Plugin Name: KitBuilder
 * Description: Best front-end drag and drop page builder to create wordpress website in a minute.
 * Plugin URI: https://kitthemes.com/
 * Author: KitThemes
 * Version: 1.0.0
 * Author URI: https://kitthemes.com/
 *
 * Text Domain: kitbuilder
 *
 * Kitbuilder is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Kitbuilder is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

define( 'KITBUILDER_VERSION', '1.0.0' );

define( 'KITBUILDER__FILE__', __FILE__ );
define( 'KITBUILDER_PLUGIN_BASE', plugin_basename( KITBUILDER__FILE__ ) );
define( 'KITBUILDER_URL', plugins_url( '/', KITBUILDER__FILE__ ) );
define( 'KITBUILDER_PATH', plugin_dir_path( KITBUILDER__FILE__ ) );
define( 'KITBUILDER_ASSETS_URL', KITBUILDER_URL . 'assets/' );

add_action( 'plugins_loaded', 'kitbuilder_load_plugin_textdomain' );

if ( ! version_compare( PHP_VERSION, '5.4', '>=' ) ) {
	add_action( 'admin_notices', 'kitbuilder_fail_php_version' );
} else {
	require( KITBUILDER_PATH . 'includes/plugin.php' );
}

/**
 * Load gettext translate for our text domain.
 *
 * @since 1.0.0
 *
 * @return void
 */
function kitbuilder_load_plugin_textdomain() {
	load_plugin_textdomain( 'kitbuilder' );
}

/**
 * Show in WP Dashboard notice about the plugin is not activated.
 *
 * @since 1.0.0
 *
 * @return void
 */
function kitbuilder_fail_php_version() {
	$message = esc_html__( 'Kitbuilder requires PHP version 5.4+, plugin is currently NOT ACTIVE.', 'kitbuilder' );
	$html_message = sprintf( '<div class="error">%s</div>', wpautop( $message ) );
	echo wp_kses_post( $html_message );
}
