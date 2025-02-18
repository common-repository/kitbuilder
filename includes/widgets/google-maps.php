<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Google_Maps extends Widget_Base {

	public function get_name() {
		return 'google_maps';
	}

	public function get_title() {
		return __( 'Google Maps', 'kitbuilder' );
	}

	public function get_icon() {
		return 'kb kb-google-maps';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_map',
			[
				'label' => __( 'Map', 'kitbuilder' ),
			]
		);

		$default_address = __( 'London Eye, London, United Kingdom', 'kitbuilder' );
		$this->add_control(
			'address',
			[
				'label' => __( 'Address', 'kitbuilder' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => $default_address,
				'default' => $default_address,
				'label_block' => true,
			]
		);

		$this->add_control(
			'zoom',
			[
				'label' => __( 'Zoom Level', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 10,
				],
				'range' => [
					'px' => [
						'min' => 1,
						'max' => 20,
					],
				],
			]
		);

		$this->add_control(
			'height',
			[
				'label' => __( 'Height', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 300,
				],
				'range' => [
					'px' => [
						'min' => 40,
						'max' => 1440,
					],
				],
				'selectors' => [
					'{{WRAPPER}} iframe' => 'height: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'prevent_scroll',
			[
				'label' => __( 'Prevent Scroll', 'kitbuilder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => 'yes',
				'label_on' => __( 'Yes', 'kitbuilder' ),
				'label_off' => __( 'No', 'kitbuilder' ),
				'selectors' => [
					'{{WRAPPER}} iframe' => 'pointer-events: none;',
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
		$settings = $this->get_settings();

		if ( empty( $settings['address'] ) )
			return;

		if ( 0 === absint( $settings['zoom']['size'] ) )
			$settings['zoom']['size'] = 10;

		printf(
			'<div class="kitbuilder-custom-embed"><iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q=%s&amp;t=m&amp;z=%d&amp;output=embed&amp;iwloc=near"></iframe></div>',
			urlencode( $settings['address'] ),
			absint( $settings['zoom']['size'] )
		);
	}

	protected function _content_template() {}
}
