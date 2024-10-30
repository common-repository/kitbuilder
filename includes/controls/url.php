<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A URL input control. with the ability to set the target of the link to `_blank` to open in a new tab.
 *
 * @param array $default {
 * 		@type string $url         Default empty
 * 		@type bool   $is_external Determine whether to open the url in the same tab or in a new one
 *                                Default empty
 * }
 *
 * @param bool  $show_external 	  Whether to show the 'Is External' button
 *                                Default true
 *
 * @since 1.0.0
 */
class Control_URL extends Control_Base_Multiple {

	public function get_type() {
		return 'url';
	}

	public function get_default_value() {
		return [
			'is_external' => '',
			'url' => '',
		];
	}

	protected function get_default_settings() {
		return [
			'label_block' => true,
			'show_external' => true,
		];
	}

	public function content_template() {
		?>
		<div class="kitbuilder-control-field kitbuilder-control-url-external-{{{ data.show_external ? 'show' : 'hide' }}}">
			<label class="kitbuilder-control-title">{{{ data.label }}}</label>
			<div class="kitbuilder-control-input-wrapper">
				<input type="url" data-setting="url" placeholder="{{ data.placeholder }}" />
				<button class="kitbuilder-control-url-target tooltip-target" data-tooltip="<?php _e( 'Open Link in new Tab', 'kitbuilder' ); ?>" title="<?php esc_attr_e( 'Open Link in new Tab', 'kitbuilder' ); ?>">
					<span class="kitbuilder-control-url-external" title="<?php esc_attr_e( 'New Window', 'kitbuilder' ); ?>"><i class="fa fa-external-link"></i></span>
				</button>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="kitbuilder-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
