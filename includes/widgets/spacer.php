<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Spacer extends Widget_Base {

	public function get_name() {
		return 'spacer';
	}

	public function get_title() {
		return __( 'Spacer', 'kitbuilder' );
	}

	public function get_icon() {
		return 'kb kb-spacer';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_spacer',
			[
				'label' => __( 'Spacer', 'kitbuilder' ),
			]
		);

		$this->add_responsive_control(
			'space',
			[
				'label' => __( 'Space', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 50,
				],
				'range' => [
					'px' => [
						'min' => 1,
						'max' => 600,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-spacer-inner' => 'height: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'view',
			[
				'label' => __( 'View', 'kitbuilder' ),
				'type' => Controls_Manager::HIDDEN,
				'default' => 'traditional',
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		?>
		<div class="kitbuilder-spacer">
			<div class="kitbuilder-spacer-inner"></div>
		</div>
		<?php
	}

	protected function _content_template() {
		?>
		<div class="kitbuilder-spacer">
			<div class="kitbuilder-spacer-inner"></div>
		</div>
		<?php
	}
}
