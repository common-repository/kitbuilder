<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<script type="text/template" id="tmpl-kitbuilder-panel-elements">

    <div id="kitbuilder-panel-elements-search-area"></div>
    <div id="kitbuilder-panel-elements-wrapper"></div>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-categories">
	<div id="kitbuilder-panel-categories"></div>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-elements-category">
	<div class="panel-elements-category-title panel-elements-category-title-{{ name }}">{{{ title }}}</div>
	<div class="panel-elements-category-items"></div>
</script>

<script type="text/template" id="tmpl-kitbuilder-panel-element-search">
	<input id="kitbuilder-panel-elements-search-input" placeholder="<?php _e( 'Search Widget...', 'kitbuilder' ); ?>" />
	<i class="fa fa-search"></i>
</script>

<script type="text/template" id="tmpl-kitbuilder-element-library-element">
	<div class="kitbuilder-element">
		<div class="icon">
			<i class="{{ icon }}"></i>
		</div>
		<div class="kitbuilder-element-title-wrapper">
			<div class="title">{{{ title }}}</div>
		</div>
	</div>
</script>
