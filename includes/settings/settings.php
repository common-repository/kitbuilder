<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Settings {

	const PAGE_ID = 'kitbuilder';

	const MENU_PRIORITY_GO_PRO = 502;

	const UPDATE_TIME_FIELD = '_kitbuilder_settings_update_time';

	public static function get_url() {
		return admin_url( 'admin.php?page=' . self::PAGE_ID );
	}

	public function register_settings_fields() {
		$controls_class_name = __NAMESPACE__ . '\Settings_Controls';
		$validations_class_name = __NAMESPACE__ . '\Settings_Validations';

		// Register the main section
		$main_section = 'kitbuilder_general_section';

		add_settings_section(
			$main_section,
			__( 'General Settings', 'kitbuilder' ),
			'__return_empty_string', // No need intro text for this section right now
			self::PAGE_ID
		);

		$field_id = 'kitbuilder_cpt_support';
		add_settings_field(
			$field_id,
			__( 'Post Types', 'kitbuilder' ),
			[ $controls_class_name, 'render' ],
			self::PAGE_ID,
			$main_section,
			[
				'id' => $field_id,
				'type' => 'checkbox_list_cpt',
				'std' => [ 'page', 'post' ],
				'exclude' => [ 'attachment', 'kitbuilder_library' ],
			]
		);

		register_setting( self::PAGE_ID, $field_id, [ $validations_class_name, 'checkbox_list' ] );

		$field_id = 'kitbuilder_exclude_user_roles';
		add_settings_field(
			$field_id,
			__( 'Exclude Roles', 'kitbuilder' ),
			[ $controls_class_name, 'render' ],
			self::PAGE_ID,
			$main_section,
			[
				'id' => $field_id,
				'type' => 'checkbox_list_roles',
				'exclude' => [ 'administrator' ],
			]
		);

		register_setting( self::PAGE_ID, $field_id, [ $validations_class_name, 'checkbox_list' ] );

		// Style section
		$style_section = 'kitbuilder_style_section';

		add_settings_section(
			$style_section,
			__( 'Style Settings', 'kitbuilder' ),
			'__return_empty_string', // No need intro text for this section right now
			self::PAGE_ID
		);



		$field_id = 'kitbuilder_default_generic_fonts';
		add_settings_field(
			$field_id,
			__( 'Default Generic Fonts', 'kitbuilder' ),
			[ $controls_class_name, 'render' ],
			self::PAGE_ID,
			$style_section,
			[
				'id' => $field_id,
				'type' => 'text',
				'std' => 'Sans-serif',
				'classes' => [ 'medium-text' ],
				'desc' => __( 'The list of fonts used if the chosen font is not available.', 'kitbuilder' ),
			]
		);

		register_setting( self::PAGE_ID, $field_id );

		$field_id = 'kitbuilder_container_width';
		add_settings_field(
			$field_id,
			__( 'Content Width', 'kitbuilder' ),
			[ $controls_class_name, 'render' ],
			self::PAGE_ID,
			$style_section,
			[
				'id' => $field_id,
				'type' => 'text',
				'placeholder' => '1140',
				'sub_desc' => 'px',
				'classes' => [ 'medium-text' ],
				'desc' => __( 'Sets the default width of the content area (Default: 1140)', 'kitbuilder' ),
			]
		);

		register_setting( self::PAGE_ID, $field_id );

		$field_id = 'kitbuilder_stretched_section_container';
		add_settings_field(
			$field_id,
			__( 'Stretched Section Fit To', 'kitbuilder' ),
			[ $controls_class_name, 'render' ],
			self::PAGE_ID,
			$style_section,
			[
				'id' => $field_id,
				'type' => 'text',
				'placeholder' => 'body',
				'classes' => [ 'medium-text' ],
				'desc' => __( 'Enter parent element selector to which stretched sections will fit to (e.g. #primary / .wrapper / main etc). Leave blank to fit to page width.', 'kitbuilder' ),
			]
		);

		register_setting( self::PAGE_ID, $field_id );

		$field_id = 'kitbuilder_page_title_selector';
		add_settings_field(
			$field_id,
			__( 'Page Title Selector', 'kitbuilder' ),
			[ $controls_class_name, 'render' ],
			self::PAGE_ID,
			$style_section,
			[
				'id' => $field_id,
				'type' => 'text',
				'placeholder' => 'h1.entry-title',
				'classes' => [ 'medium-text' ],
				'desc' => __( 'Kitbuilder lets you hide the page title. This works for themes that have "h1.entry-title" selector. If your theme\'s selector is different, please enter it above.', 'kitbuilder' ),
			]
		);

		register_setting( self::PAGE_ID, $field_id );

		add_settings_field(
			self::UPDATE_TIME_FIELD,
			'',
			[ $controls_class_name, 'render' ],
			self::PAGE_ID,
			$style_section,
			[
				'id' => self::UPDATE_TIME_FIELD,
				'type' => 'hidden',
			]
		);

		register_setting( self::PAGE_ID, self::UPDATE_TIME_FIELD, [ 'sanitize_callback' => 'time' ] );
	}

	public function register_admin_menu() {
		add_menu_page(
			__( 'Kitbuilder', 'kitbuilder' ),
			__( 'Kitbuilder', 'kitbuilder' ),
			'manage_options',
			self::PAGE_ID,
			[ $this, 'display_settings_page' ],
			'',
			99
		);
	}

	public function admin_menu_change_name() {
		global $submenu;

		if ( isset( $submenu['kitbuilder'] ) )
			$submenu['kitbuilder'][0][0] = __( 'Settings', 'kitbuilder' );
	}

	public function display_settings_page() {
		?>
		<div class="wrap">
			<h2><?php _e( 'Kitbuilder', 'kitbuilder' ); ?></h2>
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

	public function __construct() {
		include( KITBUILDER_PATH . 'includes/settings/controls.php' );
		include( KITBUILDER_PATH . 'includes/settings/validations.php' );

		add_action( 'admin_init', [ $this, 'register_settings_fields' ], 20 );
		add_action( 'admin_menu', [ $this, 'register_admin_menu' ], 20 );
		add_action( 'admin_menu', [ $this, 'admin_menu_change_name' ], 200 );
	}
}
