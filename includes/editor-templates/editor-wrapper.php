<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

?>
<!DOCTYPE html>
<!--[if lt IE 7]>
<html class="no-js lt-ie9 lt-ie8 lt-ie7" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 7]>
<html class="no-js lt-ie9 lt-ie8" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 8]>
<html class="no-js lt-ie9" <?php language_attributes(); ?>> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" <?php language_attributes(); ?>> <!--<![endif]-->
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title><?php echo __( 'Kitbuilder', 'kitbuilder' ) . ' | ' . get_the_title(); ?></title>
	<?php wp_head(); ?>
</head>
<body class="kitbuilder-editor-active">
<div id="kitbuilder-editor-wrapper">
	<div id="kitbuilder-preview">
		<div id="kitbuilder-loading">
			<div class="kitbuilder-loader-wrapper">
				<div class="kitbuilder-loader">
                    <i class="fa fa-spin fa-circle-o-notch"></i>
				</div>
			</div>
		</div>
		<div id="kitbuilder-preview-responsive-wrapper" class="kitbuilder-device-desktop kitbuilder-device-rotate-portrait">
			<div id="kitbuilder-preview-loading">
				<i class="fa fa-spin fa-circle-o-notch"></i>
			</div>
			<?php
			// IFrame will be create here by the Javascript later.
			?>
		</div>
	</div>
	<div id="kitbuilder-panel" class="kitbuilder-panel"></div>
</div>
<?php wp_footer(); ?>
</body>
</html>
