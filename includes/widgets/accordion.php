<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Accordion extends Widget_Base {

	public function get_name() {
		return 'accordion';
	}

	public function get_title() {
		return __( 'Accordion', 'kitbuilder' );
	}

	public function get_icon() {
		return 'kb kb-accordion';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_title',
			[
				'label' => __( 'Accordion', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'tabs',
			[
				'label' => __( 'Accordion Items', 'kitbuilder' ),
				'type' => Controls_Manager::REPEATER,
				'default' => [
					[
						'tab_title' => __( 'Accordion #1', 'kitbuilder' ),
						'tab_content' => __( 'I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'kitbuilder' ),
					],
					[
						'tab_title' => __( 'Accordion #2', 'kitbuilder' ),
						'tab_content' => __( 'I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'kitbuilder' ),
					],
				],
				'fields' => [
					[
						'name' => 'tab_title',
						'label' => __( 'Title & Content', 'kitbuilder' ),
						'type' => Controls_Manager::TEXT,
						'default' => __( 'Accordion Title' , 'kitbuilder' ),
						'label_block' => true,
					],
					[
						'name' => 'tab_content',
						'label' => __( 'Content', 'kitbuilder' ),
						'type' => Controls_Manager::WYSIWYG,
						'default' => __( 'Accordion Content', 'kitbuilder' ),
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
			'section_title_style',
			[
				'label' => __( 'Accordion', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'icon_align',
			[
				'label' => __( 'Icon Alignment', 'kitbuilder' ),
				'type' => Controls_Manager::SELECT,
				'default' => is_rtl() ? 'right' : 'left',
				'options' => [
					'left' => __( 'Left', 'kitbuilder' ),
					'right' => __( 'Right', 'kitbuilder' ),
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
					'{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-item' => 'border-width: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-content' => 'border-width: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-wrapper .kitbuilder-accordion-title.active > span' => 'border-width: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'border_color',
			[
				'label' => __( 'Border Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-item' => 'border-color: {{VALUE}};',
					'{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-content' => 'border-top-color: {{VALUE}};',
					'{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-wrapper .kitbuilder-accordion-title.active > span' => 'border-bottom-color: {{VALUE}};',
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
			'title_background',
			[
				'label' => __( 'Background', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-title' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'title_color',
			[
				'label' => __( 'Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-title' => 'color: {{VALUE}};',
				]
			]
		);

		$this->add_control(
			'tab_active_color',
			[
				'label' => __( 'Active Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-title.active' => 'color: {{VALUE}};',
				]
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'title_typography',
				'selector' => '{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-title'
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
			'content_background_color',
			[
				'label' => __( 'Background', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-content' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'content_color',
			[
				'label' => __( 'Color', 'kitbuilder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-content' => 'color: {{VALUE}};',
				]
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'content_typography',
				'selector' => '{{WRAPPER}} .kitbuilder-accordion .kitbuilder-accordion-content'
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings();
		?>
		<div class="kitbuilder-accordion" role="tablist">
			<?php
			$counter = 1; ?>
			<?php foreach ( $settings['tabs'] as $item ) : ?>
				<div class="kitbuilder-accordion-item">
					<div class="kitbuilder-accordion-title" data-section="<?php echo $counter; ?>" role="tab">
						<span class="kitbuilder-accordion-icon kitbuilder-accordion-icon-<?php echo $settings['icon_align']; ?>">
							<i class="fa"></i>
						</span>
						<?php echo $item['tab_title']; ?>
					</div>
					<div class="kitbuilder-accordion-content kitbuilder-clearfix" data-section="<?php echo $counter; ?>" role="tabpanel"><?php echo $this->parse_text_editor( $item['tab_content'] ); ?></div>
				</div>
			<?php
				$counter++;
			endforeach; ?>
		</div>
		<?php
	}

	protected function _content_template() {
		?>
		<div class="kitbuilder-accordion" data-active-section="{{ editSettings.activeItemIndex ? editSettings.activeItemIndex : 0 }}" role="tablist">
			<#
			if ( settings.tabs ) {
				var counter = 1;
				_.each( settings.tabs, function( item ) { #>
					<div class="kitbuilder-accordion-item">
						<div class="kitbuilder-accordion-title" data-section="{{ counter }}" role="tab">
							<span class="kitbuilder-accordion-icon kitbuilder-accordion-icon-{{ settings.icon_align }}">
								<i class="fa"></i>
							</span>
							{{{ item.tab_title }}}
						</div>
						<div class="kitbuilder-accordion-content kitbuilder-clearfix" data-section="{{ counter }}" role="tabpanel">{{{ item.tab_content }}}</div>
					</div>
				<#
					counter++;
				} );
			} #>
		</div>
		<?php
	}
}
