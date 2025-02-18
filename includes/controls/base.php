<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A base control for creation of all controls in the panel. All controls accept all the params listed below.
 *
 * @param string $label               The title of the control
 * @param mixed  $default             The default value
 * @param string $separator           Set the position of the control separator.
 *                                    'default' means that the separator will be posited depending on the control type.
 *                                    'before' || 'after' will force the separator position before/after the control.
 *                                    'none' will hide the separator
 *                                    Default: 'default'
 * @param bool   $show_label          Sets whether to show the title
 *                                    Default: true
 * @param bool   $label_block         Sets whether to display the title in a separate line
 *                                    Default: false
 * @param string $title               The title that will appear on mouse hover
 * @param string $placeholder         Available for fields that support placeholder
 * @param string $description         The field description that appears below the field
 *
 * @since 1.0.0
 */
abstract class Control_Base {

	private $_base_settings = [
		'label' => '',
		'separator' => 'default',
		'show_label' => true,
		'label_block' => false,
		'title' => '',
		'placeholder' => '',
		'description' => '',
	];

	private $_settings = [];

	abstract public function content_template();

	abstract public function get_type();

	public function __construct() {
		$this->_settings = array_merge( $this->_base_settings, $this->get_default_settings() );
	}

	public function enqueue() {}

	public function get_default_value() {
		return '';
	}

	public function get_value( $control, $widget ) {
		if ( ! isset( $control['default'] ) )
			$control['default'] = $this->get_default_value();

		if ( ! isset( $widget[ $control['name'] ] ) )
			return $control['default'];

		return $widget[ $control['name'] ];
	}

	public function get_style_value( $css_property, $control_value ) {
		return $control_value;
	}

	/**
	 * @param string $setting_key
	 *
	 * @return array
	 * @since 1.0.0
	 */
	final public function get_settings( $setting_key = null ) {
		if ( $setting_key ) {
			if ( isset( $this->_settings[ $setting_key ] ) ) {
				return $this->_settings[ $setting_key ];
			}

			return null;
		}

		return $this->_settings;
	}

	/**
	 * @return void
	 *
	 * @since 1.0.0
	 */
	final public function print_template() {
		?>
		<script type="text/html" id="tmpl-kitbuilder-control-<?php echo esc_attr( $this->get_type() ); ?>-content">
			<div class="kitbuilder-control-content">
				<?php $this->content_template(); ?>
			</div>
		</script>
		<?php
	}

	protected function get_default_settings() {
		return [];
	}
}
