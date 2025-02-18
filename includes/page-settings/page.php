<?php
namespace Kitbuilder\PageSettings;

use Kitbuilder\Controls_Manager;
use Kitbuilder\Controls_Stack;
use Kitbuilder\Group_Control_Background;
use Kitbuilder\Settings;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Page extends Controls_Stack {

	/**
	 * @var \WP_Post
	 */
	private $post;

	public function __construct( array $data = [] ) {
		$this->post = get_post( $data['id'] );

		$data['settings'] = $this->get_saved_settings();

		parent::__construct( $data );
	}

	public function get_name() {
		return 'page-settings';
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_page_settings',
			[
				'label' => __( 'Page Settings', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_SETTINGS,
			]
		);

		$this->add_control(
			'post_title',
			[
				'label' => __( 'Title', 'kitbuilder' ),
				'type' => Controls_Manager::TEXT,
				'default' => $this->post->post_title,
				'label_block' => true,
				'separator' => 'none',
			]
		);

		$page_title_selector = get_option( 'kitbuilder_page_title_selector' );

		if ( empty( $page_title_selector ) ) {
			$page_title_selector = 'h1.entry-title';
		}

		$this->add_control(
			'hide_title',
			[
				'label' => __( 'Hide Title', 'kitbuilder' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'No', 'kitbuilder' ),
				'label_on' => __( 'Yes', 'kitbuilder' ),
				'description' => sprintf( __( 'Not working? You can set a different selector for the title in the <a href="%s" target="_blank">Settings page</a>.', 'kitbuilder' ), Settings::get_url() ),
				'selectors' => [
					'{{WRAPPER}} ' . $page_title_selector => 'display: none',
				],
			]
		);

		if ( Manager::is_cpt_custom_templates_supported() ) {
			require_once ABSPATH . '/wp-admin/includes/template.php';

			$options = [
				'default' => __( 'Default', 'kitbuilder' ),
			];

			$options += array_flip( get_page_templates( null, $this->post->post_type ) );

			$saved_template = get_post_meta( $this->post->ID, '_wp_page_template', true );

			if ( ! $saved_template ) {
				$saved_template = 'default';
			}

			$this->add_control(
				'template',
				[
					'label' => __( 'Template', 'kitbuilder' ),
					'type' => Controls_Manager::SELECT,
					'default' => $saved_template,
					'options' => $options,
				]
			);
		}

		$post_type_object = get_post_type_object( $this->post->post_type );

		$can_publish = current_user_can( $post_type_object->cap->publish_posts );

		if ( 'publish' === $this->post->post_status || 'private' === $this->post->post_status || $can_publish ) {
			$this->add_control(
				'post_status',
				[
					'label' => __( 'Status', 'kitbuilder' ),
					'type' => Controls_Manager::SELECT,
					'default' => $this->post->post_status,
					'options' => get_post_statuses(),
				]
			);
		}

		$this->end_controls_section();

		$this->start_controls_section(
			'section_page_style',
			[
				'label' => __( 'Page Style', 'kitbuilder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background',
				'label' => __( 'Background', 'kitbuilder' ),
				'types' => [ 'none', 'classic', 'gradient' ],
			]
		);

		$this->add_responsive_control(
			'padding',
			[
				'label' => __( 'Padding', 'kitbuilder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors' => [
					'{{WRAPPER}}' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}',
				],
			]
		);

		$this->end_controls_section();
	}

	private function get_saved_settings() {
		$saved_settings = get_post_meta( $this->post->ID, Manager::META_KEY, true );

		return $saved_settings ? $saved_settings : [];
	}
}
