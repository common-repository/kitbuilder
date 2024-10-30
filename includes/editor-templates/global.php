<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<script type="text/template" id="tmpl-kitbuilder-empty-preview">
	<div class="kitbuilder-first-add">
		<div class="kitbuilder-icon kb kb-plus"></div>
	</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-preview">
	<div class="kitbuilder-section-wrap"></div>
	<div id="kitbuilder-add-section" class="kitbuilder-visible-desktop">
		<div id="kitbuilder-add-section-inner">
			<div id="kitbuilder-add-new-section">
				<button id="kitbuilder-add-section-button" class="kitbuilder-button"><?php _e( 'Add New Section', 'kitbuilder' ); ?></button>
				<button id="kitbuilder-add-template-button" class="kitbuilder-button"><?php _e( 'Add Template', 'kitbuilder' ); ?></button>
			</div>
			<div id="kitbuilder-select-preset">
				<div id="kitbuilder-select-preset-close">
					<i class="fa fa-times"></i>
				</div>
				<div id="kitbuilder-select-preset-title"><?php _e( 'Select your Structure', 'kitbuilder' ); ?></div>
				<ul id="kitbuilder-select-preset-list">
					<#
					var structures = [ 10, 20, 30, 40, 21, 22, 31, 32, 33, 50, 60, 34 ];

					_.each( structures, function( structure ) {
						var preset = kitbuilder.presetsFactory.getPresetByStructure( structure ); #>

						<li class="kitbuilder-preset kitbuilder-column kitbuilder-col-16" data-structure="{{ structure }}">
							{{{ kitbuilder.presetsFactory.getPresetSVG( preset.preset ).outerHTML }}}
						</li>
					<# } ); #>
				</ul>
			</div>
		</div>
	</div>
</script>
