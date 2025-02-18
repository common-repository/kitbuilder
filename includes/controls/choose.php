<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A group of Radio Buttons controls represented as a stylized component with an icon for each option.
 *
 * @param mixed $default      The selected option key
 *                            Default ''
 * @param array $options      Array of arrays `[ [ 'title' => ??, 'icon' => ?? ], [ 'title' ... ]`.
 *                            The icon can be any icon-font class that appears in the panel, e.g. 'fa fa-align-left' for Font Awesome
 * @param bool  $toggle       Whether to allow toggle the selected button (unset the selection)
 *                            Default true
 *
 * @since 1.0.0
 */
class Control_Choose extends Control_Base {

	public function get_type() {
		return 'choose';
	}

	public function content_template() {
		?>
		<div class="kitbuilder-control-field">
			<label class="kitbuilder-control-title">{{{ data.label }}}</label>
			<div class="kitbuilder-control-input-wrapper">
				<div class="kitbuilder-choices">
					<# _.each( data.options, function( options, value ) { #>
					<input id="kitbuilder-choose-{{ data._cid + data.name + value }}" type="radio" name="kitbuilder-choose-{{ data.name }}" value="{{ value }}">
					<label class="kitbuilder-choices-label tooltip-target" for="kitbuilder-choose-{{ data._cid + data.name + value }}" data-tooltip="{{ options.title }}" title="{{ options.title }}">
						<i class="{{ options.icon }}"></i>
					</label>
					<# } ); #>
				</div>
			</div>
		</div>

		<# if ( data.description ) { #>
		<div class="kitbuilder-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}

	protected function get_default_settings() {
		return [
			'options' => [],
			'label_block' => true,
			'toggle' => true,
		];
	}
}
