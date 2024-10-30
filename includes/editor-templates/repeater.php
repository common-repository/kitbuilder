<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

?>
<script type="text/template" id="tmpl-kitbuilder-repeater-row">
	<div class="kitbuilder-repeater-row-tools">
		<div class="kitbuilder-repeater-row-handle-sortable">
			<i class="fa fa-ellipsis-v"></i>
		</div>
		<div class="kitbuilder-repeater-row-item-title"></div>
		<div class="kitbuilder-repeater-row-tool kitbuilder-repeater-tool-duplicate">
			<i class="fa fa-copy"></i>
		</div>
		<div class="kitbuilder-repeater-row-tool kitbuilder-repeater-tool-remove">
			<i class="fa fa-remove"></i>
		</div>
	</div>
	<div class="kitbuilder-repeater-row-controls"></div>
</script>
