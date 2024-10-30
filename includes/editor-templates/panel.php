<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<script type="text/template" id="tmpl-kitbuilder-panel">
	<div id="kitbuilder-mode-switcher"></div>
    <div id="kitbuilder-panel-content-wrap">
        <div id="kitbuilder-panel-elements-header-wrap">
            <div id="kitbuilder-panel-elements-header"><?php _e('Elements', 'kitbuilder') ?></div>
            <div id="kitbuilder-panel-elements-header-close"><i class="fa fa-times" aria-hidden="true"></i></div>
        </div>

        <div id="kitbuilder-panel-content-wrapper-top"><div id="kitbuilder-panel-content-wrapper"></div></div>
    </div>
	<header id="kitbuilder-panel-header-wrapper"></header>

	<footer id="kitbuilder-panel-footer">
		<div class="kitbuilder-panel-container">
		</div>
	</footer>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-menu-item">
	<div class="kitbuilder-panel-menu-item-icon">
		<i class="{{ icon }}"></i>
	</div>
	<div class="kitbuilder-panel-menu-item-title">{{{ title }}}</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-header">
	<div id="kitbuilder-panel-header-menu-button" class="kitbuilder-header-button">
		<i class="kitbuilder-icon kb kb-settings tooltip-target" data-tooltip="<?php esc_attr_e( 'Menu', 'kitbuilder' ); ?>"></i>
	</div>
	<div id="kitbuilder-panel-header-add-button" class="kitbuilder-header-button">
		<i class="kitbuilder-icon kb kb-apps tooltip-target" data-tooltip="<?php esc_attr_e( 'Widgets Panel', 'kitbuilder' ); ?>"></i>
	</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-footer-content">
	<div id="kitbuilder-panel-footer-responsive" class="kitbuilder-panel-footer-tool" title="<?php esc_attr_e( 'Responsive Mode', 'kitbuilder' ); ?>">
		<i class="kb kb-device-desktop"></i>
		<div class="kitbuilder-panel-footer-sub-menu-wrapper">
			<div class="kitbuilder-panel-footer-sub-menu">
				<div class="kitbuilder-panel-footer-sub-menu-item" data-device-mode="desktop">
					<i class="kitbuilder-icon kb kb-device-desktop"></i>
					<span class="kitbuilder-title"><?php _e( 'Desktop', 'kitbuilder' ); ?></span>
					<span class="kitbuilder-description"><?php _e( 'Default Preview', 'kitbuilder' ); ?></span>
				</div>
				<div class="kitbuilder-panel-footer-sub-menu-item" data-device-mode="tablet">
					<i class="kitbuilder-icon kb kb-device-tablet"></i>
					<span class="kitbuilder-title"><?php _e( 'Tablet', 'kitbuilder' ); ?></span>
					<span class="kitbuilder-description"><?php _e( 'Preview for 768px', 'kitbuilder' ); ?></span>
				</div>
				<div class="kitbuilder-panel-footer-sub-menu-item" data-device-mode="mobile">
					<i class="kitbuilder-icon kb kb-device-mobile"></i>
					<span class="kitbuilder-title"><?php _e( 'Mobile', 'kitbuilder' ); ?></span>
					<span class="kitbuilder-description"><?php _e( 'Preview for 360px', 'kitbuilder' ); ?></span>
				</div>
			</div>
		</div>
	</div>
	<div id="kitbuilder-panel-footer-templates" class="kitbuilder-panel-footer-tool" title="<?php esc_attr_e( 'Templates', 'kitbuilder' ); ?>">
		<span class="kitbuilder-screen-only"><?php _e( 'Templates', 'kitbuilder' ); ?></span>
		<i class="fa fa-folder"></i>
		<div class="kitbuilder-panel-footer-sub-menu-wrapper">
			<div class="kitbuilder-panel-footer-sub-menu">
				<div id="kitbuilder-panel-footer-templates-modal" class="kitbuilder-panel-footer-sub-menu-item">
					<i class="kitbuilder-icon fa fa-folder"></i>
					<span class="kitbuilder-title"><?php _e( 'Templates Library', 'kitbuilder' ); ?></span>
				</div>
				<div id="kitbuilder-panel-footer-save-template" class="kitbuilder-panel-footer-sub-menu-item">
					<i class="kitbuilder-icon fa fa-save"></i>
					<span class="kitbuilder-title"><?php _e( 'Save Template', 'kitbuilder' ); ?></span>
				</div>
			</div>
		</div>
	</div>
	<div id="kitbuilder-panel-footer-save" class="kitbuilder-panel-footer-tool" title="<?php esc_attr_e( 'Save', 'kitbuilder' ); ?>">
		<button class="kitbuilder-button">
			<span class="kitbuilder-state-icon">
				<i class="fa fa-spin fa-circle-o-notch "></i>
			</span>
			<?php _e( 'Save', 'kitbuilder' ); ?>
		</button>
		<?php /*<div class="kitbuilder-panel-footer-sub-menu-wrapper">
			<div class="kitbuilder-panel-footer-sub-menu">
				<div id="kitbuilder-panel-footer-publish" class="kitbuilder-panel-footer-sub-menu-item">
					<i class="kitbuilder-icon fa fa-check-circle"></i>
					<span class="kitbuilder-title"><?php _e( 'Publish', 'kitbuilder' ); ?></span>
				</div>
				<div id="kitbuilder-panel-footer-discard" class="kitbuilder-panel-footer-sub-menu-item">
					<i class="kitbuilder-icon fa fa-times-circle"></i>
					<span class="kitbuilder-title"><?php _e( 'Discard', 'kitbuilder' ); ?></span>
				</div>
			</div>
		</div>*/ ?>
	</div>
    <div id="kitbuilder-panel-footer-exit" class="kitbuilder-panel-footer-tool" title="<?php _e( 'Exit', 'kitbuilder' ); ?>">
        <a id="kitbuilder-panel-footer-view-page" class="kitbuilder-button" href="<?php the_permalink(); ?>">
            <i class="kitbuilder-icon fa fa-times"></i>
            <span class="kitbuilder-title"><?php _e( 'Close', 'kitbuilder' ); ?></span>
        </a>
    </div>
</script>

<script type="text/template" id="tmpl-kitbuilder-mode-switcher-content">
	<input id="kitbuilder-mode-switcher-preview-input" type="checkbox">
	<label for="kitbuilder-mode-switcher-preview-input" id="kitbuilder-mode-switcher-preview" title="<?php esc_attr_e( 'Preview', 'kitbuilder' ); ?>">
		<span class="kitbuilder-screen-only"><?php _e( 'Preview', 'kitbuilder' ); ?></span>
		<i class="fa"></i>
	</label>
</script>

<script type="text/template" id="tmpl-editor-content">
	<div class="kitbuilder-panel-navigation kitbuilder-clearfix">
		<# _.each( elementData.tabs_controls, function( tabTitle, tabSlug ) { #>
		<div class="kitbuilder-panel-navigation-tab kitbuilder-tab-control-{{ tabSlug }}" data-tab="{{ tabSlug }}">
			<a href="#">{{{ tabTitle }}}</a>
		</div>
		<# } ); #>
	</div>
	<# if ( elementData.reload_preview ) { #>
		<div class="kitbuilder-update-preview">
			<div class="kitbuilder-update-preview-title"><?php echo __( 'Update changes to page', 'kitbuilder' ); ?></div>
			<div class="kitbuilder-update-preview-button-wrapper">
				<button class="kitbuilder-update-preview-button kitbuilder-button kitbuilder-button-success"><?php echo __( 'Apply', 'kitbuilder' ); ?></button>
			</div>
		</div>
	<# } #>
	<div id="kitbuilder-controls"></div>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-schemes-disabled">
	<i class="kitbuilder-panel-nerd-box-icon kb kb-nerd"></i>
	<div class="kitbuilder-panel-nerd-box-title">{{{ '<?php echo __( '{0} are disabled', 'kitbuilder' ); ?>'.replace( '{0}', disabledTitle ) }}}</div>
	<div class="kitbuilder-panel-nerd-box-message"><?php printf( __( 'You can enable it from the <a href="%s" target="_blank">Kitbuilder settings page</a>.', 'kitbuilder' ), Settings::get_url() ); ?></div>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-scheme-color-item">
    <div class="kitbuilder-panel-scheme-color-title">{{{ title }}}</div>
	<div class="kitbuilder-panel-scheme-color-input-wrapper">
		<input type="text" class="kitbuilder-panel-scheme-color-value" value="{{ value }}" data-alpha="true" />
	</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-scheme-typography-item">
	<div class="kitbuilder-panel-heading">
		<div class="kitbuilder-panel-heading-toggle">
			<i class="fa"></i>
		</div>
		<div class="kitbuilder-panel-heading-title">{{{ title }}}</div>
	</div>
	<div class="kitbuilder-panel-scheme-typography-items kitbuilder-panel-box-content">
		<?php
		$scheme_fields_keys = Group_Control_Typography::get_scheme_fields_keys();

		$typography_group = Plugin::$instance->controls_manager->get_control_groups( 'typography' );

		$typography_fields = $typography_group->get_fields();

		$scheme_fields = array_intersect_key( $typography_fields, array_flip( $scheme_fields_keys ) );

		$system_fonts = Fonts::get_fonts_by_groups( [ Fonts::SYSTEM ] );

		$google_fonts = Fonts::get_fonts_by_groups( [ Fonts::GOOGLE, Fonts::EARLYACCESS ] );

		foreach ( $scheme_fields as $option_name => $option ) : ?>
			<div class="kitbuilder-panel-scheme-typography-item">
				<div class="kitbuilder-panel-scheme-item-title kitbuilder-control-title"><?php echo $option['label']; ?></div>
				<div class="kitbuilder-panel-scheme-typography-item-value">
					<?php if ( 'select' === $option['type'] ) : ?>
						<select name="<?php echo $option_name; ?>" class="kitbuilder-panel-scheme-typography-item-field">
							<?php foreach ( $option['options'] as $field_key => $field_value ) : ?>
								<option value="<?php echo $field_key; ?>"><?php echo $field_value; ?></option>
							<?php endforeach; ?>
						</select>
					<?php elseif ( 'font' === $option['type'] ) : ?>
						<select name="<?php echo $option_name; ?>" class="kitbuilder-panel-scheme-typography-item-field">
							<option value=""><?php _e( 'Default', 'kitbuilder' ); ?></option>

							<optgroup label="<?php _e( 'System', 'kitbuilder' ); ?>">
								<?php foreach ( $system_fonts as $font_title => $font_type ) : ?>
									<option value="<?php echo esc_attr( $font_title ); ?>"><?php echo $font_title; ?></option>
								<?php endforeach; ?>
							</optgroup>

							<optgroup label="<?php _e( 'Google', 'kitbuilder' ); ?>">
								<?php foreach ( $google_fonts as $font_title => $font_type ) : ?>
									<option value="<?php echo esc_attr( $font_title ); ?>"><?php echo $font_title; ?></option>
								<?php endforeach; ?>
							</optgroup>
						</select>
					<?php elseif ( 'text' === $option['type'] ) : ?>
						<input name="<?php echo $option_name; ?>" class="kitbuilder-panel-scheme-typography-item-field" />
					<?php endif; ?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-control-responsive-switchers">
	<div class="kitbuilder-control-responsive-switchers">
		<a class="kitbuilder-responsive-switcher kitbuilder-responsive-switcher-desktop" data-device="desktop">
			<i class="kb kb-device-desktop"></i>
		</a>
		<a class="kitbuilder-responsive-switcher kitbuilder-responsive-switcher-tablet" data-device="tablet">
			<i class="kb kb-device-tablet"></i>
		</a>
		<a class="kitbuilder-responsive-switcher kitbuilder-responsive-switcher-mobile" data-device="mobile">
			<i class="kb kb-device-mobile"></i>
		</a>
	</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-revisions">
	<div class="kitbuilder-panel-scheme-buttons">
		<div class="kitbuilder-panel-scheme-button-wrapper kitbuilder-panel-scheme-discard">
			<button class="kitbuilder-button" disabled>
				<i class="fa fa-times"></i><?php _e( 'Discard', 'kitbuilder' ); ?>
			</button>
		</div>
		<div class="kitbuilder-panel-scheme-button-wrapper kitbuilder-panel-scheme-save">
			<button class="kitbuilder-button kitbuilder-button-success" disabled>
				<?php _e( 'Apply', 'kitbuilder' ); ?>
			</button>
		</div>
	</div>
	<div class="kitbuilder-panel-box">
		<div class="kitbuilder-panel-heading">
			<div class="kitbuilder-panel-heading-title"><?php _e( 'Revision History', 'kitbuilder' ); ?></div>
		</div>
		<div id="kitbuilder-revisions-list" class="kitbuilder-panel-box-content"></div>
	</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-page-settings">
	<div class="kitbuilder-panel-navigation kitbuilder-clearfix">
		<# _.each( kitbuilder.config.page_settings.tabs, function( tabTitle, tabSlug ) { #>
			<div class="kitbuilder-panel-navigation-tab kitbuilder-tab-control-{{ tabSlug }}" data-tab="{{ tabSlug }}">
				<a href="#">{{{ tabTitle }}}</a>
			</div>
			<# } ); #>
	</div>
	<div id="kitbuilder-panel-page-settings-controls" class="kitbuilder-panel-box"></div>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-revisions-no-revisions">
	<i class="kitbuilder-panel-nerd-box-icon kb kb-nerd"></i>
	<div class="kitbuilder-panel-nerd-box-title"><?php _e( 'No Revisions Saved Yet', 'kitbuilder' ); ?></div>
	<div class="kitbuilder-panel-nerd-box-message">{{{ kitbuilder.translate( kitbuilder.config.revisions_enabled ? 'no_revisions_1' : 'revisions_disabled_1' ) }}}</div>
	<div class="kitbuilder-panel-nerd-box-message">{{{ kitbuilder.translate( kitbuilder.config.revisions_enabled ? 'no_revisions_2' : 'revisions_disabled_2' ) }}}</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-revisions-revision-item">
	<div class="kitbuilder-revision-item__gravatar">{{{ gravatar }}}</div>
	<div class="kitbuilder-revision-item__details">
		<div class="kitbuilder-revision-date">{{{ date }}}</div>
		<div class="kitbuilder-revision-meta">{{{ kitbuilder.translate( type ) }}} <?php _e( 'By', 'kitbuilder' ); ?> {{{ author }}}</div>
	</div>
	<div class="kitbuilder-revision-item__tools">
		<i class="kitbuilder-revision-item__tools-delete fa fa-times"></i>
		<i class="kitbuilder-revision-item__tools-spinner fa fa-spin fa-circle-o-notch"></i>
	</div>
</script>
