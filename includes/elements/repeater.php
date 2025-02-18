<?php
namespace Kitbuilder;

class Repeater extends Element_Base {

	private static $counter = 0;

	public function __construct() {
		self::$counter++;

		parent::__construct();
	}

	public function get_name() {
		return 'repeater-' . self::$counter;
	}

	public static function get_type() {
		return 'repeater';
	}

	public function add_control( $id, array $args, $overwrite = false ) {
		if ( null !== $this->_current_tab ) {
			$args = array_merge( $args, $this->_current_tab );
		}

		return Plugin::$instance->controls_manager->add_control_to_stack( $this, $id, $args, $overwrite );
	}

	protected function _get_default_child_type( array $element_data ) {
		return false;
	}
}
