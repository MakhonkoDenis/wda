'use strict';

module.exports = function compressImage ( config, gulp ){
	let imagemin = require( 'gulp-imagemin' ),
		plumber  = require( 'gulp-plumber' ),
		notify   = require( 'gulp-notify' );

	return gulp
		.src( config.projectPath + config.source.img[0].input )
		.pipe( plumber() )
		.pipe( imagemin() )
		.pipe( gulp.dest( config.projectPath ) )
		.pipe( notify(
			{
				title:'Compress image Success!',
				message: 'File: <%= file.relative %>'
			}
		) );
}
