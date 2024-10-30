<?php
namespace Kitbuilder;

use Kitbuilder\Plugin;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Tools {

	const PAGE_ID = 'kitbuilder-tools';

	public static function get_url() {
		return admin_url( 'admin.php?page=' . self::PAGE_ID );
	}

	public function register_admin_menu() {
		add_submenu_page(
			Settings::PAGE_ID,
			__( 'Tools', 'kitbuilder' ),
			__( 'Tools', 'kitbuilder' ),
			'manage_options',
			self::PAGE_ID,
			[ $this, 'display_settings_page' ]
		);
	}

	public function register_settings_fields() {
		$controls_class_name = __NAMESPACE__ . '\Settings_Controls';
		$validations_class_name = __NAMESPACE__ . '\Settings_Validations';

		$tools_section = 'kitbuilder_tools_section';
		add_settings_section(
			$tools_section,
			'',
			'__return_empty_string', // No need intro text for this section right now
			self::PAGE_ID
		);

		$field_id = 'kitbuilder_clear_cache';
		add_settings_field(
			$field_id,
			__( 'Regenerate CSS', 'kitbuilder' ),
			[ $controls_class_name, 'render' ],
			self::PAGE_ID,
			$tools_section,
			[
				'id' => $field_id,
				'type' => 'raw_html',
				'html' => sprintf( '<button data-nonce="%s" class="button kitbuilder-button-spinner" id="kitbuilder-clear-cache-button">%s</button>', wp_create_nonce( 'kitbuilder_clear_cache' ), __( 'Regenerate Files', 'kitbuilder' ) ),
				'desc' => __( 'Styles set in Kitbuilder are saved in CSS files in the uploads folder. Recreate those files, according to the most recent settings.', 'kitbuilder' ),
			]
		);



		$replace_url_section = 'kitbuilder_replace_url_section';

		add_settings_section(
			$replace_url_section,
			__( 'Replace URL', 'kitbuilder' ),
			function() {
				$intro_text = sprintf( __( '<strong>Important:</strong> It is strongly recommended that you <a target="_blank" href="%s">backup your database</a> before using Replace URL.', 'kitbuilder' ), 'https://codex.wordpress.org/WordPress_Backups' );
				$intro_text = '<p>' . $intro_text . '</p>';

				echo $intro_text;
			},
			self::PAGE_ID
		);

		$field_id = 'kitbuilder_replace_url';
		add_settings_field(
			$field_id,
			__( 'Update Site Address (URL)', 'kitbuilder' ),
			[ $controls_class_name, 'render' ],
			self::PAGE_ID,
			$replace_url_section,
			[
				'id' => $field_id,
				'type' => 'raw_html',
				'html' => sprintf( '<input type="text" name="from" placeholder="http://old-url.com" class="medium-text"><input type="text" name="to" placeholder="http://new-url.com" class="medium-text"><button data-nonce="%s" class="button kitbuilder-button-spinner" id="kitbuilder-replace-url-button">%s</button>', wp_create_nonce( 'kitbuilder_replace_url' ), __( 'Replace URL', 'kitbuilder' ) ),
				'desc' => __( 'Enter your old and new URLs for your WordPress installation, to update all Kitbuilder data (Relevant for domain transfers or move to \'HTTPS\').', 'kitbuilder' ),
			]
		);

		$editor_break_lines_section = 'kitbuilder_editor_break_lines_section';

		add_settings_section(
			$editor_break_lines_section,
			__( 'Editor Loader', 'kitbuilder' ),
			'__return_false',
			self::PAGE_ID
		);

		$field_id = 'kitbuilder_editor_break_lines';
		add_settings_field(
			$field_id,
			__( 'Switch front-end editor loader method', 'kitbuilder' ),
			[ $controls_class_name, 'render' ],
			self::PAGE_ID,
			$editor_break_lines_section,
			[
				'id' => $field_id,
				'type' => 'select',
				'options' => [
					'' => __( 'Disable', 'kitbuilder' ),
					1 => __( 'Enable', 'kitbuilder' ),
				],
				'desc' => __( 'For troubleshooting server configuration conflicts.', 'kitbuilder' ),
			]
		);

		register_setting( Tools::PAGE_ID, $field_id );
	}

	public function display_settings_page() {
		?>
		<div class="wrap">
			<h2><?php _e( 'Tools', 'kitbuilder' ); ?></h2>
			<form method="post" action="options.php">
				<?php
				settings_fields( self::PAGE_ID );
				do_settings_sections( self::PAGE_ID );

				submit_button();
				?>
			</form>
		</div><!-- /.wrap -->
		<?php
	}

	public function ajax_kitbuilder_clear_cache() {
		check_ajax_referer( 'kitbuilder_clear_cache', '_nonce' );

		Plugin::$instance->posts_css_manager->clear_cache();

		wp_send_json_success();
	}

	public function ajax_kitbuilder_replace_url() {
		check_ajax_referer( 'kitbuilder_replace_url', '_nonce' );

		$from = ! empty( $_POST['from'] ) ? esc_url(trim( $_POST['from'] )) : '';
		$to = ! empty( $_POST['to'] ) ? esc_url(trim( $_POST['to'] )) : '';

		$is_valid_urls = ( filter_var( $from, FILTER_VALIDATE_URL ) && filter_var( $to, FILTER_VALIDATE_URL ) );
		if ( ! $is_valid_urls ) {
			wp_send_json_error( __( 'The `from` and `to` URL\'s must be a valid URL', 'kitbuilder' ) );
		}

		if ( $from === $to ) {
			wp_send_json_error( __( 'The `from` and `to` URL\'s must be different', 'kitbuilder' ) );
		}

		global $wpdb;

		// @codingStandardsIgnoreStart cannot use `$wpdb->prepare` because it remove's the backslashes
		$rows_affected = $wpdb->query(
			"UPDATE {$wpdb->postmeta} " .
			"SET `meta_value` = REPLACE(`meta_value`, '" . str_replace( '/', '\\\/', $from ) . "', '" . str_replace( '/', '\\\/', $to ) . "') " .
			"WHERE `meta_key` = '_kitbuilder_data' AND `meta_value` LIKE '[%' ;" ); // meta_value LIKE '[%' are json formatted
		// @codingStandardsIgnoreEnd

		if ( false === $rows_affected ) {
			wp_send_json_error( __( 'An error occurred', 'kitbuilder' ) );
		} else {
			Plugin::$instance->posts_css_manager->clear_cache();
			wp_send_json_success( sprintf( __( '%d Rows Affected', 'kitbuilder' ), $rows_affected ) );
		}
	}

	public function __construct() {
		add_action( 'admin_menu', [ $this, 'register_admin_menu' ], 205 );
		add_action( 'admin_init', [ $this, 'register_settings_fields' ], 20 );

		if ( ! empty( $_POST ) ) {
			add_action( 'wp_ajax_kitbuilder_clear_cache', [ $this, 'ajax_kitbuilder_clear_cache' ] );
			add_action( 'wp_ajax_kitbuilder_replace_url', [ $this, 'ajax_kitbuilder_replace_url' ] );
		}
	}
}
