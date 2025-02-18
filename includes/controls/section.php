<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A UI only control. Shows a header that functions as a toggle to show or hide a set of controls.
 * Do not use it directly, instead use: `$widget->start_controls_section()` and `$widget->end_controls_section()` to wrap
 * a set of controls.
 *
 * @since 1.0.0
 */
class Control_Section extends Control_Base {

	public function get_type() {
		return 'section';
	}

	public function content_template() {
		?>
		<div class="kitbuilder-panel-heading">
			<div class="kitbuilder-panel-heading-toggle kitbuilder-section-toggle" data-collapse_id="{{ data.name }}">
				<i class="fa"></i>
			</div>
			<div class="kitbuilder-panel-heading-title kitbuilder-section-title">{{{ data.label }}}</div>
		</div>
		<?php
	}

	protected function get_default_settings() {
		return [
			'separator' => 'none',
		];
	}
}
