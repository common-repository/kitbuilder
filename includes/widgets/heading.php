<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Heading extends Widget_Base {

	public function get_name() {
		return 'heading';
	}

	public function get_title() {
		return __( 'Heading', 'kitbuilder' );
	}

	public function get_icon() {
		return 'kb kb-type-tool';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_title',
			[
				'label' => __( 'Title', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'title',
			[
				'label' => __( 'Title', 'kitbuilder' ),
				'type' => Controls_Manager::TEXTAREA,
				'placeholder' => __( 'Enter your title', 'kitbuilder' ),
				'default' => __( 'This is heading element', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link', 'kitbuilder' ),
				'type' => Controls_Manager::URL,
				'placeholder' => 'http://your-link.com',
				'default' => [
					'url' => '',
				],
				'separator' => 'before',
			]
		);

		$this->add_control(
			'size',
			[
				'label' => __( 'Size', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'default',
				'options' => [
					'default' => __( 'Default', 'kitbuilder' ),
					'small' => __( 'Small', 'kitbuilder' ),
					'medium' => __( 'Medium', 'kitbuilder' ),
					'large' => __( 'Large', 'kitbuilder' ),
					'xl' => __( 'XL', 'kitbuilder' ),
					'xxl' => __( 'XXL', 'kitbuilder' ),
				],
			]
		);

		$this->add_control(
			'header_size',
			[
				'label' => __( 'HTML Tag', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'h1' => __( 'H1', 'kitbuilder' ),
					'h2' => __( 'H2', 'kitbuilder' ),
					'h3' => __( 'H3', 'kitbuilder' ),
					'h4' => __( 'H4', 'kitbuilder' ),
					'h5' => __( 'H5', 'kitbuilder' ),
					'h6' => __( 'H6', 'kitbuilder' ),
					'div' => __( 'div', 'kitbuilder' ),
					'span' => __( 'span', 'kitbuilder' ),
					'p' => __( 'p', 'kitbuilder' ),
				],
				'default' => 'h2',
			]
		);

		$this->add_responsive_control(
			'align',
			[
				'label' => __( 'Alignment', 'kitbuilder' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'left' => [
						'title' => __( 'Left', 'kitbuilder' ),
						'icon' => 'fa fa-align-left',
					],
					'center' => [
						'title' => __( 'Center', 'kitbuilder' ),
						'icon' => 'fa fa-align-center',
					],
					'right' => [
						'title' => __( 'Right', 'kitbuilder' ),
						'icon' => 'fa fa-align-right',
					],
					'justify' => [
						'title' => __( 'Justified', 'kitbuilder' ),
						'icon' => 'fa fa-align-justify',
					],
				],
				'default' => '',
				'selectors' => [
					'{{WRAPPER}}' => 'text-align: {{VALUE}};',
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
			'section_title_style',
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
					'{{WRAPPER}} .kitbuilder-heading-title' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography',
				'selector' => '{{WRAPPER}} .kitbuilder-heading-title',
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings();

		if ( empty( $settings['title'] ) )
			return;

		$this->add_render_attribute( 'heading', 'class', 'kitbuilder-heading-title' );

		if ( ! empty( $settings['size'] ) ) {
			$this->add_render_attribute( 'heading', 'class', 'kitbuilder-size-' . $settings['size'] );
		}

		$title = $settings['title'];

		if ( ! empty( $settings['link']['url'] ) ) {
			$this->add_render_attribute( 'url', 'href', $settings['link']['url'] );

			if ( $settings['link']['is_external'] ) {
				$this->add_render_attribute( 'url', 'target', '_blank' );
			}

			$title = sprintf( '<a %1$s>%2$s</a>', $this->get_render_attribute_string( 'url' ), $title );
		}

		$title_html = sprintf( '<%1$s %2$s>%3$s</%1$s>', $settings['header_size'], $this->get_render_attribute_string( 'heading' ), $title );

		echo $title_html;
	}

	protected function _content_template() {
		?>
		<#
			var title = settings.title;

			if ( '' !== settings.link.url ) {
				title = '<a href="' + settings.link.url + '">' + title + '</a>';
			}

			var title_html = '<' + settings.header_size  + ' class="kitbuilder-heading-title kitbuilder-size-' + settings.size + '">' + title + '</' + settings.header_size + '>';

			print( title_html );
		#>
		<?php
	}
}
