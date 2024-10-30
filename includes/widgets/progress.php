<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Progress extends Widget_Base {

	public function get_name() {
		return 'progress';
	}

	public function get_title() {
		return __( 'Progress Bar', 'kitbuilder' );
	}

	public function get_icon() {
		return 'kb kb-skill-bar';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_progress',
			[
				'label' => __( 'Progress Bar', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'title',
			[
				'label' => __( 'Title', 'kitbuilder' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => __( 'Enter your title', 'kitbuilder' ),
				'default' => __( 'My Skill', 'kitbuilder' ),
				'label_block' => true,
			]
		);

		$this->add_control(
			'progress_type',
			[
				'label' => __( 'Type', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'' => __( 'Default', 'kitbuilder' ),
					'info' => __( 'Info', 'kitbuilder' ),
					'success' => __( 'Success', 'kitbuilder' ),
					'warning' => __( 'Warning', 'kitbuilder' ),
					'danger' => __( 'Danger', 'kitbuilder' ),
				],
			]
		);

		$this->add_control(
			'percent',
			[
				'label' => __( 'Percentage', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 50,
					'unit' => '%',
				],
				'label_block' => true,
			]
		);

	    $this->add_control(
	        'display_percentage',
	        [
	            'label' => __( 'Display Percentage', 'kitbuilder' ),
	            'type' => Controls_Manager::SELECT,
	            'default' => 'show',
	            'options' => [
	                'show' => __( 'Show', 'kitbuilder' ),
	                'hide' => __( 'Hide', 'kitbuilder' ),
	            ],
	        ]
	    );

		$this->add_control(
			'inner_text',
			[
				'label' => __( 'Inner Text', 'kitbuilder' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => __( 'e.g. Web Designer', 'kitbuilder' ),
				'default' => __( 'Web Designer', 'kitbuilder' ),
				'label_block' => true,
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
			'section_progress_style',
			[
				'label' => __( 'Progress Bar', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'bar_color',
			[
				'label' => __( 'Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-progress-wrapper .kitbuilder-progress-bar' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'bar_bg_color',
			[
				'label' => __( 'Background Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-progress-wrapper' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'bar_inline_color',
			[
				'label' => __( 'Inner Text Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-progress-bar' => 'color: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_title',
			[
				'label' => __( 'Title Style', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'title_color',
			[
				'label' => __( 'Text Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-title' => 'color: {{VALUE}};',
				]
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography',
				'selector' => '{{WRAPPER}} .kitbuilder-title'
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings();

		$this->add_render_attribute( 'wrapper', 'class', 'kitbuilder-progress-wrapper' );

		if ( ! empty( $settings['progress_type'] ) ) {
			$this->add_render_attribute( 'wrapper', 'class', 'progress-' . $settings['progress_type'] );
		}

		$this->add_render_attribute( 'progress-bar', [
			'class' => 'kitbuilder-progress-bar',
			'data-max' => $settings['percent']['size'],
		] );

		if ( ! empty( $settings['title'] ) ) { ?>
			<span class="kitbuilder-title"><?php echo $settings['title']; ?></span>
		<?php } ?>

		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?> role="timer">
			<div <?php echo $this->get_render_attribute_string( 'progress-bar' ); ?>>
				<span class="kitbuilder-progress-text"><?php echo $settings['inner_text']; ?></span>
				<?php if ( 'hide' !== $settings['display_percentage'] ) { ?>
					<span class="kitbuilder-progress-percentage"><?php echo $settings['percent']['size']; ?>%</span>
				<?php } ?>
			</div>
		</div>
	<?php }

	protected function _content_template() {
		?>
		<# if ( settings.title ) { #>
		<span class="kitbuilder-title">{{{ settings.title }}}</span><#
		} #>
		<div class="kitbuilder-progress-wrapper progress-{{ settings.progress_type }}" role="timer">
			<div class="kitbuilder-progress-bar" data-max="{{ settings.percent.size }}">
				<span class="kitbuilder-progress-text">{{{ settings.inner_text }}}</span>
			<# if ( 'hide' !== settings.display_percentage ) { #>
				<span class="kitbuilder-progress-percentage">{{{ settings.percent.size }}}%</span>
			<# } #>
			</div>
		</div>
		<?php
	}
}
