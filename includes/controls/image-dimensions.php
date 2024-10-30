<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * An Image Dimensions control. Shows Width and Height inputs and an Apply button
 *
 * @param array  $default {
 * 		@type integer $width   Default empty
 * 		@type integer $height  Default empty
 * }
 *
 * @since 1.0.0
 */
class Control_Image_Dimensions extends Control_Base_Multiple {

	public function get_type() {
		return 'image_dimensions';
	}

	public function get_default_value() {
		return [
			'width' => '',
			'height' => '',
		];
	}

	protected function get_default_settings() {
		return [
			'label_block' => true,
			'show_label' => false,
		];
	}

	public function content_template() {
		if ( ! $this->_is_image_editor_supports() ) : ?>
		<div class="kitbuilder-panel-alert kitbuilder-panel-alert-danger">
			<?php _e( 'The server does not have ImageMagick or GD installed and/or enabled! Any of these libraries are required for WordPress to be able to resize images. Please contact your server administrator to enable this before continuing.', 'kitbuilder' ); ?>
		</div>
		<?php
			return;
		endif;
		?>
		<# if ( data.description ) { #>
			<div class="kitbuilder-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<div class="kitbuilder-control-field">
			<label class="kitbuilder-control-title">{{{ data.label }}}</label>
			<div class="kitbuilder-control-input-wrapper">
				<div class="kitbuilder-image-dimensions-field">
					<input type="text" data-setting="width" />
					<div class="kitbuilder-image-dimensions-field-description"><?php _e( 'Width', 'kitbuilder' ); ?></div>
				</div>
				<div class="kitbuilder-image-dimensions-separator">x</div>
				<div class="kitbuilder-image-dimensions-field">
					<input type="text" data-setting="height" />
					<div class="kitbuilder-image-dimensions-field-description"><?php _e( 'Height', 'kitbuilder' ); ?></div>
				</div>
				<button class="kitbuilder-button kitbuilder-button-success kitbuilder-image-dimensions-apply-button"><?php _e( 'Apply', 'kitbuilder' ); ?></button>
			</div>
		</div>
		<?php
	}

	private function _is_image_editor_supports() {
		$arg = [ 'mime_type' => 'image/jpeg' ];
		return ( wp_image_editor_supports( $arg ) );
	}
}
