( () => {
	'use strict';

	const gulp       = require( 'gulp' ),
		plumber      = require( 'gulp-plumber' ),
		notify       = require('gulp-notify'),
		rename       = require( 'gulp-rename' );

	let configPath   = `${__dirname}/config.json`,
		config       = require( configPath ),
		imagesSource = `${ config.projectPath }**/*.+(jpg|jpeg|png|svg|gif)`,
		needDelete   = ( () => {
			let files = config['need-delete'];

			files = files.map( ( path ) => {
				path = config.projectPath + path;
				return path;
			})
			return files;
		} )();

	let parsedSrc = ( src, path ) => {
			let outputObject = null,
				regExp       = /\.+(js|css|scss)$/g,
				inputFile    = path + src['input'],
				ignorFiles   = ( src['ignor-input'] ) ? src['ignor-input'] : [] ,
				fileType     = regExp.exec( inputFile )[1],
				functionName = null;

			if ( ignorFiles[0] ) {
				ignorFiles = ignorFiles.map( ( element ) => {
					element = element.replace( /^(!|!\/)/gi, '!' + path );

					return element;
				} )
			}

			switch( fileType ) {
				case 'js':
					functionName = compressJs;
				break;
				case 'css':
					functionName = compressCss;
				break;
				case 'scss':
					functionName = compileScss;
				break;
			};

			outputObject = {
				input: inputFile,
				output: src['output'],
				ignor: ignorFiles,
				compress: ( undefined !== src['compress'] ) ? src['compress'] : true,
				taskFunction: functionName
			};

			return outputObject;
		};

/**
* Set project
* gulp use-in --path your_project_path
**/
	gulp
		.task( 'use-in', ( done ) => {
			let yargs          = require( 'yargs' ),
				jeditor        = require( 'gulp-json-editor' ),
				newProjectPath = yargs.argv.path.replace( /\\/g, '/' ) + '/';

			newProjectPath = newProjectPath.replace( /\/\//g, '/' );

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
		} )
// Watch files
		.task( 'watch', () => {
			let source = config.source,
				regexp = /[^(\\|\/)]*([a-zA-Z]+$)/gi;

			for ( let key in source ) {
				let fileData = parsedSrc( source[ key ], config.projectPath );

				gulp
					.watch(
						fileData.input,
						function() {}
					)
					.on( 'change', ( event ) => {
						let input = event.path.replace( /\\/g, '/' ),
							data  = null;

						if ( -1 !== input.search( /(\.min|\/min)/gi ) ) {
							return false;
						}

						data = {
							input: [ input, ...fileData.ignor ],
							ignor: fileData.ignor,
							output: event.path.replace( regexp, fileData.output ),
							compress: fileData.compress
						}

						fileData.taskFunction( data );
					} )
			};
		} )
		.task( 'compress-image', compressImage )
		.task( 'clean', cleaner );

// Compile Scss
	function compileScss( data ){
		let sass            = require( 'gulp-sass' ),
			autoprefixer    = require('gulp-autoprefixer'),
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
			.pipe( rename( ( filePath )  => {
				filePath.basename += suffix;
			} ) )
			.pipe( gulp.dest( data.output ) )
			.pipe( notify(
				{
					title:'Compile SASS Success!',
					message: 'File: <%= file.relative %>'
				}
			) );
	}

// Compress Image
	function compressJs ( data ){
		let uglify = require( 'gulp-uglify' ),
			suffix = ( true === data.compress ) ? '.min' : '';

		return gulp
			.src( data.input )
			.pipe( plumber() )
			.pipe( uglify() )
			.pipe( rename( ( filePath )  => {
				filePath.basename += suffix;
			} ) )
			.pipe( gulp.dest( data.output ) )
			.pipe( notify(
				{
					title:'Compress Java Script Success!',
					message: 'File: <%= file.relative %>'
				}
			) );
	}

// Compress Image
	function compressCss( data ){
		let uglifycss = require( 'gulp-uglifycss' ),
			suffix = ( true === data.compress ) ? '.min' : '';

		return gulp
			.src( data.input )
			.pipe( plumber() )
			.pipe( uglifycss() )
			.pipe( rename( ( filePath )  => {
				filePath.basename += suffix;
			} ) )
			.pipe( gulp.dest( data.output ) )
			.pipe( notify(
				{
					title:'Compress Css Success!',
					message: 'File: <%= file.relative %>'
				}
			) );
	};

// Compress Image
	function compressImage (){
		let imagemin = require( 'gulp-imagemin' );

		return gulp
			.src( imagesSource )
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

// Compress Image
	function cleaner() {
		let clean = require('gulp-clean');

		return gulp
				.src( needDelete )
				.pipe( clean( { force: true } ) )
				.pipe( notify(
					{
						title:'Clear theme done.',
						message:'Delete file: <%= file.relative %>'
					}
				) );
	}

} )()
