<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Html extends Widget_Base {

	public function get_name() {
		return 'html';
	}

	public function get_title() {
		return __( 'HTML', 'kitbuilder' );
	}

	public function get_icon() {
		return 'kb kb-coding';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_title',
			[
				'label' => __( 'HTML Code', 'kitbuilder' ),
			]
		);

		$this->add_control(
			'html',
			[
				'label' => '',
				'type' => Controls_Manager::CODE,
				'default' => '',
				'placeholder' => __( 'Enter your embed code here', 'kitbuilder' ),
				'show_label' => false,
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		 echo $this->get_settings( 'html' );
	}

	protected function _content_template() {
		?>
		{{{ settings.html }}}
		<?php
	}
}
