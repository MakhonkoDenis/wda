'use strict';

module.exports = function compressCss( data, server, gulp ){
	let uglifycss = require( 'gulp-uglifycss' ),
		suffix    = ( true === data.compress ) ? '.min' : '',
		plumber   = require( 'gulp-plumber' ),
		rename    = require( 'gulp-rename' ),
		notify    = require( 'gulp-notify' );

	return gulp
		.src( data.input )
		.pipe( plumber() )
		.pipe( uglifycss() )
		.pipe( rename( { suffix: suffix } ) )
		.pipe( gulp.dest( data.output ) )
		.pipe( server( {stream: true} ) )
		.pipe( notify(
			{
				title:'Compress Css Success!',
				message: 'File: <%= file.relative %>'
			}
		) );
};
