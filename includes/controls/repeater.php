<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * NOTE! THIS CONTROL IS UNDER DEVELOPMENT, USE AT YOUR OWN RISK.
 *
 * Repeater control allows you to build repeatable blocks of fields. You can create for example a set of fields that
 * will contain a checkbox and a textfield. The user will then be able to add “rows”, and each row will contain a
 * checkbox and a textfield.
 *
 *
 *
 * @since 1.0.0
 */
class Control_Repeater extends Control_Base {

	public function get_type() {
		return 'repeater';
	}

	protected function get_default_settings() {
		return [
			'prevent_empty' => true,
			'is_repeater' => true,
		];
	}

	public function get_value( $control, $widget ) {
		$value = parent::get_value( $control, $widget );

		if ( ! empty( $value ) ) {
			foreach ( $value as &$item ) {
				foreach ( $control['fields'] as $field ) {
					$control_obj = Plugin::$instance->controls_manager->get_control( $field['type'] );
					if ( ! $control_obj )
						continue;

					$item[ $field['name'] ] = $control_obj->get_value( $field, $item );
				}
			}
		}
		return $value;
	}

	public function content_template() {
		?>
		<label>
			<span class="kitbuilder-control-title">{{{ data.label }}}</span>
		</label>
		<div class="kitbuilder-repeater-fields"></div>
		<div class="kitbuilder-button-wrapper">
			<button class="kitbuilder-button kitbuilder-button-default kitbuilder-repeater-add"><span class="kb kb-plus"></span><?php _e( 'Add Item', 'kitbuilder' ); ?></button>
		</div>
		<?php
	}
}
