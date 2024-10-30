<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Admin {

	/**
	 * Enqueue admin scripts.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function enqueue_scripts() {
		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		wp_register_script(
			'kitbuilder-dialog',
			KITBUILDER_ASSETS_URL . 'lib/dialog/dialog' . $suffix . '.js',
			[
				'jquery-ui-position',
			],
			'3.0.2',
			true
		);

		wp_register_script(
			'kitbuilder-admin-app',
			KITBUILDER_ASSETS_URL . 'js/admin' . $suffix . '.js',
			[
				'jquery',
			],
			KITBUILDER_VERSION,
			true
		);

		wp_localize_script(
			'kitbuilder-admin-app',
			'KitbuilderAdminConfig',
			[
				'home_url' => home_url(),
			]
		);

		wp_enqueue_script( 'kitbuilder-admin-app' );

		if ( 'kitbuilder_page_kitbuilder-tools' === get_current_screen()->id ) {
			wp_enqueue_script( 'kitbuilder-dialog' );
		}
	}

	/**
	 * Enqueue admin styles.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function enqueue_styles() {
		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		$direction_suffix = is_rtl() ? '-rtl' : '';

		wp_register_style(
			'kitbuilder-icons',
			KITBUILDER_ASSETS_URL . 'lib/kb-icons/kb-icons' . $suffix . '.css',
			[],
			KITBUILDER_VERSION
		);

		wp_register_style(
			'font-awesome',
			KITBUILDER_ASSETS_URL . 'lib/font-awesome/css/font-awesome' . $suffix . '.css',
			[],
			'4.7.0'
		);

		wp_register_style(
			'kitbuilder-admin-app',
			KITBUILDER_ASSETS_URL . 'css/admin' . $direction_suffix . $suffix . '.css',
			[
				'kitbuilder-icons',
                'font-awesome'
			],
			KITBUILDER_VERSION
		);

		wp_enqueue_style( 'kitbuilder-admin-app' );

		// It's for upgrade notice
		// TODO: enqueue this just if needed
		add_thickbox();
	}

	/**
	 * Print switch button in edit post (which has cpt support).
	 *
	 * @since 1.0.0
	 * @param $post
	 *
	 * @return void
	 */
	public function print_switch_mode_button( $post ) {
		if ( ! User::is_current_user_can_edit( $post->ID ) ) {
			return;
		}

		$current_mode = Plugin::$instance->db->get_edit_mode( $post->ID );
		if ( 'builder' !== $current_mode ) {
			$current_mode = 'editor';
		}

		wp_nonce_field( basename( __FILE__ ), '_kitbuilder_edit_mode_nonce' );
		?>
		<div id="kitbuilder-switch-mode">
			<input id="kitbuilder-switch-mode-input" type="hidden" name="_kitbuilder_post_mode" value="<?php echo $current_mode; ?>" />
			<button id="kitbuilder-switch-mode-button" class="kitbuilder-button button button-primary button-hero">
				<span class="kitbuilder-switch-mode-on"><?php _e( '&#8592; Back to WordPress Editor', 'kitbuilder' ); ?></span>
				<span class="kitbuilder-switch-mode-off">
					<i class="kb kb-kitbuilder"></i>
					<?php _e( 'Edit with Kitbuilder', 'kitbuilder' ); ?>
				</span>
			</button>
		</div>
		<div id="kitbuilder-editor">
	        <a id="kitbuilder-go-to-edit-page-link" href="<?php echo Utils::get_edit_link( $post->ID ); ?>">
		        <div id="kitbuilder-editor-button" class="kitbuilder-button button button-primary button-hero">
			        <i class="kb kb-kitbuilder"></i>
					<?php _e( 'Edit with Kitbuilder', 'kitbuilder' ); ?>
		        </div>
		        <div class="kitbuilder-loader-wrapper">
			        <div class="kitbuilder-loader">
                        <i class="fa fa-spin fa-circle-o-notch"></i>
			        </div>
		        </div>
	        </a>
		</div>
		<?php
	}

	/**
	 * Fired when the save the post, and flag the post mode.
	 *
	 * @since 1.0.0
	 * @param $post_id
	 *
	 * @return void
	 */
	public function save_post( $post_id ) {
		if ( ! isset( $_POST['_kitbuilder_edit_mode_nonce'] ) || ! wp_verify_nonce( $_POST['_kitbuilder_edit_mode_nonce'], basename( __FILE__ ) ) ) {
			return;
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Exit when you don't have $_POST array.
		if ( empty( $_POST ) ) {
			return;
		}

		if ( ! isset( $_POST['_kitbuilder_post_mode'] ) )
			$_POST['_kitbuilder_post_mode'] = '';

		Plugin::$instance->db->set_edit_mode( $post_id, sanitize_text_field($_POST['_kitbuilder_post_mode']) );
	}

	/**
	 * Add edit link in outside edit post.
	 *
	 * @since 1.0.0
	 * @param $actions
	 * @param $post
	 *
	 * @return array
	 */
	public function add_edit_in_dashboard( $actions, $post ) {
		if ( User::is_current_user_can_edit( $post->ID ) && 'builder' === Plugin::$instance->db->get_edit_mode( $post->ID ) ) {
			$actions['edit_with_kitbuilder'] = sprintf(
				'<a href="%s">%s</a>',
				Utils::get_edit_link( $post->ID ),
				__( 'Edit with Kitbuilder', 'kitbuilder' )
			);
		}

		return $actions;
	}

	public function body_status_classes( $classes ) {
		global $pagenow;

		if ( in_array( $pagenow, [ 'post.php', 'post-new.php' ] ) && Utils::is_post_type_support() ) {
			$post = get_post();
			$current_mode = Plugin::$instance->db->get_edit_mode( $post->ID );

			$mode_class = 'builder' === $current_mode ? 'kitbuilder-editor-active' : 'kitbuilder-editor-inactive';

			$classes .= ' ' . $mode_class;
		}

		return $classes;
	}

	public function plugin_action_links( $links ) {
		$settings_link = sprintf( '<a href="%s">%s</a>', admin_url( 'admin.php?page=' . Settings::PAGE_ID ), __( 'Settings', 'kitbuilder' ) );

		array_unshift( $links, $settings_link );

		return $links;
	}

	/**
	 * Admin constructor.
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_styles' ] );

		add_action( 'edit_form_after_title', [ $this, 'print_switch_mode_button' ] );
		add_action( 'save_post', [ $this, 'save_post' ] );

		add_filter( 'page_row_actions', [ $this, 'add_edit_in_dashboard' ], 10, 2 );
		add_filter( 'post_row_actions', [ $this, 'add_edit_in_dashboard' ], 10, 2 );

		add_filter( 'plugin_action_links_' . KITBUILDER_PLUGIN_BASE, [ $this, 'plugin_action_links' ] );

		add_filter( 'admin_body_class', [ $this, 'body_status_classes' ] );
	}
}
