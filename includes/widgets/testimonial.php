<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Testimonial extends Widget_Base {

	public function get_name() {
		return 'testimonial';
	}

	public function get_title() {
		return __( 'Testimonial', 'kitbuilder' );
	}

	public function get_icon() {
		return 'kb kb-testimonial';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_testimonial',
			[
				'label' => __( 'Testimonial', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'testimonial_content',
			[
				'label' => __( 'Content', 'kitbuilder' ),
				'type' => Controls_Manager::TEXTAREA,
				'rows' => '10',
				'default' => 'Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
			]
		);

		$this->add_control(
			'testimonial_image',
			[
				'label' => __( 'Add Image', 'kitbuilder' ),
				'type' => Controls_Manager::MEDIA,
				'default' => [
					'url' => Utils::get_placeholder_image_src(),
				],
			]
		);

		$this->add_control(
			'testimonial_name',
			[
				'label' => __( 'Name', 'kitbuilder' ),
				'type' => Controls_Manager::TEXT,
				'default' => 'John Doe',
			]
		);

		$this->add_control(
			'testimonial_job',
			[
				'label' => __( 'Job', 'kitbuilder' ),
				'type' => Controls_Manager::TEXT,
				'default' => 'Designer',
			]
		);

		$this->add_control(
			'testimonial_image_position',
			[
				'label' => __( 'Image Position', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'aside',
				'options' => [
					'aside' => __( 'Aside', 'kitbuilder' ),
					'top' => __( 'Top', 'kitbuilder' ),
				],
				'condition' => [
					'testimonial_image[url]!' => '',
				],
				'separator' => 'before',
			]
		);

		$this->add_control(
			'testimonial_alignment',
			[
				'label' => __( 'Alignment', 'kitbuilder' ),
				'type' => Controls_Manager::CHOOSE,
				'default' => 'center',
				'options' => [
					'left'    => [
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

		// Content
		$this->start_controls_section(
			'section_style_testimonial_content',
			[
				'label' => __( 'Content', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'content_content_color',
			[
				'label' => __( 'Content Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-testimonial-content' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'content_typography',
				'label' => __( 'Typography', 'kitbuilder' ),
				'selector' => '{{WRAPPER}} .kitbuilder-testimonial-content',
			]
		);

		$this->end_controls_section();

		// Image
		$this->start_controls_section(
			'section_style_testimonial_image',
			[
				'label' => __( 'Image', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
				'condition' => [
					'testimonial_image[url]!' => '',
				],
			]
		);

		$this->add_control(
			'image_size',
			[
				'label' => __( 'Image Size', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range' => [
					'px' => [
						'min' => 20,
						'max' => 200,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-testimonial-wrapper .kitbuilder-testimonial-image img' => 'width: {{SIZE}}{{UNIT}};height: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'testimonial_image[url]!' => '',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'image_border',
				'selector' => '{{WRAPPER}} .kitbuilder-testimonial-wrapper .kitbuilder-testimonial-image img',
				'condition' => [
					'testimonial_image[url]!' => '',
				],
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
					'{{WRAPPER}} .kitbuilder-testimonial-wrapper .kitbuilder-testimonial-image img' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'testimonial_image[url]!' => '',
				],
			]
		);

		$this->end_controls_section();

		// Name
		$this->start_controls_section(
			'section_style_testimonial_name',
			[
				'label' => __( 'Name', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'name_text_color',
			[
				'label' => __( 'Text Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-testimonial-name' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'name_typography',
				'label' => __( 'Typography', 'kitbuilder' ),
				'selector' => '{{WRAPPER}} .kitbuilder-testimonial-name',
			]
		);

		$this->end_controls_section();

		// Job
		$this->start_controls_section(
			'section_style_testimonial_job',
			[
				'label' => __( 'Job', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'job_text_color',
			[
				'label' => __( 'Text Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-testimonial-job' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'job_typography',
				'label' => __( 'Typography', 'kitbuilder' ),
				'selector' => '{{WRAPPER}} .kitbuilder-testimonial-job',
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings();

		$this->add_render_attribute( 'wrapper', 'class', 'kitbuilder-testimonial-wrapper' );

		if ( $settings['testimonial_alignment'] ) {
			$this->add_render_attribute( 'wrapper', 'class', 'kitbuilder-testimonial-text-align-' . $settings['testimonial_alignment'] );
		}

		$this->add_render_attribute( 'meta', 'class', 'kitbuilder-testimonial-meta' );

		if ( $settings['testimonial_image']['url'] ) {
			$this->add_render_attribute( 'meta', 'class', 'kitbuilder-has-image' );
		}

		if ( $settings['testimonial_image_position'] ) {
			$this->add_render_attribute( 'meta', 'class', 'kitbuilder-testimonial-image-position-' . $settings['testimonial_image_position'] );
		}

		$has_content = ! ! $settings['testimonial_content'];

		$has_image = ! ! $settings['testimonial_image']['url'];

		$has_name = ! ! $settings['testimonial_name'];

		$has_job = ! ! $settings['testimonial_job'];

		if ( ! $has_content && ! $has_image && ! $has_name && ! $has_job ) {
			return;
		}
		?>
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>

			<?php if ( $has_content ) : ?>
				<div class="kitbuilder-testimonial-content"><?php echo $settings['testimonial_content']; ?></div>
			<?php endif; ?>

			<?php if ( $has_image || $has_name || $has_job ) : ?>
			<div <?php echo $this->get_render_attribute_string( 'meta' ); ?>>
				<div class="kitbuilder-testimonial-meta-inner">
					<?php if ( $has_image ) : ?>
						<div class="kitbuilder-testimonial-image">
							<img src="<?php echo esc_attr( $settings['testimonial_image']['url'] ); ?>" alt="<?php echo esc_attr( Control_Media::get_image_alt( $settings['testimonial_image'] ) ); ?>" />
						</div>
					<?php endif; ?>

					<?php if ( $has_name || $has_job ) : ?>
					<div class="kitbuilder-testimonial-details">
						<?php if ( $has_name ) : ?>
							<div class="kitbuilder-testimonial-name"><?php echo $settings['testimonial_name']; ?></div>
						<?php endif; ?>

						<?php if ( $has_job ) : ?>
							<div class="kitbuilder-testimonial-job"><?php echo $settings['testimonial_job']; ?></div>
						<?php endif; ?>
					</div>
					<?php endif; ?>
				</div>
			</div>
			<?php endif; ?>
		</div>
	<?php
	}

	protected function _content_template() {
		?>
		<#
		var imageUrl = false, hasImage = '';
		if ( '' !== settings.testimonial_image.url ) {
			imageUrl = settings.testimonial_image.url;
			hasImage = ' kitbuilder-has-image';
		}

		var testimonial_alignment = settings.testimonial_alignment ? ' kitbuilder-testimonial-text-align-' + settings.testimonial_alignment : '';
		var testimonial_image_position = settings.testimonial_image_position ? ' kitbuilder-testimonial-image-position-' + settings.testimonial_image_position : '';
		#>
		<div class="kitbuilder-testimonial-wrapper{{ testimonial_alignment }}">

			<# if ( '' !== settings.testimonial_content ) { #>
				<div class="kitbuilder-testimonial-content">
					{{{ settings.testimonial_content }}}
				</div>
		    <# } #>

			<div class="kitbuilder-testimonial-meta{{ hasImage }}{{ testimonial_image_position }}">
				<div class="kitbuilder-testimonial-meta-inner">
					<# if ( imageUrl ) { #>
					<div class="kitbuilder-testimonial-image">
						<img src="{{ imageUrl }}" alt="testimonial" />
					</div>
					<# } #>

					<div class="kitbuilder-testimonial-details">

						<# if ( '' !== settings.testimonial_name ) { #>
						<div class="kitbuilder-testimonial-name">
							{{{ settings.testimonial_name }}}
						</div>
						<# } #>

						<# if ( '' !== settings.testimonial_job ) { #>
						<div class="kitbuilder-testimonial-job">
							{{{ settings.testimonial_job }}}
						</div>
						<# } #>

					</div>
				</div>
			</div>
		</div>
	<?php
	}
}
