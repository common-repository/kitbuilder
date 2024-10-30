<?php
namespace Kitbuilder;

use Kitbuilder\PageSettings\Manager as PageSettingsManager;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Editor {

	private $_is_edit_mode;

	private $_editor_templates = [
		'editor-templates/global.php',
		'editor-templates/panel.php',
		'editor-templates/panel-elements.php',
		'editor-templates/repeater.php',
		'editor-templates/templates.php',
	];

	public function init() {
		if ( is_admin() || ! $this->is_edit_mode() ) {
			return;
		}

		add_filter( 'show_admin_bar', '__return_false' );

		// Remove all WordPress actions
		remove_all_actions( 'wp_head' );
		remove_all_actions( 'wp_print_styles' );
		remove_all_actions( 'wp_print_head_scripts' );
		remove_all_actions( 'wp_footer' );

		// Handle `wp_head`
		add_action( 'wp_head', 'wp_enqueue_scripts', 1 );
		add_action( 'wp_head', 'wp_print_styles', 8 );
		add_action( 'wp_head', 'wp_print_head_scripts', 9 );
		add_action( 'wp_head', 'wp_site_icon' );
		add_action( 'wp_head', [ $this, 'editor_head_trigger' ], 30 );

		// Handle `wp_footer`
		add_action( 'wp_footer', 'wp_print_footer_scripts', 20 );
		add_action( 'wp_footer', 'wp_auth_check_html', 30 );
		add_action( 'wp_footer', [ $this, 'wp_footer' ] );

		// Handle `wp_enqueue_scripts`
		remove_all_actions( 'wp_enqueue_scripts' );

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ], 999999 );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ], 999999 );

		$post_id = get_the_ID();

		// Change mode to Builder
		Plugin::$instance->db->set_edit_mode( $post_id );

		// Post Lock
		if ( ! $this->get_locked_user( $post_id ) ) {
			$this->lock_post( $post_id );
		}

		// Setup default heartbeat options
		add_filter( 'heartbeat_settings', function( $settings ) {
			$settings['interval'] = 15;
			return $settings;
		} );

		// Tell to WP Cache plugins do not cache this request.
		Utils::do_not_cache();

		// Print the panel
		$this->print_panel_html();
		die;
	}

	public function is_edit_mode() {
		if ( null !== $this->_is_edit_mode ) {
			return $this->_is_edit_mode;
		}

		if ( ! User::is_current_user_can_edit() ) {
			return false;
		}

		if ( isset( $_GET['kitbuilder'] ) ) {
			return true;
		}

		// In some Apache configurations, in the Home page, the $_GET['kitbuilder'] is not set
		if ( '/?kitbuilder' === $_SERVER['REQUEST_URI'] ) {
			return true;
		}

		// Ajax request as Editor mode
		$actions = [
			'kitbuilder_render_widget',

			// Templates
			'kitbuilder_get_templates',
			'kitbuilder_save_template',
			'kitbuilder_get_template',
			'kitbuilder_delete_template',
			'kitbuilder_export_template',
			'kitbuilder_import_template',
		];

		if ( isset( $_REQUEST['action'] ) && in_array( $_REQUEST['action'], $actions ) ) {
			return true;
		}

		return false;
	}

	/**
	 * @param $post_id
	 */
	public function lock_post( $post_id ) {
		if ( ! function_exists( 'wp_set_post_lock' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/post.php' );
		}

		wp_set_post_lock( $post_id );
	}

	/**
	 * @param $post_id
	 *
	 * @return bool|\WP_User
	 */
	public function get_locked_user( $post_id ) {
		if ( ! function_exists( 'wp_check_post_lock' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/post.php' );
		}

		$locked_user = wp_check_post_lock( $post_id );
		if ( ! $locked_user ) {
			return false;
		}

		return get_user_by( 'id', $locked_user );
	}

	public function print_panel_html() {
		include( 'editor-templates/editor-wrapper.php' );
	}

	public function enqueue_scripts() {
		global $wp_styles, $wp_scripts;

		$post_id = get_the_ID();
		$plugin = Plugin::$instance;

		$editor_data = $plugin->db->get_builder( $post_id, DB::STATUS_DRAFT );

		// Reset global variable
		$wp_styles = new \WP_Styles();
		$wp_scripts = new \WP_Scripts();

		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		// Hack for waypoint with editor mode.
		wp_register_script(
			'kitbuilder-waypoints',
			KITBUILDER_ASSETS_URL . 'lib/waypoints/waypoints-for-editor.js',
			[
				'jquery',
			],
			'4.0.2',
			true
		);

		// Enqueue frontend scripts too
		$plugin->frontend->register_scripts();
		$plugin->frontend->enqueue_scripts();

		$plugin->widgets_manager->enqueue_widgets_scripts();

		wp_register_script(
			'backbone-marionette',
			KITBUILDER_ASSETS_URL . 'lib/backbone/backbone.marionette' . $suffix . '.js',
			[
				'backbone',
			],
			'2.4.5',
			true
		);

		wp_register_script(
			'backbone-radio',
			KITBUILDER_ASSETS_URL . 'lib/backbone/backbone.radio' . $suffix . '.js',
			[
				'backbone',
			],
			'1.0.4',
			true
		);

		wp_register_script(
			'perfect-scrollbar',
			KITBUILDER_ASSETS_URL . 'lib/perfect-scrollbar/perfect-scrollbar.jquery' . $suffix . '.js',
			[
				'jquery',
			],
			'0.6.12',
			true
		);

		wp_register_script(
			'jquery-easing',
			KITBUILDER_ASSETS_URL . 'lib/jquery-easing/jquery-easing' . $suffix . '.js',
			[
				'jquery',
			],
			'1.3.2',
			true
		);

		wp_register_script(
			'nprogress',
			KITBUILDER_ASSETS_URL . 'lib/nprogress/nprogress' . $suffix . '.js',
			[],
			'0.2.0',
			true
		);

		wp_register_script(
			'tipsy',
			KITBUILDER_ASSETS_URL . 'lib/tipsy/tipsy' . $suffix . '.js',
			[
				'jquery',
			],
			'1.0.0',
			true
		);

		wp_register_script(
			'jquery-select2',
			KITBUILDER_ASSETS_URL . 'lib/select2/js/select2' . $suffix . '.js',
			[
				'jquery',
			],
			'4.0.2',
			true
		);

		wp_register_script(
			'jquery-simple-dtpicker',
			KITBUILDER_ASSETS_URL . 'lib/jquery-simple-dtpicker/jquery.simple-dtpicker' . $suffix . '.js',
			[
				'jquery',
			],
			'1.12.0',
			true
		);

		wp_register_script(
			'ace',
			'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js',
			[],
			'1.2.5',
			true
		);

		wp_register_script(
			'kitbuilder-editor',
			KITBUILDER_ASSETS_URL . 'js/editor' . $suffix . '.js',
			[
				'wp-auth-check',
				'jquery-ui-sortable',
				'jquery-ui-resizable',
				'backbone-marionette',
				'backbone-radio',
				'perfect-scrollbar',
				//'jquery-easing',
				'nprogress',
				'tipsy',
				'imagesloaded',
				'heartbeat',
				'jquery-select2',
				'jquery-simple-dtpicker',
				'ace',
			],
			KITBUILDER_VERSION,
			true
		);

		do_action( 'kitbuilder/editor/before_enqueue_scripts' );

		wp_enqueue_script( 'kitbuilder-editor' );

		// Tweak for WP Admin menu icons
		wp_print_styles( 'editor-buttons' );

		$locked_user = $this->get_locked_user( $post_id );

		if ( $locked_user ) {
			$locked_user = $locked_user->display_name;
		}

		$page_title_selector = get_option( 'kitbuilder_page_title_selector' );

		if ( empty( $page_title_selector ) ) {
			$page_title_selector = 'h1.entry-title';
		}

		$page_settings_instance = PageSettingsManager::get_page( $post_id );

		$config = [
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
			'home_url' => home_url(),
			'nonce' => wp_create_nonce( 'kitbuilder-editing' ),
			'preview_link' => add_query_arg( 'kitbuilder-preview', '', remove_query_arg( 'kitbuilder' ) ),
			'elements_categories' => $plugin->elements_manager->get_categories(),
			'controls' => $plugin->controls_manager->get_controls_data(),
			'elements' => $plugin->elements_manager->get_element_types_config(),
			'widgets' => $plugin->widgets_manager->get_widget_types_config(),
			'revisions' => Revisions_Manager::get_revisions(),
			'revisions_enabled' => ( $post_id && wp_revisions_enabled( get_post() ) ),
			'page_settings' => [
				'controls' => $page_settings_instance->get_controls(),
				'tabs' => $page_settings_instance->get_tabs_controls(),
				'settings' => $page_settings_instance->get_settings(),
			],
			'wp_editor' => $this->_get_wp_editor_config(),
			'post_id' => $post_id,
			'post_permalink' => get_the_permalink(),
			'edit_post_link' => get_edit_post_link(),
			'settings_page_link' => Settings::get_url(),
			'assets_url' => KITBUILDER_ASSETS_URL,
			'data' => $editor_data,
			'locked_user' => $locked_user,
			'is_rtl' => is_rtl(),
			'locale' => get_locale(),
			'introduction' => User::get_introduction(),
			'viewportBreakpoints' => Responsive::get_breakpoints(),
			'rich_editing_enabled' => filter_var( get_user_meta( get_current_user_id(), 'rich_editing', true ), FILTER_VALIDATE_BOOLEAN ),
			'page_title_selector' => $page_title_selector,
			'tinymceHasCustomConfig' => class_exists( 'Tinymce_Advanced' ),
			'i18n' => [
				'kitbuilder' => __( 'Kitbuilder', 'kitbuilder' ),
				'element' => __( 'Elements', 'kitbuilder' ),
				'global_settings' => __( 'Settings', 'kitbuilder' ),
				'dialog_confirm_delete' => __( 'Are you sure you want to remove this {0}?', 'kitbuilder' ),
				'dialog_user_taken_over' => __( '{0} has taken over and is currently editing. Do you want to take over this page editing?', 'kitbuilder' ),
				'delete' => __( 'Delete', 'kitbuilder' ),
				'cancel' => __( 'Cancel', 'kitbuilder' ),
				'delete_element' => __( 'Delete {0}', 'kitbuilder' ),
				'take_over' => __( 'Take Over', 'kitbuilder' ),
				'go_back' => __( 'Go Back', 'kitbuilder' ),
				'saved' => __( 'Saved', 'kitbuilder' ),
				'before_unload_alert' => __( 'Please note: All unsaved changes will be lost.', 'kitbuilder' ),
				'edit_element' => __( 'Edit {0}', 'kitbuilder' ),
				'global_colors' => __( 'Global Colors', 'kitbuilder' ),
				'global_fonts' => __( 'Global Fonts', 'kitbuilder' ),
				'kitbuilder_settings' => __( 'Kitbuilder Settings', 'kitbuilder' ),
				'soon' => __( 'Soon', 'kitbuilder' ),
				'revision_history' => __( 'Revision History', 'kitbuilder' ),
				'about_kitbuilder' => __( 'About Kitbuilder', 'kitbuilder' ),
				'inner_section' => __( 'Columns', 'kitbuilder' ),
				'dialog_confirm_gallery_delete' => __( 'Are you sure you want to reset this gallery?', 'kitbuilder' ),
				'delete_gallery' => __( 'Reset Gallery', 'kitbuilder' ),
				'gallery_images_selected' => __( '{0} Images Selected', 'kitbuilder' ),
				'insert_media' => __( 'Insert Media', 'kitbuilder' ),
				'preview_el_not_found_header' => __( 'Sorry, the content area was not found in your page.', 'kitbuilder' ),
				'preview_el_not_found_message' => __( 'You must call \'the_content\' function in the current template, in order for Kitbuilder to work on this page.', 'kitbuilder' ),
				'learn_more' => __( 'Learn More', 'kitbuilder' ),
				'an_error_occurred' => __( 'An error occurred', 'kitbuilder' ),
				'templates_request_error' => __( 'The following error(s) occurred while processing the request:', 'kitbuilder' ),
				'save_your_template' => __( 'Save Your {0} to Library', 'kitbuilder' ),
				'save_your_template_description' => __( 'Your designs will be available for export and reuse on any page or website', 'kitbuilder' ),
				'page' => __( 'Page', 'kitbuilder' ),
				'section' => __( 'Section', 'kitbuilder' ),
				'delete_template' => __( 'Delete Template', 'kitbuilder' ),
				'delete_template_confirm' => __( 'Are you sure you want to delete this template?', 'kitbuilder' ),
				'color_picker' => __( 'Color Picker', 'kitbuilder' ),
				'clear_page' => __( 'Delete All Content', 'kitbuilder' ),
				'dialog_confirm_clear_page' => __( 'Attention! We are going to DELETE ALL CONTENT from this page. Are you sure you want to do that?', 'kitbuilder' ),
				'asc' => __( 'Ascending order', 'kitbuilder' ),
				'desc' => __( 'Descending order', 'kitbuilder' ),
				'no_revisions_1' => __( 'Revision history lets you save your previous versions of your work, and restore them any time.', 'kitbuilder' ),
				'no_revisions_2' => __( 'Start designing your page and you\'ll be able to see the entire revision history here.', 'kitbuilder' ),
				'revisions_disabled_1' => __( 'It looks like the post revision feature is unavailable in your website.', 'kitbuilder' ),
				'revisions_disabled_2' => sprintf( __( 'Learn more about <a targe="_blank" href="%s">WordPress revisions</a>', 'kitbuilder' ), 'https://codex.wordpress.org/Revisions#Revision_Options)' ),
				'revision' => __( 'Revision', 'kitbuilder' ),
				'autosave' => __( 'Autosave', 'kitbuilder' ),
				'preview' => __( 'Preview', 'kitbuilder' ),
				'page_settings' => __( 'Page Settings', 'kitbuilder' ),
				'back_to_editor' => __( 'Back to Editor', 'kitbuilder' ),
			],
		];

		echo '<script type="text/javascript">' . PHP_EOL;
		echo '/* <![CDATA[ */' . PHP_EOL;
		$config_json = wp_json_encode( $config );
		unset( $config );

		if ( get_option( 'kitbuilder_editor_break_lines' ) ) {
			// Add new lines to avoid memory limits in some hosting servers that handles th buffer output according to new line characters
			$config_json = str_replace( '}},"', '}},' . PHP_EOL . '"', $config_json );
		}

		echo 'var KitbuilderConfig = ' . $config_json . ';' . PHP_EOL;
		echo '/* ]]> */' . PHP_EOL;
		echo '</script>';

		$plugin->controls_manager->enqueue_control_scripts();

		do_action( 'kitbuilder/editor/after_enqueue_scripts' );
	}

	public function enqueue_styles() {
		do_action( 'kitbuilder/editor/before_enqueue_styles' );

		$suffix = Utils::is_script_debug() ? '' : '.min';

		$direction_suffix = is_rtl() ? '-rtl' : '';

		wp_register_style(
			'font-awesome',
			KITBUILDER_ASSETS_URL . 'lib/font-awesome/css/font-awesome' . $suffix . '.css',
			[],
			'4.7.0'
		);

		wp_register_style(
			'select2',
			KITBUILDER_ASSETS_URL . 'lib/select2/css/select2' . $suffix . '.css',
			[],
			'4.0.2'
		);

		wp_register_style(
			'kitbuilder-icons',
			KITBUILDER_ASSETS_URL . 'lib/kb-icons/kb-icons' . $suffix . '.css',
			[],
			KITBUILDER_VERSION
		);

		wp_register_style(
			'google-font-roboto',
			'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
			[],
			KITBUILDER_VERSION
		);

		wp_register_style(
			'jquery-simple-dtpicker',
			KITBUILDER_ASSETS_URL . 'lib/jquery-simple-dtpicker/jquery.simple-dtpicker' . $suffix . '.css',
			[],
			'1.12.0'
		);

		wp_register_style(
			'kitbuilder-editor',
			KITBUILDER_ASSETS_URL . 'css/editor' . $direction_suffix . $suffix . '.css',
			[
				'font-awesome',
				'select2',
				'kitbuilder-icons',
				'wp-auth-check',
				'google-font-roboto',
				'jquery-simple-dtpicker',
			],
			KITBUILDER_VERSION
		);

		wp_enqueue_style( 'kitbuilder-editor' );

		do_action( 'kitbuilder/editor/after_enqueue_styles' );
	}

	protected function _get_wp_editor_config() {
		ob_start();
		wp_editor(
			'%%EDITORCONTENT%%',
			'kitbuilderwpeditor',
			[
				'editor_class' => 'kitbuilder-wp-editor',
				'editor_height' => 250,
				'drag_drop_upload' => true,
			]
		);
		return ob_get_clean();
	}

	public function editor_head_trigger() {
		do_action( 'kitbuilder/editor/wp_head' );
	}

	public function add_editor_template( $template_path ) {
		$this->_editor_templates[] = $template_path;
	}

	public function wp_footer() {
		$plugin = Plugin::$instance;

		$plugin->controls_manager->render_controls();
		$plugin->widgets_manager->render_widgets_content();
		$plugin->elements_manager->render_elements_content();


		foreach ( $this->_editor_templates as $editor_template ) {
			include $editor_template;
		}
	}

	/**
	 * @param bool $edit_mode
	 */
	public function set_edit_mode( $edit_mode ) {
		$this->_is_edit_mode = $edit_mode;
	}

	public function __construct() {
		add_action( 'template_redirect', [ $this, 'init' ] );
	}
}
