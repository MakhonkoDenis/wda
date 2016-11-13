( () => {
'use strict';

const gulp   = require( 'gulp' ),
	yargs  = require( 'yargs' ),
	jeditor  = require( 'gulp-json-editor' ),
	notify = require('gulp-notify');

let renameFile = ( path, subDir, sufix ) => {
		path.dirname += subDir;
		path.basename += sufix;

		return path;
	},
	sortedSource = ( source ) => {
		let sortSource = {
			js: {},
			css: {},
			scss: {},
			image: {}
		};

		for ( let key in source ) {
			let inputFiles = source [ key ][ 'input' ],
				regExp     = /\.+(js|css|scss|jpg|jpeg|png|svg|gif)$/g,
				fileType   = regExp.exec( inputFiles )[1] ;

			switch( fileType ) {
				case 'js':
				case 'css':
				case 'scss':
					sortSource[ fileType ][ key ] = source[ key ];
					sortSource[ fileType ][ key ]['input'] = config.projectPath + sortSource[ fileType ][ key ]['input'];

					if ( sortSource[ fileType ][ key ]['ignor-input'] ) {
						sortSource[ fileType ][ key ]['ignor-input'] = '!' + config.projectPath + sortSource[ fileType ][ key ]['ignor-input'];
					}

					//sortSource[ fileType ][ key ]['input']
				break;
				default :
					sortSource.image[ key ] = source[ key ];
				break;
			}
		};

		return sortSource;
	};

let configPath = `${__dirname}/config.json`,
	config = require( configPath ),
	source = sortedSource( config.source );

/**
* Set project
* gulp use-in --path your_project_path
**/
gulp.task( 'use-in', ( done ) => {
	let newProjectPath= yargs.argv.path.replace( /\\/g, '/' );
	newProjectPath += '/';
	newProjectPath = newProjectPath.replace( /\/\//g, '/' )

	return gulp
		.src( configPath )
		.pipe( jeditor( function( json ) {
			json.projectPath = newProjectPath;
			return json;
		} ) )
		.pipe( gulp.dest( './' ) )
		.pipe( notify(
			{
				title:'The project is switched',
				message: newProjectPath
			}
		) );
} ).task( 'watch', () => {
	for ( let key in source ) {
		let inputFiles = source [ key ][ 'input' ],
			regExp     = /\.+(js|css|scss)$/g,
			fileType   = regExp.exec( inputFiles )[1] ;

		switch( fileType ) {
			case 'js':
			case 'css':
			case 'scss':
				sortSource[ fileType ][ key ]['input'] = config.projectPath + sortSource[ fileType ][ key ]['input'];

				if ( sortSource[ fileType ][ key ]['ignor-input'] ) {
					sortSource[ fileType ][ key ]['ignor-input'] = '!' + config.projectPath + sortSource[ fileType ][ key ]['ignor-input'];
				}
			break;
		}
	};
} );

} )()
