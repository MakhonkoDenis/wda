'use strict';

/**
* Set project
* gulp use-in --path your_project_path
**/

module.exports = ( configPath, gulp ) => {
	let yargs       = require( 'yargs' ),
		notify      = require( 'gulp-notify' ),
		jeditor     = require( 'gulp-json-editor' ),
		messageText;

	return gulp
		.src( configPath )
		.pipe( jeditor( function( json ) {

			if ( yargs.argv.path ) {
				let path = ( yargs.argv.path + '/' ).replace( /\\\\$|\/\/$|\\\/$|\\/g, '/' );

				json.projectPath = path;
				messageText      = `PATH: ${ path }`;
			}

			if ( yargs.argv.domen ) {
				let domen = ( yargs.argv.domen + '/' ).replace( /\\\\$|\/\/$|\\\/$|\\/g, '/' );

				json.domen = domen;
				messageText     = `URL: ${ domen }`;
			}

			return json;
		} ) )
		.pipe( gulp.dest( './' ) )
		.pipe( notify(
			{
				title:'The project is switched',
				message: () => messageText
			}
		) );
}
