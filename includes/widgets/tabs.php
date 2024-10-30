<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Tabs extends Widget_Base {

	public function get_name() {
		return 'tabs';
	}

	public function get_title() {
		return __( 'Tabs', 'kitbuilder' );
	}

	public function get_icon() {
		return 'kb kb-tabs';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_tabs',
			[
				'label' => __( 'Tabs', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'type',
			[
				'label' => __( 'Type', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'horizontal',
				'options' => [
					'horizontal' => __( 'Horizontal', 'kitbuilder' ),
					'vertical' => __( 'Vertical', 'kitbuilder' ),
				],
				'prefix_class' => 'kitbuilder-tabs-view-',
			]
		);

		$this->add_control(
			'tabs',
			[
				'label' => __( 'Tabs Items', 'kitbuilder' ),
				'type' => Controls_Manager::REPEATER,
				'default' => [
					[
						'tab_title' => __( 'Tab #1', 'kitbuilder' ),
						'tab_content' => __( 'I am tab content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'kitbuilder' ),
					],
					[
						'tab_title' => __( 'Tab #2', 'kitbuilder' ),
						'tab_content' => __( 'I am tab content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'kitbuilder' ),
					],
				],
				'fields' => [
					[
						'name' => 'tab_title',
						'label' => __( 'Title & Content', 'kitbuilder' ),
						'type' => Controls_Manager::TEXT,
						'default' => __( 'Tab Title', 'kitbuilder' ),
						'placeholder' => __( 'Tab Title', 'kitbuilder' ),
						'label_block' => true,
					],
					[
						'name' => 'tab_content',
						'label' => __( 'Content', 'kitbuilder' ),
						'default' => __( 'Tab Content', 'kitbuilder' ),
						'placeholder' => __( 'Tab Content', 'kitbuilder' ),
						'type' => Controls_Manager::WYSIWYG,
						'show_label' => false,
					],
				],
				'title_field' => '{{{ tab_title }}}',
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
			'section_tabs_style',
			[
				'label' => __( 'Tabs', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'navigation_width',
			[
				'label' => __( 'Navigation Width', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'unit' => '%',
				],
				'range' => [
					'%' => [
						'min' => 10,
						'max' => 50,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-tabs-wrapper' => 'width: {{SIZE}}{{UNIT}}',
				],
				'condition' => [
					'type' => 'vertical',
				],
			]
		);

		$this->add_control(
			'border_width',
			[
				'label' => __( 'Border Width', 'kitbuilder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 1,
				],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 10,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-tab-title, {{WRAPPER}} .kitbuilder-tab-title:before, {{WRAPPER}} .kitbuilder-tab-title:after, {{WRAPPER}} .kitbuilder-tab-content, {{WRAPPER}} .kitbuilder-tabs-content-wrapper' => 'border-width: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'border_color',
			[
				'label' => __( 'Border Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-tab-mobile-title, {{WRAPPER}} .kitbuilder-tab-desktop-title.active, {{WRAPPER}} .kitbuilder-tab-title:before, {{WRAPPER}} .kitbuilder-tab-title:after, {{WRAPPER}} .kitbuilder-tab-content, {{WRAPPER}} .kitbuilder-tabs-content-wrapper' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'background_color',
			[
				'label' => __( 'Background Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-tab-desktop-title.active' => 'background-color: {{VALUE}};',
					'{{WRAPPER}} .kitbuilder-tabs-content-wrapper' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'heading_title',
			[
				'label' => __( 'Title', 'kitbuilder' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'tab_color',
			[
				'label' => __( 'Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-tab-title' => 'color: {{VALUE}};',
				]
			]
		);

		$this->add_control(
			'tab_active_color',
			[
				'label' => __( 'Active Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-tab-title.active' => 'color: {{VALUE}};',
				]
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'tab_typography',
				'selector' => '{{WRAPPER}} .kitbuilder-tab-title'
			]
		);

		$this->add_control(
			'heading_content',
			[
				'label' => __( 'Content', 'kitbuilder' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'content_color',
			[
				'label' => __( 'Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-tab-content' => 'color: {{VALUE}};',
				]
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'content_typography',
				'selector' => '{{WRAPPER}} .kitbuilder-tab-content'
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$tabs = $this->get_settings( 'tabs' );
		?>
		<div class="kitbuilder-tabs" role="tablist">
			<?php
			$counter = 1; ?>
			<div class="kitbuilder-tabs-wrapper" role="tab">
				<?php foreach ( $tabs as $item ) : ?>
					<div class="kitbuilder-tab-title kitbuilder-tab-desktop-title" data-tab="<?php echo $counter; ?>"><?php echo $item['tab_title']; ?></div>
				<?php
					$counter++;
				endforeach; ?>
			</div>

			<?php
			$counter = 1; ?>
			<div class="kitbuilder-tabs-content-wrapper" role="tabpanel">
				<?php foreach ( $tabs as $item ) : ?>
					<div class="kitbuilder-tab-title kitbuilder-tab-mobile-title" data-tab="<?php echo $counter; ?>"><?php echo $item['tab_title']; ?></div>
					<div class="kitbuilder-tab-content kitbuilder-clearfix" data-tab="<?php echo $counter; ?>"><?php echo $this->parse_text_editor( $item['tab_content'] ); ?></div>
				<?php
					$counter++;
				endforeach; ?>
			</div>
		</div>
		<?php
	}

	protected function _content_template() {
		?>
		<div class="kitbuilder-tabs" data-active-tab="{{ editSettings.activeItemIndex ? editSettings.activeItemIndex : 0 }}" role="tablist">
			<#
			if ( settings.tabs ) {
				var counter = 1; #>
				<div class="kitbuilder-tabs-wrapper" role="tab">
					<#
					_.each( settings.tabs, function( item ) { #>
						<div class="kitbuilder-tab-title kitbuilder-tab-desktop-title" data-tab="{{ counter }}">{{{ item.tab_title }}}</div>
					<#
						counter++;
					} ); #>
				</div>

				<# counter = 1; #>
				<div class="kitbuilder-tabs-content-wrapper" role="tabpanel">
					<#
					_.each( settings.tabs, function( item ) { #>
						<div class="kitbuilder-tab-title kitbuilder-tab-mobile-title" data-tab="{{ counter }}">{{{ item.tab_title }}}</div>
						<div class="kitbuilder-tab-content kitbuilder-clearfix kitbuilder-repeater-item-{{ item._id }}" data-tab="{{ counter }}">{{{ item.tab_content }}}</div>
					<#
					counter++;
					} ); #>
				</div>
			<# } #>
		</div>
		<?php
	}
}
