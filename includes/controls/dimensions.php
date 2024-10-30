<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A group of Dimensions settings (Top, Right, Bottom, Left) With the option to link them together
 *
 * @param array  $default {
 * 		@type integer       $top                     Default empty
 * 		@type integer       $right                   Default empty
 * 		@type integer       $bottom                  Default empty
 * 		@type integer       $left                    Default empty
 * 		@type string        $unit                    The selected CSS Unit. 'px', '%', 'em'
 * 		                               				 Default 'px'
 * 		@type bool          $isLinked                Whether to link them together ( prevent set different values )
 * 		                               				 Default true
 * }
 *
 * @param array|string $allowed_dimensions      Which fields to show, 'all' | 'horizontal' | 'vertical' | [ 'top', 'left' ... ]
 *                                              Default 'all'
 *
 * @since                         1.0.0
 */
class Control_Dimensions extends Control_Base_Units {

	public function get_type() {
		return 'dimensions';
	}

	public function get_default_value() {
		return array_merge( parent::get_default_value(), [
			'top' => '',
			'right' => '',
			'bottom' => '',
			'left' => '',
			'isLinked' => true,
		] );
	}

	protected function get_default_settings() {
		return array_merge( parent::get_default_settings(), [
			'label_block' => true,
			'allowed_dimensions' => 'all',
			'placeholder' => '',
		] );
	}

	public function content_template() {
		$dimensions = [
			'top' => __( 'Top', 'kitbuilder' ),
			'right' => __( 'Right', 'kitbuilder' ),
			'bottom' => __( 'Bottom', 'kitbuilder' ),
			'left' => __( 'Left', 'kitbuilder' ),
		];
		?>
        <#
                var border_radius_type = '';
                if(typeof data.rel !== 'undefined' && data.rel === 'border_radius'){
                    border_radius_type = 'kitbuilder-control-dimensions-border-radius';
                }
        #>
		<div class="kitbuilder-control-field">
			<label class="kitbuilder-control-title">{{{ data.label }}}</label>
			<?php $this->print_units_template(); ?>
			<div class="kitbuilder-control-input-wrapper">
				<div class="kitbuilder-control-dimensions-wrap">
                    <ul class="kitbuilder-control-dimensions {{{ border_radius_type }}}">
                        <?php foreach ( $dimensions as $dimension_key => $dimension_title ) : ?>
                            <li class="kitbuilder-control-dimension kitbuilder-control-dimension-<?php echo esc_attr( $dimension_key ); ?>">
                                <input type="number" data-setting="<?php echo esc_attr( $dimension_key ); ?>"
                                       placeholder="<#
                                   if ( _.isObject( data.placeholder ) ) {
                                    if ( ! _.isUndefined( data.placeholder.<?php echo $dimension_key; ?> ) ) {
                                        print( data.placeholder.<?php echo $dimension_key; ?> );
                                    }
                                   } else {
                                    print( data.placeholder );
                                   } #>"
                                <# if ( -1 === _.indexOf( allowed_dimensions, '<?php echo $dimension_key; ?>' ) ) { #>
                                    disabled
                                    <# } #>
                                        />
                            </li>
                        <?php endforeach; ?>
                        <li class="kitbuilder-control-dimension-link">
                            <button class="kitbuilder-link-dimensions tooltip-target" data-tooltip="<?php _e( 'Link values together', 'kitbuilder' ); ?>">
                                <span class="kitbuilder-linked"><i class="fa fa-link"></i></span>
                                <span class="kitbuilder-unlinked"><i class="fa fa-chain-broken"></i></span>
                            </button>
                        </li>
                    </ul>
				</div>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="kitbuilder-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
