<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Image extends Widget_Base {

	public function get_name() {
		return 'image';
	}

	public function get_title() {
		return __( 'Image', 'kitbuilder' );
	}

	public function get_icon() {
		return 'kb kb-insert-image';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_image',
			[
				'label' => __( 'Image', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'image',
			[
				'label' => __( 'Choose Image', 'kitbuilder' ),
				'type' => Controls_Manager::MEDIA,
				'default' => [
					'url' => Utils::get_placeholder_image_src(),
				],
			]
		);

		$this->add_group_control(
			Group_Control_Image_Size::get_type(),
			[
				'name' => 'image', // Actually its `image_size`
				'label' => __( 'Image Size', 'kitbuilder' ),
				'default' => 'large',
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
				],
				'default' => 'center',
				'selectors' => [
					'{{WRAPPER}}' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'caption',
			[
				'label' => __( 'Caption', 'kitbuilder' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'placeholder' => __( 'Enter your caption about the image', 'kitbuilder' ),
				'title' => __( 'Input image caption here', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'link_to',
			[
				'label' => __( 'Link to', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'none',
				'options' => [
					'none' => __( 'None', 'kitbuilder' ),
					'file' => __( 'Media File', 'kitbuilder' ),
					'custom' => __( 'Custom URL', 'kitbuilder' ),
				],
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link to', 'kitbuilder' ),
				'type' => Controls_Manager::URL,
				'placeholder' => __( 'http://your-link.com', 'kitbuilder' ),
				'condition' => [
					'link_to' => 'custom',
				],
				'show_label' => false,
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
			'section_style_image',
			[
				'label' => __( 'Image', 'kitbuilder' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'space',
			[
				'label' => __( 'Size (%)', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 100,
					'unit' => '%',
				],
				'size_units' => [ '%' ],
				'range' => [
					'%' => [
						'min' => 1,
						'max' => 100,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-image img' => 'max-width: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'opacity',
			[
				'label' => __( 'Opacity (%)', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 1,
				],
				'range' => [
					'px' => [
						'max' => 1,
						'min' => 0.10,
						'step' => 0.01,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-image img' => 'opacity: {{SIZE}};',
				],
			]
		);

		$this->add_control(
			'hover_animation',
			[
				'label' => __( 'Hover Animation', 'kitbuilder' ),
				'type' => Controls_Manager::HOVER_ANIMATION,
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'image_border',
				'label' => __( 'Image Border', 'kitbuilder' ),
				'selector' => '{{WRAPPER}} .kitbuilder-image img',
			]
		);

		$this->add_control(
			'image_border_radius',
			[
				'label' => __( 'Border Radius', 'kitbuilder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'rel' => 'border_radius',
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-image img' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => 'image_box_shadow',
				'selector' => '{{WRAPPER}} .kitbuilder-image img',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style_caption',
			[
				'label' => __( 'Caption', 'kitbuilder' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'caption_align',
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
					'{{WRAPPER}} .widget-image-caption' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'text_color',
			[
				'label' => __( 'Text Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .widget-image-caption' => 'color: {{VALUE}};',
				]
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'caption_typography',
				'selector' => '{{WRAPPER}} .widget-image-caption'
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings();

		if ( empty( $settings['image']['url'] ) ) {
			return;
		}

		$has_caption = ! empty( $settings['caption'] );

		$this->add_render_attribute( 'wrapper', 'class', 'kitbuilder-image' );

		if ( ! empty( $settings['shape'] ) ) {
			$this->add_render_attribute( 'wrapper', 'class', 'kitbuilder-image-shape-' . $settings['shape'] );
		}

		$link = $this->get_link_url( $settings );

		if ( $link ) {
			$this->add_render_attribute( 'link', 'href', $link['url'] );

			if ( ! empty( $link['is_external'] ) ) {
				$this->add_render_attribute( 'link', 'target', '_blank' );
			}
		} ?>
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
		<?php
		if ( $has_caption ) : ?>
			<figure class="wp-caption">
		<?php endif;

		if ( $link ) : ?>
				<a <?php echo $this->get_render_attribute_string( 'link' ); ?>>
		<?php endif;

		echo Group_Control_Image_Size::get_attachment_image_html( $settings );

		if ( $link ) : ?>
				</a>
		<?php endif;

		if ( $has_caption ) : ?>
				<figcaption class="widget-image-caption wp-caption-text"><?php echo $settings['caption']; ?></figcaption>
		<?php endif;

		if ( $has_caption ) : ?>
			</figure>
		<?php endif; ?>
		</div>
		<?php
	}

	protected function _content_template() {
		?>
		<# if ( '' !== settings.image.url ) {
			var image = {
				id: settings.image.id,
				url: settings.image.url,
				size: settings.image_size,
				dimension: settings.image_custom_dimension,
				model: editModel
			};

			var image_url = kitbuilder.imagesManager.getImageUrl( image );

			if ( ! image_url ) {
				return;
			}

			var link_url;

			if ( 'custom' === settings.link_to ) {
				link_url = settings.link.url;
			}

			if ( 'file' === settings.link_to ) {
				link_url = settings.image.url;
			}

			#><div class="kitbuilder-image{{ settings.shape ? ' kitbuilder-image-shape-' + settings.shape : '' }}"><#
			var imgClass = '',
				hasCaption = '' !== settings.caption;

			if ( '' !== settings.hover_animation ) {
				imgClass = 'kitbuilder-animation-' + settings.hover_animation;
			}

			if ( hasCaption ) {
				#><figure class="wp-caption"><#
			}

			if ( link_url ) {
					#><a href="{{ link_url }}"><#
			}
						#><img src="{{ image_url }}" class="{{ imgClass }}" /><#

			if ( link_url ) {
					#></a><#
			}

			if ( hasCaption ) {
					#><figcaption class="widget-image-caption wp-caption-text">{{{ settings.caption }}}</figcaption><#
			}

			if ( hasCaption ) {
				#></figure><#
			}

			#></div><#
		} #>
		<?php
	}

	private function get_link_url( $instance ) {
		if ( 'none' === $instance['link_to'] ) {
			return false;
		}

		if ( 'custom' === $instance['link_to'] ) {
			if ( empty( $instance['link']['url'] ) ) {
				return false;
			}
			return $instance['link'];
		}

		return [
			'url' => $instance['image']['url'],
		];
	}
}
