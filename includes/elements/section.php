<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Element_Section extends Element_Base {

	protected static $_edit_tools;

	private static $presets = [];

	protected static function get_default_edit_tools() {
		return [
			'duplicate' => [
				'title' => __( 'Duplicate', 'kitbuilder' ),
				'icon' => 'clone',
			],
			'save' => [
				'title' => __( 'Save', 'kitbuilder' ),
				'icon' => 'floppy-o',
			],
			'remove' => [
				'title' => __( 'Remove', 'kitbuilder' ),
				'icon' => 'trash-o',
			],
		];
	}

	public function get_name() {
		return 'section';
	}

	public function get_title() {
		return __( 'Section', 'kitbuilder' );
	}

	public function get_icon() {
		return 'kb kb-columns';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	public static function get_presets( $columns_count = null, $preset_index = null ) {
		if ( ! self::$presets ) {
			self::init_presets();
		}

		$presets = self::$presets;

		if ( null !== $columns_count ) {
			$presets = $presets[ $columns_count ];
		}

		if ( null !== $preset_index ) {
			$presets = $presets[ $preset_index ];
		}

		return $presets;
	}

	public static function init_presets() {
		$additional_presets = [
			2 => [
				[
					'preset' => [ 33, 66 ],
				],
				[
					'preset' => [ 66, 33 ],
				],
			],
			3 => [
				[
					'preset' => [ 25, 25, 50 ],
				],
				[
					'preset' => [ 50, 25, 25 ],
				],
				[
					'preset' => [ 25, 50, 25 ],
				],
				[
					'preset' => [ 16, 66, 16 ],
				],
			],
		];

		foreach ( range( 1, 10 ) as $columns_count ) {
			self::$presets[ $columns_count ] = [
				[
					'preset' => [],
				],
			];

			$preset_unit = floor( 1 / $columns_count * 100 );

			for ( $i = 0; $i < $columns_count; $i++ ) {
				self::$presets[ $columns_count ][0]['preset'][] = $preset_unit;
			}

			if ( ! empty( $additional_presets[ $columns_count ] ) ) {
				self::$presets[ $columns_count ] = array_merge( self::$presets[ $columns_count ], $additional_presets[ $columns_count ] );
			}

			foreach ( self::$presets[ $columns_count ] as $preset_index => & $preset ) {
				$preset['key'] = $columns_count . $preset_index;
			}
		}
	}

	protected function _get_initial_config() {
		$config = parent::_get_initial_config();

		$config['presets'] = self::get_presets();

		return $config;
	}

	protected function _register_controls() {

		$this->start_controls_section(
			'section_layout',
			[
				'label' => __( 'Layout', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_LAYOUT,
			]
		);

		$this->add_control(
			'stretch_section',
			[
				'label' => __( 'Stretch Section', 'kitbuilder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'label_on' => __( 'Yes', 'kitbuilder' ),
				'label_off' => __( 'No', 'kitbuilder' ),
				'return_value' => 'section-stretched',
				'prefix_class' => 'kitbuilder-',
				'render_type' => 'template',
				'hide_in_inner' => true,
				'description' => __( 'Stretch the section to the full width of the page using JS.', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'layout',
			[
				'label' => __( 'Content Width', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'boxed',
				'options' => [
					'boxed' => __( 'Boxed', 'kitbuilder' ),
					'full_width' => __( 'Full Width', 'kitbuilder' ),
				],
				'prefix_class' => 'kitbuilder-section-',
			]
		);

		$this->add_control(
			'content_width',
			[
				'label' => __( 'Content Width', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 500,
						'max' => 1600,
					],
				],
				'selectors' => [
					'{{WRAPPER}} > .kitbuilder-container' => 'max-width: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'layout' => [ 'boxed' ],
				],
				'show_label' => false,
				'separator' => 'none',
			]
		);

		$this->add_control(
			'gap',
			[
				'label' => __( 'Columns Gap', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'default',
				'options' => [
					'default' => __( 'Default', 'kitbuilder' ),
					'no' => __( 'No Gap', 'kitbuilder' ),
					'narrow' => __( 'Narrow', 'kitbuilder' ),
					'extended' => __( 'Extended', 'kitbuilder' ),
					'wide' => __( 'Wide', 'kitbuilder' ),
					'wider' => __( 'Wider', 'kitbuilder' ),
				],
			]
		);

		$this->add_control(
			'height',
			[
				'label' => __( 'Height', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'default',
				'options' => [
					'default' => __( 'Default', 'kitbuilder' ),
					'full' => __( 'Fit To Screen', 'kitbuilder' ),
					'min-height' => __( 'Min Height', 'kitbuilder' ),
				],
				'prefix_class' => 'kitbuilder-section-height-',
				'hide_in_inner' => true,
			]
		);

		$this->add_control(
			'custom_height',
			[
				'label' => __( 'Minimum Height', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 400,
				],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1440,
					],
					'vh' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'size_units' => [ 'px', 'vh' ],
				'selectors' => [
					'{{WRAPPER}} > .kitbuilder-container' => 'min-height: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'height' => [ 'min-height' ],
				],
				'hide_in_inner' => true,
			]
		);

		$this->add_control(
			'height_inner',
			[
				'label' => __( 'Height', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'default',
				'options' => [
					'default' => __( 'Default', 'kitbuilder' ),
					'min-height' => __( 'Min Height', 'kitbuilder' ),
				],
				'prefix_class' => 'kitbuilder-section-height-',
				'hide_in_top' => true,
			]
		);

		$this->add_control(
			'custom_height_inner',
			[
				'label' => __( 'Minimum Height', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 400,
				],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1440,
					],
				],
				'selectors' => [
					'{{WRAPPER}} > .kitbuilder-container' => 'min-height: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'height_inner' => [ 'min-height' ],
				],
				'hide_in_top' => true,
			]
		);

		$this->add_control(
			'column_position',
			[
				'label' => __( 'Column Position', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'middle',
				'options' => [
					'stretch' => __( 'Stretch', 'kitbuilder' ),
					'top' => __( 'Top', 'kitbuilder' ),
					'middle' => __( 'Middle', 'kitbuilder' ),
					'bottom' => __( 'Bottom', 'kitbuilder' ),
				],
				'prefix_class' => 'kitbuilder-section-items-',
				'condition' => [
					'height' => [ 'full', 'min-height' ],
				],
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
					'middle' => __( 'Middle', 'kitbuilder' ),
					'bottom' => __( 'Bottom', 'kitbuilder' ),
				],
				'prefix_class' => 'kitbuilder-section-content-',
			]
		);

		$this->add_control(
			'structure',
			[
				'label' => __( 'Structure', 'kitbuilder' ),
				'type' => Controls_Manager::STRUCTURE,
				'default' => '10',
				'render_type' => 'none',
			]
		);

		$this->end_controls_section();

		// Section background
		$this->start_controls_section(
			'section_background',
			[
				'label' => __( 'Background', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background',
				'types' => [ 'none', 'classic', 'gradient', 'video' ],
			]
		);

		$this->end_controls_section();

		// Background Overlay
		$this->start_controls_section(
			'background_overlay_section',
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
				'types' => [ 'classic', 'gradient' ],
				'selector' => '{{WRAPPER}} > .kitbuilder-background-overlay',
				'condition' => [
					'background_background' => [ 'none', 'classic', 'gradient', 'video' ],
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
					'{{WRAPPER}} > .kitbuilder-background-overlay' => 'opacity: {{SIZE}};',
				],
				'condition' => [
					'background_overlay_background' => [ 'classic', 'gradient' ],
				],
			]
		);

		$this->end_controls_section();

		// Section border
		$this->start_controls_section(
			'section_border',
			[
				'label' => __( 'Border', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'border',
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
					'{{WRAPPER}}, {{WRAPPER}} > .kitbuilder-background-overlay' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => 'box_shadow',
			]
		);

		$this->end_controls_section();

		// Section Shape Divider
		$this->start_controls_section(
			'section_shape_divider',
			[
				'label' => __( 'Shape Divider', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->start_controls_tabs( 'tabs_shape_dividers' );

		$shapes_options = [
			'' => __( 'None', 'kitbuilder' ),
		];

		foreach ( Shapes::get_shapes() as $shape_name => $shape_props ) {
		    $shapes_options[ $shape_name ] = $shape_props['title'];
		}

		foreach ( [ 'top' => __( 'Top', 'kitbuilder' ), 'bottom' => __( 'Bottom', 'kitbuilder' ) ] as $side => $side_label ) {
			$base_control_key = "shape_divider_$side";

			$this->start_controls_tab(
				"tab_$base_control_key",
				[
					'label' => $side_label,
				]
			);

			$this->add_control(
				$base_control_key,
				[
					'label' => __( 'Type', 'kitbuilder' ),
					'type' => Controls_Manager::SELECT,
					'options' => $shapes_options,
					'render_type' => 'none',
					'frontend_available' => true,
				]
			);

			$this->add_control(
				$base_control_key . '_color',
				[
					'label' => __( 'Color', 'kitbuilder' ),
					'type' => Controls_Manager::COLOR,
					'condition' => [
						"shape_divider_$side!" => '',
					],
					'selectors' => [
						"{{WRAPPER}} > .kitbuilder-shape-$side .kitbuilder-shape-fill" => 'fill: {{UNIT}};',
					],
				]
			);

			$this->add_responsive_control(
				$base_control_key . '_width',
				[
					'label' => __( 'Width', 'kitbuilder' ),
					'type' => Controls_Manager::SLIDER,
					'units' => [ '%' ],
					'default' => [
						'unit' => '%',
					],
					'range' => [
						'%' => [
							'min' => 100,
							'max' => 300,
						],
					],
					'condition' => [
						"shape_divider_$side" => array_keys( Shapes::filter_shapes( 'height_only', Shapes::FILTER_EXCLUDE ) ),
					],
					'selectors' => [
						"{{WRAPPER}} > .kitbuilder-shape-$side svg" => 'width: calc({{SIZE}}{{UNIT}} + 1.3px)',
					],
				]
			);

			$this->add_responsive_control(
				$base_control_key . '_height',
				[
					'label' => __( 'Height', 'kitbuilder' ),
					'type' => Controls_Manager::SLIDER,
					'range' => [
						'px' => [
							'max' => 500,
						],
					],
					'condition' => [
						"shape_divider_$side!" => '',
					],
					'selectors' => [
						"{{WRAPPER}} > .kitbuilder-shape-$side svg" => 'height: {{SIZE}}{{UNIT}};',
					],
				]
			);

			$this->add_control(
				$base_control_key . '_flip',
				[
					'label' => __( 'Flip', 'kitbuilder' ),
					'type' => Controls_Manager::SWITCHER,
					'label_off' => __( 'No', 'kitbuilder' ),
					'label_on' => __( 'Yes', 'kitbuilder' ),
					'condition' => [
						"shape_divider_$side" => array_keys( Shapes::filter_shapes( 'has_flip' ) ),
					],
					'selectors' => [
						"{{WRAPPER}} > .kitbuilder-shape-$side .kitbuilder-shape-fill" => 'transform: rotateY(180deg)',
					],
				]
			);

			$this->add_control(
				$base_control_key . '_negative',
				[
					'label' => __( 'Invert', 'kitbuilder' ),
					'type' => Controls_Manager::SWITCHER,
					'label_off' => __( 'No', 'kitbuilder' ),
					'label_on' => __( 'Yes', 'kitbuilder' ),
					'frontend_available' => true,
					'condition' => [
						"shape_divider_$side" => array_keys( Shapes::filter_shapes( 'has_negative' ) ),
					],
					'render_type' => 'none',
				]
			);

			$this->add_control(
				$base_control_key . '_above_content',
				[
					'label' => __( 'Bring to Front', 'kitbuilder' ),
					'type' => Controls_Manager::SWITCHER,
					'label_off' => __( 'No', 'kitbuilder' ),
					'label_on' => __( 'Yes', 'kitbuilder' ),
					'selectors' => [
						"{{WRAPPER}} > .kitbuilder-shape-$side" => 'z-index: 2; pointer-events: none',
					],
					'condition' => [
						"shape_divider_$side!" => '',
					],
				]
			);

			$this->end_controls_tab();
		}

		$this->end_controls_tabs();

		$this->end_controls_section();

		// Section Typography
		$this->start_controls_section(
			'section_typo',
			[
				'label' => __( 'Typography', 'kitbuilder' ),
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
					'{{WRAPPER}} .kitbuilder-heading-title' => 'color: {{VALUE}};',
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
					'{{WRAPPER}}' => 'color: {{VALUE}};',
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
					'{{WRAPPER}} a' => 'color: {{VALUE}};',
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
					'{{WRAPPER}} a:hover' => 'color: {{VALUE}};',
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
					'{{WRAPPER}} > .kitbuilder-container' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		// Section Advanced
		$this->start_controls_section(
			'section_advanced',
			[
				'label' => __( 'Advanced', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_responsive_control(
			'margin',
			[
				'label' => __( 'Margin', 'kitbuilder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'allowed_dimensions' => 'vertical',
				'placeholder' => [
					'top' => '',
					'right' => 'auto',
					'bottom' => '',
					'left' => 'auto',
				],
				'selectors' => [
					'{{WRAPPER}}' => 'margin-top: {{TOP}}{{UNIT}}; margin-bottom: {{BOTTOM}}{{UNIT}};',
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
					'{{WRAPPER}}' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
			'_section_responsive',
			[
				'label' => __( 'Responsive', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_control(
			'reverse_order_mobile',
			[
				'label' => __( 'Reverse Columns', 'kitbuilder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'kitbuilder-',
				'label_on' => __( 'Yes', 'kitbuilder' ),
				'label_off' => __( 'No', 'kitbuilder' ),
				'return_value' => 'reverse-mobile',
				'description' => __( 'Reverse column order - When on mobile, the column order is reversed, so the last column appears on top and vice versa.', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'heading_visibility',
			[
				'label' => __( 'Visibility', 'kitbuilder' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'responsive_description',
			[
				'raw' => __( 'Attention: The display settings (show/hide for mobile, tablet or desktop) will only take effect once you are on the preview or live page, and not while you\'re in editing mode in Kitbuilder.', 'kitbuilder' ),
				'type' => Controls_Manager::RAW_HTML,
				'content_classes' => 'kitbuilder-descriptor',
			]
		);

		$this->add_control(
			'hide_desktop',
			[
				'label' => __( 'Hide On Desktop', 'kitbuilder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'kitbuilder-',
				'label_on' => __( 'Hide', 'kitbuilder' ),
				'label_off' => __( 'Show', 'kitbuilder' ),
				'return_value' => 'hidden-desktop',
			]
		);

		$this->add_control(
			'hide_tablet',
			[
				'label' => __( 'Hide On Tablet', 'kitbuilder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'kitbuilder-',
				'label_on' => __( 'Hide', 'kitbuilder' ),
				'label_off' => __( 'Show', 'kitbuilder' ),
				'return_value' => 'hidden-tablet',
			]
		);

		$this->add_control(
			'hide_mobile',
			[
				'label' => __( 'Hide On Mobile', 'kitbuilder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'kitbuilder-',
				'label_on' => __( 'Hide', 'kitbuilder' ),
				'label_off' => __( 'Show', 'kitbuilder' ),
				'return_value' => 'hidden-phone',
			]
		);

		$this->end_controls_section();

		//Plugin::$instance->controls_manager->add_custom_css_controls( $this );
	}

	protected function _render_settings() {
		?>
		<div class="kitbuilder-element-overlay"></div>
		<?php
	}

	protected function _content_template() {
		?>
		<# if ( 'video' === settings.background_background ) {
			var videoLink = settings.background_video_link;
	
			if ( videoLink ) {
				var videoID = kitbuilder.helpers.getYoutubeIDFromURL( settings.background_video_link ); #>
	
				<div class="kitbuilder-background-video-container kitbuilder-hidden-phone">
					<# if ( videoID ) { #>
						<div class="kitbuilder-background-video" data-video-id="{{ videoID }}"></div>
					<# } else { #>
						<video class="kitbuilder-background-video" src="{{ videoLink }}" autoplay loop muted></video>
					<# } #>
				</div>
			<# }
	
			if ( settings.background_video_fallback ) { #>
				<div class="kitbuilder-background-video-fallback" style="background-image: url({{ settings.background_video_fallback.url }})"></div>
			<# }
		}

		if ( -1 !== [ 'classic', 'gradient' ].indexOf( settings.background_overlay_background ) ) { #>
			<div class="kitbuilder-background-overlay"></div>
		<# } #>
		<div class="kitbuilder-shape kitbuilder-shape-top"></div>
		<div class="kitbuilder-shape kitbuilder-shape-bottom"></div>
		<div class="kitbuilder-container kitbuilder-column-gap-{{ settings.gap }}">
			<div class="kitbuilder-row"></div>
		</div>
		<?php
	}

	public function before_render() {
		$settings = $this->get_settings();
		?>
		<section <?php echo $this->get_render_attribute_string( '_wrapper' ); ?>>
			<?php
			if ( 'video' === $settings['background_background'] ) :
				if ( $settings['background_video_link'] ) :
					$video_id = Utils::get_youtube_id_from_url( $settings['background_video_link'] );
					?>
					<div class="kitbuilder-background-video-container kitbuilder-hidden-phone">
						<?php if ( $video_id ) : ?>
							<div class="kitbuilder-background-video" data-video-id="<?php echo $video_id; ?>"></div>
						<?php else : ?>
							<video class="kitbuilder-background-video kitbuilder-html5-video" src="<?php echo $settings['background_video_link'] ?>" autoplay loop muted></video>
						<?php endif; ?>
					</div>
				<?php endif;
			endif;

			if ( in_array( $settings['background_overlay_background'], [ 'classic', 'gradient' ] ) ) : ?>
				<div class="kitbuilder-background-overlay"></div>
			<?php endif;

			if ( $settings['shape_divider_top'] ) {
				$this->print_shape_divider( 'top' );
			}

			if ( $settings['shape_divider_bottom'] ) {
				$this->print_shape_divider( 'bottom' );
			} ?>
			<div class="kitbuilder-container kitbuilder-column-gap-<?php echo esc_attr( $settings['gap'] ); ?>">
				<div class="kitbuilder-row">
		<?php
	}

	public function after_render() {
		?>
				</div>
			</div>
		</section>
		<?php
	}

	protected function _add_render_attributes() {
	    parent::_add_render_attributes();

	    $section_type = $this->get_data( 'isInner' ) ? 'inner' : 'top';

		$this->add_render_attribute( '_wrapper', 'class', [
			'kitbuilder-section',
			'kitbuilder-' . $section_type . '-section',
		] );

		$this->add_render_attribute( '_wrapper', 'data-element_type', $this->get_name() );

		$animation = $this->get_settings( 'animation' );

		if ( $animation ) {
			$this->add_render_attribute( '_wrapper', 'data-animation', $animation );
		}
	}

	protected function _get_default_child_type( array $element_data ) {
		return Plugin::$instance->elements_manager->get_element_types( 'column' );
	}

	private function print_shape_divider( $side ) {
	    $settings = $this->get_active_settings();
	    $base_setting_key = "shape_divider_$side";
		$negative = ! empty( $settings[ $base_setting_key . '_negative' ] );
	    ?>
		<div class="kitbuilder-shape kitbuilder-shape-<?php echo $side; ?>" data-negative="<?php echo var_export( $negative ); ?>">
			<?php include Shapes::get_shape_path( $settings[ $base_setting_key ], ! empty( $settings[ $base_setting_key . '_negative' ] ) ); ?>
		</div>
		<?php
	}
}
