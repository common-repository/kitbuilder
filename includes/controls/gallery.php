<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A Gallery creation control. Based on the WordPress media gallery creator
 *
 * @param array $default   The selected images array [ [ 'id' => ??, 'url' => ?? ], [ 'id' => ??, 'url' => ?? ], ... ]
 *                         Default empty array
 *
 * @since 1.0.0
 */
class Control_Gallery extends Control_Base {

	public function get_type() {
		return 'gallery';
	}

	public function on_import( $settings ) {
		foreach ( $settings as &$attachment ) {
			if ( empty( $attachment['url'] ) )
				continue;

			$attachment = Plugin::$instance->templates_manager->get_import_images_instance()->import( $attachment );
		}

		// Filter out attachments that don't exist
		$settings = array_filter( $settings );

		return $settings;
	}

	public function content_template() {
		?>
		<div class="kitbuilder-control-field">
			<div class="kitbuilder-control-input-wrapper">
				<# if ( data.description ) { #>
				<div class="kitbuilder-control-field-description">{{{ data.description }}}</div>
				<# } #>
				<div class="kitbuilder-control-media">
					<div class="kitbuilder-control-gallery-status">
						<span class="kitbuilder-control-gallery-status-title">
							<# if ( data.controlValue.length ) {
								print( kitbuilder.translate( 'gallery_images_selected', [ data.controlValue.length ] ) );
							} else { #>
								<?php _e( 'No Images Selected', 'kitbuilder' ); ?>
							<# } #>
						</span>
						<span class="kitbuilder-control-gallery-clear">(<?php _e( 'Clear', 'kitbuilder' ); ?>)</span>
					</div>
					<div class="kitbuilder-control-gallery-thumbnails">
						<# _.each( data.controlValue, function( image ) { #>
							<div class="kitbuilder-control-gallery-thumbnail" style="background-image: url({{ image.url }})"></div>
						<# } ); #>
					</div>
					<button class="kitbuilder-button kitbuilder-control-gallery-add"><?php _e( '+ Add Images', 'kitbuilder' ); ?></button>
				</div>
			</div>
		</div>
		<?php
	}

	protected function get_default_settings() {
		return [
			'label_block' => true,
			'separator' => 'none',
		];
	}

	public function get_default_value() {
		return [];
	}
}
