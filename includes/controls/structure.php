<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A private control for section columns structure.
 *
 * @since 1.0.0
 */
class Control_Structure extends Control_Base {

	public function get_type() {
		return 'structure';
	}

	public function content_template() {
		?>
		<div class="kitbuilder-control-field">
			<div class="kitbuilder-control-input-wrapper">
				<div class="kitbuilder-control-structure-title"><?php _e( 'Structure', 'kitbuilder' ); ?></div>
				<# var currentPreset = kitbuilder.presetsFactory.getPresetByStructure( data.controlValue ); #>
				<div class="kitbuilder-control-structure-preset kitbuilder-control-structure-current-preset">
					{{{ kitbuilder.presetsFactory.getPresetSVG( currentPreset.preset, 233, 72, 5 ).outerHTML }}}
				</div>
				<div class="kitbuilder-control-structure-reset"><i class="fa fa-undo"></i><?php _e( 'Reset Structure', 'kitbuilder' ); ?></div>
				<#
				var morePresets = getMorePresets();

				if ( morePresets.length > 1 ) { #>
					<div class="kitbuilder-control-structure-more-presets-title"><?php _e( 'More Structures', 'kitbuilder' ); ?></div>
					<div class="kitbuilder-control-structure-more-presets">
						<# _.each( morePresets, function( preset ) { #>
							<div class="kitbuilder-control-structure-preset-wrapper">
								<input id="kitbuilder-control-structure-preset-{{ data._cid }}-{{ preset.key }}" type="radio" name="kitbuilder-control-structure-preset-{{ data._cid }}" data-setting="structure" value="{{ preset.key }}">
								<label class="kitbuilder-control-structure-preset" for="kitbuilder-control-structure-preset-{{ data._cid }}-{{ preset.key }}">
									{{{ kitbuilder.presetsFactory.getPresetSVG( preset.preset, 102, 42 ).outerHTML }}}
								</label>
								<div class="kitbuilder-control-structure-preset-title">{{{ preset.preset.join( ', ' ) }}}</div>
							</div>
						<# } ); #>
					</div>
				<# } #>
			</div>
		</div>
		
		<# if ( data.description ) { #>
			<div class="kitbuilder-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}

	protected function get_default_settings() {
		return [
			'separator' => 'none',
		];
	}
}
