<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A draggable Range Slider control.
 *
 * @param array  $default    {
 *
 * 		@type integer $size       The initial value of slider
 *                           	  Default empty
 * }
 *
 * @since              1.0.0
 */
class Control_Slider extends Control_Base_Units {

	public function get_type() {
		return 'slider';
	}

	public function get_default_value() {
		return array_merge( parent::get_default_value(), [
			'size' => '',
		] );
	}

	protected function get_default_settings() {
		return array_merge( parent::get_default_settings(), [
			'label_block' => true,
		] );
	}

	public function content_template() {
		?>
		<div class="kitbuilder-control-field">
			<label class="kitbuilder-control-title">{{{ data.label }}}</label>
			<?php $this->print_units_template(); ?>
			<div class="kitbuilder-control-input-wrapper kitbuilder-clearfix">
				<div class="kitbuilder-slider"></div>
				<div class="kitbuilder-slider-input">
					<input type="number" min="{{ data.min }}" max="{{ data.max }}" step="{{ data.step }}" data-setting="size" />
				</div>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="kitbuilder-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
