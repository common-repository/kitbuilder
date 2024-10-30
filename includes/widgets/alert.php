<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Alert extends Widget_Base {

	public function get_name() {
		return 'alert';
	}

	public function get_title() {
		return __( 'Alert', 'kitbuilder' );
	}

	public function get_icon() {
		return 'kb kb-alert';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_alert',
			[
				'label' => __( 'Alert', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'alert_type',
			[
				'label' => __( 'Type', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'info',
				'options' => [
					'info' => __( 'Info', 'kitbuilder' ),
					'success' => __( 'Success', 'kitbuilder' ),
					'warning' => __( 'Warning', 'kitbuilder' ),
					'danger' => __( 'Danger', 'kitbuilder' ),
				],
			]
		);

		$this->add_control(
			'alert_title',
			[
				'label' => __( 'Title & Description', 'kitbuilder' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => __( 'Your Title', 'kitbuilder' ),
				'default' => __( 'This is Alert', 'kitbuilder' ),
				'label_block' => true,
			]
		);

		$this->add_control(
			'alert_description',
			[
				'label' => __( 'Content', 'kitbuilder' ),
				'type' => Controls_Manager::TEXTAREA,
				'placeholder' => __( 'Your Description', 'kitbuilder' ),
				'default' => __( 'I am description. Click edit button to change this text.', 'kitbuilder' ),
				'separator' => 'none',
				'show_label' => false,
			]
		);

		$this->add_control(
			'show_dismiss',
			[
				'label' => __( 'Dismiss Button', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'show',
				'options' => [
					'show' => __( 'Show', 'kitbuilder' ),
					'hide' => __( 'Hide', 'kitbuilder' ),
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

		$this->start_controls_section(
			'section_type',
			[
				'label' => __( 'Alert Type', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'background',
			[
				'label' => __( 'Background Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-alert' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'border_color',
			[
				'label' => __( 'Border Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-alert' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'border_left-width',
			[
				'label' => __( 'Left Border Width', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-alert' => 'border-left-width: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_title',
			[
				'label' => __( 'Title', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'title_color',
			[
				'label' => __( 'Text Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-alert-title' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'alert_title',
				'selector' => '{{WRAPPER}} .kitbuilder-alert-title'
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_description',
			[
				'label' => __( 'Description', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'description_color',
			[
				'label' => __( 'Text Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-alert-description' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'alert_description',
				'selector' => '{{WRAPPER}} .kitbuilder-alert-description'
			]
		);

		$this->end_controls_section();

	}

	protected function render() {
		$settings = $this->get_settings();

		if ( empty( $settings['alert_title'] ) ) {
			return;
		}

		if ( ! empty( $settings['alert_type'] ) ) {
			$this->add_render_attribute( 'wrapper', 'class', 'kitbuilder-alert kitbuilder-alert-' . $settings['alert_type'] );
		}

		echo '<div ' . $this->get_render_attribute_string( 'wrapper' ) . ' role="alert">';
		$html = sprintf( '<span class="kitbuilder-alert-title">%1$s</span>', $settings['alert_title'] );

		if ( ! empty( $settings['alert_description'] ) ) {
			$html .= sprintf( '<span class="kitbuilder-alert-description">%s</span>', $settings['alert_description'] );
		}

		if ( ! empty( $settings['show_dismiss'] ) && 'show' === $settings['show_dismiss'] ) {
			$html .= '<button type="button" class="kitbuilder-alert-dismiss">X</button>';
		}

		echo $html;

		echo '</div>';
	}

	protected function _content_template() {
		?>
		<#
		var html = '<div class="kitbuilder-alert kitbuilder-alert-' + settings.alert_type + '" role="alert">';
		if ( '' !== settings.title ) {
			html += '<span class="kitbuilder-alert-title">' + settings.alert_title + '</span>';

			if ( '' !== settings.description ) {
				html += '<span class="kitbuilder-alert-description">' + settings.alert_description + '</span>';
			}

			if ( 'show' === settings.show_dismiss ) {
				html += '<button type="button" class="kitbuilder-alert-dismiss">X</button>';
			}

			html += '</div>';
		
			print( html );
		}
		#>
		<?php
	}
}
