<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Element_Column extends Element_Base {

	protected static $_edit_tools;

	protected static function get_default_edit_tools() {
		return [
			'duplicate' => [
				'title' => __( 'Duplicate', 'kitbuilder' ),
				'icon' => 'clone',
			],
			'add' => [
				'title' => __( 'Add', 'kitbuilder' ),
				'icon' => 'plus',
			],
			'remove' => [
				'title' => __( 'Remove', 'kitbuilder' ),
				'icon' => 'trash-o',
			],
		];
	}

	public function get_name() {
		return 'column';
	}

	public function get_title() {
		return __( 'Column', 'kitbuilder' );
	}

	public function get_icon() {
		return 'kb kb-columns';
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_style',
			[
				'label' => __( 'Background & Border', 'kitbuilder' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background',
				'types' => [ 'none', 'classic', 'gradient' ],
				'selector' => '{{WRAPPER}} > .kitbuilder-element-populated',
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'border',
				'selector' => '{{WRAPPER}} > .kitbuilder-element-populated',
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'kitbuilder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'rel' => 'border_radius',
				'selectors' => [
					'{{WRAPPER}} > .kitbuilder-element-populated' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => 'box_shadow',
				'selector' => '{{WRAPPER}} > .kitbuilder-element-populated',
			]
		);

		$this->end_controls_section();

		// Section Column Background Overlay
		$this->start_controls_section(
			'section_background_overlay',
			[
				'label' => __( 'Background Overlay', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
				'condition' => [
					'background_background' => [ 'classic', 'gradient', 'video' ],
				],
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background_overlay',
				'types' => [ 'none', 'classic', 'gradient' ],
				'selector' => '{{WRAPPER}} > .kitbuilder-element-populated >  .kitbuilder-background-overlay',
				'condition' => [
					'background_background' => [ 'classic', 'gradient', 'video' ],
				],
			]
		);

		$this->add_control(
			'background_overlay_opacity',
			[
				'label' => __( 'Opacity (%)', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => .5,
				],
				'range' => [
					'px' => [
						'max' => 1,
						'step' => 0.01,
					],
				],
				'selectors' => [
					'{{WRAPPER}} > .kitbuilder-element-populated >  .kitbuilder-background-overlay' => 'opacity: {{SIZE}};',
				],
				'condition' => [
					'background_overlay_background' => [ 'classic', 'gradient' ],
				],
			]
		);

		$this->end_controls_section();

		// Section Layout
		$this->start_controls_section(
			'layout',
			[
				'label' => __( 'Layout', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'content_position',
			[
				'label' => __( 'Content Position', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'' => __( 'Default', 'kitbuilder' ),
					'top' => __( 'Top', 'kitbuilder' ),
					'center' => __( 'Middle', 'kitbuilder' ),
					'bottom' => __( 'Bottom', 'kitbuilder' ),
				],
				'selectors_dictionary' => [
					'top' => 'flex-start',
					'bottom' => 'flex-end',
				],
				'selectors' => [
					'{{WRAPPER}}.kitbuilder-column .kitbuilder-column-wrap' => 'align-items: {{VALUE}}',
				],
			]
		);

		$this->end_controls_section();

		// Section Typography
		$this->start_controls_section(
			'section_typo',
			[
				'label' => __( 'Typography', 'kitbuilder' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'heading_color',
			[
				'label' => __( 'Heading Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-element-populated .kitbuilder-heading-title' => 'color: {{VALUE}};',
				],
				'separator' => 'none',
			]
		);

		$this->add_control(
			'color_text',
			[
				'label' => __( 'Text Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} > .kitbuilder-element-populated' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'color_link',
			[
				'label' => __( 'Link Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-element-populated a' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'color_link_hover',
			[
				'label' => __( 'Link Hover Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-element-populated a:hover' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'text_align',
			[
				'label' => __( 'Text Align', 'kitbuilder' ),
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
				'selectors' => [
					'{{WRAPPER}} > .kitbuilder-element-populated' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		// Section Advanced
		$this->start_controls_section(
			'section_advanced',
			[
				'label' => __( 'Advanced', 'kitbuilder' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_responsive_control(
			'margin',
			[
				'label' => __( 'Margin', 'kitbuilder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} > .kitbuilder-element-populated' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'padding',
			[
				'label' => __( 'Padding', 'kitbuilder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors' => [
					'{{WRAPPER}} > .kitbuilder-element-populated' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'animation',
			[
				'label' => __( 'Entrance Animation', 'kitbuilder' ),
				'type' => Controls_Manager::ANIMATION,
				'default' => '',
				//'prefix_class' => 'animated ',
				'label_block' => true,
			]
		);

		$this->add_control(
			'animation_duration',
			[
				'label' => __( 'Animation Duration', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'slow' => __( 'Slow', 'kitbuilder' ),
					'' => __( 'Normal', 'kitbuilder' ),
					'fast' => __( 'Fast', 'kitbuilder' ),
				],
				'prefix_class' => 'animated-',
				'condition' => [
					'animation!' => '',
				],
			]
		);

		$this->add_control(
			'_element_id',
			[
				'label' => __( 'CSS ID', 'kitbuilder' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'label_block' => true,
				'title' => __( 'Add your custom id WITHOUT the Pound key. e.g: my-id', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'css_classes',
			[
				'label' => __( 'CSS Classes', 'kitbuilder' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'prefix_class' => '',
				'label_block' => true,
				'title' => __( 'Add your custom class WITHOUT the dot. e.g: my-class', 'kitbuilder' ),
			]
		);

		$this->end_controls_section();

		// Section Responsive
		$this->start_controls_section(
			'section_responsive',
			[
				'label' => __( 'Responsive', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$responsive_points = [
			'screen_sm' => [
				'title' => __( 'Mobile Width', 'kitbuilder' ),
				'class_prefix' => 'kitbuilder-sm-',
				'classes' => '',
				'description' => '',
			],
			'screen_xs' => [
				'title' => __( 'Mobile Portrait', 'kitbuilder' ),
				'class_prefix' => 'kitbuilder-xs-',
				'classes' => 'kitbuilder-control-deprecated',
				'description' => __( 'Deprecated: Mobile Portrait control is no longer supported. Please use the Mobile Width instead.', 'kitbuilder' ),
			],
		];

		foreach ( $responsive_points as $point_name => $point_data ) {
			$this->add_control(
				$point_name,
				[
					'label' => $point_data['title'],
					'type' => Controls_Manager::SELECT,
					'default' => 'default',
					'options' => [
						'default' => __( 'Default', 'kitbuilder' ),
						'custom' => __( 'Custom', 'kitbuilder' ),
					],
					'description' => $point_data['description'],
					'classes' => $point_data['classes'],
				]
			);

			$this->add_control(
				$point_name . '_width',
				[
					'label' => __( 'Column Width', 'kitbuilder' ),
					'type' => Controls_Manager::SELECT,
					'options' => [
						'10' => '10%',
						'11' => '11%',
						'12' => '12%',
						'14' => '14%',
						'16' => '16%',
						'20' => '20%',
						'25' => '25%',
						'30' => '30%',
						'33' => '33%',
						'40' => '40%',
						'50' => '50%',
						'60' => '60%',
						'66' => '66%',
						'70' => '70%',
						'75' => '75%',
						'80' => '80%',
						'83' => '83%',
						'90' => '90%',
						'100' => '100%',
					],
					'default' => '100',
					'condition' => [
						$point_name => [ 'custom' ],
					],
					'prefix_class' => $point_data['class_prefix'],
				]
			);
		}

		$this->end_controls_section();

		//Plugin::$instance->controls_manager->add_custom_css_controls( $this );
	}

	protected function _render_settings() {
		?>
		<div class="kitbuilder-element-overlay">
			<div class="column-title"></div>
			<div class="kitbuilder-editor-element-settings kitbuilder-editor-column-settings">
				<ul class="kitbuilder-editor-element-settings-list kitbuilder-editor-column-settings-list">
					<li class="kitbuilder-editor-element-setting kitbuilder-editor-element-trigger">
						<a href="#" title="<?php _e( 'Drag Column', 'kitbuilder' ); ?>"><?php _e( 'Column', 'kitbuilder' ); ?></a>
					</li>
                    <li class="kitbuilder-editor-element-setting kitbuilder-editor-element-edit-trigger">
                        <a href="#" title="<?php _e( 'Edit Column', 'kitbuilder' ); ?>">
                            <span class="kitbuilder-screen-only"><?php _e( 'Edit', 'kitbuilder' ); ?></span>
                            <i class="fa fa-pencil"></i>
                        </a>
                    </li>
					<?php foreach ( self::get_edit_tools() as $edit_tool_name => $edit_tool ) : ?>
						<li class="kitbuilder-editor-element-setting kitbuilder-editor-element-<?php echo $edit_tool_name; ?>">
							<a href="#" title="<?php echo $edit_tool['title']; ?>">
								<span class="kitbuilder-screen-only"><?php echo $edit_tool['title']; ?></span>
								<i class="fa fa-<?php echo $edit_tool['icon']; ?>"></i>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
				<ul class="kitbuilder-editor-element-settings-list  kitbuilder-editor-section-settings-list">
					<li class="kitbuilder-editor-element-setting kitbuilder-editor-element-trigger">
						<a href="#" title="<?php _e( 'Drag Section', 'kitbuilder' ); ?>"><?php _e( 'Section', 'kitbuilder' ); ?></a>
					</li>
                    <li class="kitbuilder-editor-element-setting kitbuilder-editor-element-edit-trigger">
                        <a href="#" title="<?php _e( 'Edit Section', 'kitbuilder' ); ?>">
                            <span class="kitbuilder-screen-only"><?php _e( 'Edit', 'kitbuilder' ); ?></span>
                            <i class="fa fa-pencil"></i>
                        </a>
                    </li>
					<?php foreach ( Element_Section::get_edit_tools() as $edit_tool_name => $edit_tool ) : ?>
						<li class="kitbuilder-editor-element-setting kitbuilder-editor-element-<?php echo $edit_tool_name; ?>">
							<a href="#" title="<?php echo $edit_tool['title']; ?>">
								<span class="kitbuilder-screen-only"><?php echo $edit_tool['title']; ?></span>
								<i class="fa fa-<?php echo $edit_tool['icon']; ?>"></i>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>
		</div>
		<?php
	}

	protected function _content_template() {
		?>
		<div class="kitbuilder-column-wrap">
			<div class="kitbuilder-background-overlay"></div>
			<div class="kitbuilder-widget-wrap"></div>
		</div>
		<?php
	}

	public function before_render() {
		?>
		<div <?php echo $this->get_render_attribute_string( '_wrapper' ); ?>>
			<div class="kitbuilder-column-wrap<?php if ( $this->get_children() ) echo ' kitbuilder-element-populated'; ?>">
			<?php if ( in_array( $this->get_settings( 'background_overlay_background' ), [ 'classic', 'gradient' ] ) ) : ?>
				<div class="kitbuilder-background-overlay"></div>
			<?php endif; ?>
		<div class="kitbuilder-widget-wrap">
		<?php
	}

	public function after_render() {
		?>
				</div>
			</div>
		</div>
		<?php
	}

	protected function _add_render_attributes() {
		parent::_add_render_attributes();

		$is_inner = $this->get_data( 'isInner' );

		$column_type = ! empty( $is_inner ) ? 'inner' : 'top';

		$settings = $this->get_settings();

		$this->add_render_attribute( '_wrapper', 'class', [
			'kitbuilder-column',
			'kitbuilder-col-' . $settings['_column_size'],
			'kitbuilder-' . $column_type . '-column',
		] );

		$this->add_render_attribute( '_wrapper', 'data-element_type', $this->get_name() );

		if ( $settings['animation'] ) {
			$this->add_render_attribute( '_wrapper', 'data-animation', $settings['animation'] );
		}
	}

	protected function _get_default_child_type( array $element_data ) {
		if ( 'section' === $element_data['elType'] ) {
			return Plugin::$instance->elements_manager->get_element_types( 'section' );
		}

		return Plugin::$instance->widgets_manager->get_widget_types( $element_data['widgetType'] );
	}
}
