<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<script type="text/template" id="tmpl-kitbuilder-template-library-header">
	<div id="kitbuilder-template-library-header-logo-area"></div>
	<div id="kitbuilder-template-library-header-menu-area"></div>
	<div id="kitbuilder-template-library-header-items-area">
		<div id="kitbuilder-template-library-header-close-modal" class="kitbuilder-template-library-header-item" title="<?php _e( 'Close', 'kitbuilder' ); ?>">
			<i class="kb kb-close" title="<?php _e( 'Close', 'kitbuilder' ); ?>"></i>
		</div>
		<div id="kitbuilder-template-library-header-tools"></div>
	</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-header-logo">
	<i class="kb kb-kitbuilder-square"></i><span><?php _e( 'Library', 'kitbuilder' ); ?></span>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-header-save">
	<i class="kb kb-save" title="<?php _e( 'Save Template', 'kitbuilder' ); ?>"></i>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-header-menu">
	<div id="kitbuilder-template-library-menu-pre-made-templates" class="kitbuilder-template-library-menu-item" data-template-source="remote"><?php _e( 'Predesigned Templates', 'kitbuilder' ); ?></div>
	<div id="kitbuilder-template-library-menu-my-templates" class="kitbuilder-template-library-menu-item" data-template-source="local"><?php _e( 'My Templates', 'kitbuilder' ); ?></div>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-header-preview">
	<div id="kitbuilder-template-library-header-preview-insert-wrapper" class="kitbuilder-template-library-header-item">
		{{{ kitbuilder.templates.getLayout().getTemplateActionButton( isPro ) }}}
	</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-header-back">
	<i class="kb kb-"></i><span><?php _e( 'Back To library', 'kitbuilder' ); ?></span>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-loading">
	<div class="kitbuilder-loader-wrapper">
		<div class="kitbuilder-loader">
            <i class="fa fa-spin fa-circle-o-notch"></i>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-templates">
	<div id="kitbuilder-template-library-templates-container"></div>
	<div id="kitbuilder-template-library-footer-banner">
		<i class="kb kb-nerd"></i>
		<div class="kitbuilder-excerpt"><?php echo __( 'Stay tuned! More awesome templates coming real soon.', 'kitbuilder' ); ?></div>
	</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-template-remote">
	<div class="kitbuilder-template-library-template-body">
		<div class="kitbuilder-template-library-template-screenshot" style="background-image: url({{ thumbnail }});"></div>
		<div class="kitbuilder-template-library-template-controls">
			<div class="kitbuilder-template-library-template-preview">
				<i class="fa fa-search-plus"></i>
			</div>
			{{{ kitbuilder.templates.getLayout().getTemplateActionButton( isPro ) }}}
		</div>
	</div>
	<div class="kitbuilder-template-library-template-name">{{{ title }}}</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-insert-button">
	<button class="kitbuilder-template-library-template-insert kitbuilder-button kitbuilder-button-success" data-action="insert">
		<i class="kb kb-file-download"></i><span class="kitbuilder-button-title"><?php _e( 'Insert', 'kitbuilder' ); ?></span>
	</button>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-get-pro-button">
	<button class="kitbuilder-template-library-template-insert kitbuilder-button kitbuilder-button-go-pro" data-action="get-pro">
		<i class="fa fa-external-link-square"></i><span class="kitbuilder-button-title"><?php _e( 'Go Pro', 'kitbuilder' ); ?></span>
	</button>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-template-local">
	<div class="kitbuilder-template-library-template-icon">
		<i class="fa fa-{{ 'section' === type ? 'columns' : 'file-text-o' }}"></i>
	</div>
	<div class="kitbuilder-template-library-template-name">{{{ title }}}</div>
	<div class="kitbuilder-template-library-template-type">{{{ kitbuilder.translate( type ) }}}</div>
	<div class="kitbuilder-template-library-template-controls">
		<button class="kitbuilder-template-library-template-insert kitbuilder-button kitbuilder-button-success" data-action="insert">
			<i class="kb kb-file-download"></i><span class="kitbuilder-button-title"><?php _e( 'Insert', 'kitbuilder' ); ?></span>
		</button>
		<div class="kitbuilder-template-library-template-export">
			<a href="{{ export_link }}">
				<i class="fa fa-sign-out"></i><span class="kitbuilder-template-library-template-control-title"><?php echo __( 'Export', 'kitbuilder' ); ?></span>
			</a>
		</div>
		<div class="kitbuilder-template-library-template-delete">
			<i class="fa fa-trash-o"></i><span class="kitbuilder-template-library-template-control-title"><?php echo __( 'Delete', 'kitbuilder' ); ?></span>
		</div>
		<div class="kitbuilder-template-library-template-preview">
			<i class="kb kb-zoom-in"></i><span class="kitbuilder-template-library-template-control-title"><?php echo __( 'Preview', 'kitbuilder' ); ?></span>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-save-template">
	<div class="kitbuilder-template-library-blank-title">{{{ title }}}</div>
	<div class="kitbuilder-template-library-blank-excerpt">{{{ description }}}</div>
	<form id="kitbuilder-template-library-save-template-form">
		<input id="kitbuilder-template-library-save-template-name" name="title" placeholder="<?php _e( 'Enter Template Name', 'kitbuilder' ); ?>" required>
		<button id="kitbuilder-template-library-save-template-submit" class="kitbuilder-button kitbuilder-button-success">
			<span class="kitbuilder-state-icon">
				<i class="fa fa-spin fa-circle-o-notch "></i>
			</span>
			<?php _e( 'Save', 'kitbuilder' ); ?>
		</button>
	</form>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-import">
	<form id="kitbuilder-template-library-import-form">
		<input type="file" name="file" />
		<input type="submit">
	</form>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-templates-empty">
	<div id="kitbuilder-template-library-templates-empty-icon">
		<i class="kb kb-nerd"></i>
	</div>
	<div class="kitbuilder-template-library-blank-title"><?php _e( 'Haven’t Saved Templates Yet?', 'kitbuilder' ); ?></div>
	<div class="kitbuilder-template-library-blank-excerpt"><?php _e( 'This is where your templates should be. Design it. Save it. Reuse it.', 'kitbuilder' ); ?></div>
</script>

<script type="text/template" id="tmpl-kitbuilder-template-library-preview">
	<iframe></iframe>
</script>
