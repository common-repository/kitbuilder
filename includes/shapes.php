<?php
namespace Kitbuilder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Shapes {
	const FILTER_EXCLUDE = 'exclude';

	const FILTER_INCLUDE = 'include';

	private static $shapes;

	public static function get_shapes( $shape = null ) {
		if ( null === self::$shapes ) {
			self::init_shapes();
		}

		if ( $shape ) {
			return isset( self::$shapes[ $shape ] ) ? self::$shapes[ $shape ] : null;
		}

		return self::$shapes;
	}

	public static function filter_shapes( $by, $filter = self::FILTER_INCLUDE ) {
		return array_filter( self::get_shapes(), function( $shape ) use ( $by, $filter ) {
			return self::FILTER_INCLUDE === $filter xor empty( $shape[ $by ] );
		} );
	}

	public static function get_shape_path( $shape, $is_negative = false ) {
		$file_name = $shape;

		if ( $is_negative ) {
			$file_name .= '-negative';
		}

		return KITBUILDER_PATH . 'assets/shapes/' . $file_name . '.svg';
	}

	private static function init_shapes() {
		self::$shapes = [
			'mountains' => [
				'title' => _x( 'Mountains', 'Shapes', 'kitbuilder' ),
				'has_flip' => true,
			],
			'drops' => [
				'title' => _x( 'Drops', 'Shapes', 'kitbuilder' ),
				'has_negative' => true,
				'has_flip' => true,
				'height_only' => true,
			],
			'clouds' => [
				'title' => _x( 'Clouds', 'Shapes', 'kitbuilder' ),
				'has_negative' => true,
				'has_flip' => true,
				'height_only' => true,
			],
			'zigzag' => [
				'title' => _x( 'Zigzag', 'Shapes', 'kitbuilder' ),
			],
			'pyramids' => [
				'title' => _x( 'Pyramids', 'Shapes', 'kitbuilder' ),
				'has_negative' => true,
				'has_flip' => true,
			],
			'triangle' => [
				'title' => _x( 'Triangle', 'Shapes', 'kitbuilder' ),
				'has_negative' => true,
			],
			'triangle-asymmetrical' => [
				'title' => _x( 'Triangle Asymmetrical', 'Shapes', 'kitbuilder' ),
				'has_negative' => true,
				'has_flip' => true,
			],
			'tilt' => [
				'title' => _x( 'Tilt', 'Shapes', 'kitbuilder' ),
				'has_flip' => true,
				'height_only' => true,
			],
			'opacity-tilt' => [
				'title' => _x( 'Tilt Opacity', 'Shapes', 'kitbuilder' ),
				'has_flip' => true,
			],
			'opacity-fan' => [
				'title' => _x( 'Fan Opacity', 'Shapes', 'kitbuilder' ),
			],
			'curve' => [
				'title' => _x( 'Curve', 'Shapes', 'kitbuilder' ),
				'has_negative' => true,
			],
			'curve-asymmetrical' => [
				'title' => _x( 'Curve Asymmetrical', 'Shapes', 'kitbuilder' ),
				'has_negative' => true,
				'has_flip' => true,
			],
			'waves' => [
				'title' => _x( 'Waves', 'Shapes', 'kitbuilder' ),
				'has_negative' => true,
				'has_flip' => true,
			],
			'wave-brush' => [
				'title' => _x( 'Waves Brush', 'Shapes', 'kitbuilder' ),
				'has_flip' => true,
			],
			'waves-pattern' => [
				'title' => _x( 'Waves Pattern', 'Shapes', 'kitbuilder' ),
				'has_flip' => true,
			],
			'arrow' => [
				'title' => _x( 'Arrow', 'Shapes', 'kitbuilder' ),
				'has_negative' => true,
			],
			'split' => [
				'title' => _x( 'Split', 'Shapes', 'kitbuilder' ),
				'has_negative' => true,
			],
			'book' => [
				'title' => _x( 'Book', 'Shapes', 'kitbuilder' ),
				'has_negative' => true,
			],
		];
	}
}
