'use strict';

module.exports = function compressJs( data, server, gulp ) {
	let uglify  = require( 'gulp-uglify' ),
		suffix  = ( true === data.compress ) ? '.min' : '',
		plumber = require( 'gulp-plumber' ),
		rename  = require( 'gulp-rename' ),
		notify  = require( 'gulp-notify' );

	return gulp
		.src( data.input )
		.pipe( plumber() )
		.pipe( uglify() )
		.pipe( rename( { suffix: suffix } ) )
		.pipe( gulp.dest( data.output ) )
		.pipe( server( {stream: true} ) )
		.pipe( notify(
			{
				title:'Compress Java Script Success!',
				message: 'File: <%= file.relative %>'
			}
		) );
}
