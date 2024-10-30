<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Heartbeat {

	/**
	 * Handle the post lock in the editor.
	 *
	 * @since 1.0.0
	 *
	 * @param array $response
	 * @param array $data
	 *
	 * @return array
	 */
	public function heartbeat_received( $response, $data ) {
		if ( isset( $data['kitbuilder_post_lock']['post_ID'] ) ) {
			$post_id = $data['kitbuilder_post_lock']['post_ID'];
			$locked_user = Plugin::$instance->editor->get_locked_user( $post_id );

			if ( ! $locked_user || ! empty( $data['kitbuilder_force_post_lock'] ) ) {
				Plugin::$instance->editor->lock_post( $post_id );
			} else {
				$response['locked_user'] = $locked_user->display_name;
			}

			$response['kitbuilder_nonce'] = wp_create_nonce( 'kitbuilder-editing' );
		}
		return $response;
	}

	/**
	 * Heartbeat constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_filter( 'heartbeat_received', [ $this, 'heartbeat_received' ], 10, 2 );
	}
}
