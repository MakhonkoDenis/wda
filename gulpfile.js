( () => {
	'use strict';

	const gulp       = require( 'gulp' ),
		plumber      = require( 'gulp-plumber' ),
		notify       = require('gulp-notify'),
		rename       = require( 'gulp-rename' ),
		browserSync  = require('browser-sync').create();

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
		},
		browserSyncInit = ( data ) => {
			browserSync.init({
				files: data.projectPath + '**/*.php',
				open: ( data.browser.open ) ? data.domen : false ,
				host: data.domen,
				proxy: data.domen,
				online: true,
				browser: data.browser.apps
			});
		};

/**
* Set project
* gulp use-in --path your_project_path
**/
	gulp
		.task( 'use-in', ( done ) => {
			let yargs          = require( 'yargs' ),
				jeditor        = require( 'gulp-json-editor' ),
				messageText;

			return gulp
				.src( configPath )
				.pipe( jeditor( function( json ) {

					if ( yargs.argv.path ) {
						let path = ( yargs.argv.path + '/' ).replace( /\\|\/\/$/g, '/' );

						json.projectPath = path;
						messageText      = `URL: ${ path }`;
					}

					if ( yargs.argv.domen ) {
						let domen = ( yargs.argv.domen + '/' ).replace( /\\|\/\/$/g, '/' );

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
		} )
// Watch files
		.task( 'watch', () => {
			let source = config.source,
				regexp = /[^(\\|\/)]*([a-zA-Z]+$)/gi,
				path = config.projectPath,
				serverReload = browserSync.reload;

			browserSyncInit( config );

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

						fileData.taskFunction( data, serverReload );
					} )
			};

		} )
		.task( 'compress-image', compressImage )
		.task( 'clean', cleaner );

// Compile Scss
	function compileScss( data, server ){
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
			.pipe( server( {stream: true} ) )
			.pipe( notify(
				{
					title:'Compile SASS Success!',
					message: 'File: <%= file.relative %>'
				}
			) );
	}

// Compress Image
	function compressJs ( data, server ){
		let uglify = require( 'gulp-uglify' ),
			suffix = ( true === data.compress ) ? '.min' : '';

						;
		return gulp
			.src( data.input )
			.pipe( plumber() )
			.pipe( uglify() )
			.pipe( rename( ( filePath )  => {
				filePath.basename += suffix;
			} ) )
			.pipe( gulp.dest( data.output ) )
			.pipe( server( {stream: true} ) )
			.pipe( notify(
				{
					title:'Compress Java Script Success!',
					message: 'File: <%= file.relative %>'
				}
			) );
	}

// Compress Image
	function compressCss( data, server ){
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
			.pipe( server( {stream: true} ) )
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
