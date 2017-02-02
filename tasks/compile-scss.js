'use strict';

module.exports = function compileScss( data, server, gulp ){
	let sass            = require( 'gulp-sass' ),
		autoprefixer    = require('gulp-autoprefixer'),
		plumber         = require( 'gulp-plumber' ),
		rename          = require( 'gulp-rename' ),
		notify          = require( 'gulp-notify' ),
		compileSettings = {},
		suffix          = '';

	if ( true === data.compress ) {
		compileSettings.outputStyle = 'compressed';
		suffix = '.min';
	}

	return gulp
		.src( data.input )
		.pipe( plumber() )
		.pipe( autoprefixer() )
		.pipe( sass( compileSettings ) )
		.pipe( rename( { suffix: suffix } ) )
		.pipe( gulp.dest( data.output ) )
		.pipe( server( {stream: true} ) )
		.pipe( notify(
			{
				title:'Compile SASS Success!',
				message: 'File: <%= file.relative %>'
			}
		) );
}
