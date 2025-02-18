<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A Box Shadow set of controls
 *
 * @param array  $default    {
 * 		@type integer $horizontal Default 0
 * 		@type integer $vertical   Default 0
 * 		@type integer $blur       Default 10
 * 		@type integer $spread     Default 0
 * 		@type bool    $inset      Unused //TODO: allow set an inset shadow
 * 		@type string  $color      Shadow color, in rgb|rgba|hex format.
 * }
 *
 * @since 1.0.0
 */
class Control_Box_Shadow extends Control_Base_Multiple {

	public function get_type() {
		return 'box_shadow';
	}

	public function get_default_value() {
		return [
			'horizontal' => 0,
			'vertical' => 0,
			'blur' => 10,
			'spread' => 0,
			'inset' => '',
			'color' => 'rgba(0,0,0,0.5)',
		];
	}

	public function get_sliders() {
		return [
			[ 'label' => __( 'Blur', 'kitbuilder' ), 'type' => 'blur', 'min' => 0, 'max' => 100 ],
			[ 'label' => __( 'Spread', 'kitbuilder' ), 'type' => 'spread', 'min' => -100, 'max' => 100 ],
			[ 'label' => __( 'Horizontal', 'kitbuilder' ), 'type' => 'horizontal', 'min' => -100, 'max' => 100 ],
			[ 'label' => __( 'Vertical', 'kitbuilder' ), 'type' => 'vertical', 'min' => -100, 'max' => 100 ],
		];
	}

	public function content_template() {
		?>
		<#
		var defaultColorValue = '';

		if ( data.default.color ) {
			if ( '#' !== data.default.color.substring( 0, 1 ) ) {
				defaultColorValue = '#' + data.default.color;
			} else {
				defaultColorValue = data.default.color;
			}

			defaultColorValue = ' data-default-color=' + defaultColorValue; // Quotes added automatically.
		}
		#>
		<div class="kitbuilder-control-field">
			<label class="kitbuilder-control-title"><?php _e( 'Color', 'kitbuilder' ); ?></label>
			<div class="kitbuilder-control-input-wrapper">
				<input data-setting="color" class="kitbuilder-box-shadow-color-picker" type="text" maxlength="7" placeholder="<?php esc_attr_e( 'Hex Value', 'kitbuilder' ); ?>" data-alpha="true"{{{ defaultColorValue }}} />
			</div>
		</div>
		<?php foreach ( $this->get_sliders() as $slider ) : ?>
			<div class="kitbuilder-box-shadow-slider">
				<label class="kitbuilder-control-title"><?php echo $slider['label']; ?></label>
				<div class="kitbuilder-control-input-wrapper">
					<div class="kitbuilder-slider" data-input="<?php echo $slider['type']; ?>"></div>
					<div class="kitbuilder-slider-input">
						<input type="number" min="<?php echo $slider['min']; ?>" max="<?php echo $slider['max']; ?>" data-setting="<?php echo $slider['type']; ?>"/>
					</div>
				</div>
			</div>
		<?php endforeach; ?>
		<?php
	}
}
