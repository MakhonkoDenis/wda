( () => {
	'use strict';

// gulp modules
	const gulp       = require( 'gulp' ),
// gulp tasks
		compressImage = require( './tasks/compress-image' ),
		cleaner       = require( './tasks/cleaner' ),
		watchFiles    = require( './tasks/watch' ),
		useIn         = require( './tasks/use-in' );

	let configPath   = `${ __dirname }/config.json`,
		config       = require( configPath ),
		needDelete   = ( () => {
			let files = config['need-delete'].map( ( path ) => {

				path = config.projectPath + path;

				return path;
			});

			return files;
		} )();

	gulp
		.task( 'use-in', () => useIn( configPath, gulp ) )
		.task( 'compress-image', () => compressImage( config, gulp ) )
		.task( 'clean', () => cleaner( needDelete, gulp ) )
		.task( 'watch', () => watchFiles( config, gulp ) );

} )()
