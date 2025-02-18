<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_WordPress extends Widget_Base {

	/**
	 * @var string
	 */
	private $_widget_name = null;

	/**
	 * @var \WP_Widget
	 */
	private $_widget_instance = null;

	public function get_name() {
		return 'wp-widget-' . $this->get_widget_instance()->id_base;
	}

	public function get_title() {
		return $this->get_widget_instance()->name;
	}

	public function get_categories() {
		$category = 'wordpress';
		return [ $category ];
	}

	public function get_icon() {
		return 'kb kb-wordpress';
	}

	public function is_reload_preview_required() {
		return true;
	}

	public function get_form() {
		ob_start();
		$this->get_widget_instance()->form( $this->get_settings( 'wp' ) );
		return ob_get_clean();
	}

	/**
	 * @return \WP_Widget
	 */
	public function get_widget_instance() {
		if ( is_null( $this->_widget_instance ) ) {
			global $wp_widget_factory;

			if ( isset( $wp_widget_factory->widgets[ $this->_widget_name ] ) ) {
				$this->_widget_instance = $wp_widget_factory->widgets[ $this->_widget_name ];
				$this->_widget_instance->_set( 'REPLACE_TO_ID' );
			} elseif ( class_exists( $this->_widget_name ) ) {
				$this->_widget_instance = new $this->_widget_name;
				$this->_widget_instance->_set( 'REPLACE_TO_ID' );
			}
		}
		return $this->_widget_instance;
	}

	protected function _get_parsed_settings() {
		$settings = parent::_get_parsed_settings();

		if ( ! empty( $settings['wp'] ) ) {
			$settings['wp'] = $this->get_widget_instance()->update( $settings['wp'], [] );
		}

		return $settings;
	}

	protected function _register_controls() {
		$this->add_control(
			'wp',
			[
				'label' => __( 'Form', 'kitbuilder' ),
				'type' => Controls_Manager::WP_WIDGET,
				'widget' => $this->get_name(),
				'id_base' => $this->get_widget_instance()->id_base,
			]
		);
	}

	protected function render() {
		$empty_widget_args = [
			'widget_id' => $this->get_name(),
			'before_widget' => '',
			'after_widget' => '',
			'before_title' => '<h5>',
			'after_title' => '</h5>',
		];

		$this->get_widget_instance()->widget( $empty_widget_args, $this->get_settings( 'wp' ) );
	}

	protected function content_template() {}

	public function __construct( $data = [], $args = null ) {
		$this->_widget_name = $args['widget_name'];

		parent::__construct( $data, $args );
	}

	public function render_plain_content( $instance = [] ) {}
}
