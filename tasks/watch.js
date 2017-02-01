'use strict';

module.exports = ( config, gulp ) => {
	let browserSync = require( 'browser-sync' ).create(),
		source      = config.source,
		path        = config.projectPath;

	browserSync.init( {
		files: config.projectPath + source.php[0].input,
		open: ( config.browser.open ) ? config.domen : false ,
		proxy: config.domen,
		online: true,
		browser: config.browser.apps
	} );

	for ( let type in source ) {

		if ( -1 === type.search( /(js|css|scss)/g ) ) {
			continue;
		}

		for ( let file in source[ type ] ) {
			let fileSettings = source[ type ][ file ];

			gulp
				.watch(
					config.projectPath + fileSettings.input,
					() => {}
				)
				.on( 'change', ( event ) => {
					let input  = event.path.replace( /\\/g, '/' );

					if ( -1 !== input.search( /(\.min|\/min)/gi ) ) {
						return false;
					}

					let regexp = /[^(\\|\/)]*([a-zA-Z]+$)/gi,
						output = fileSettings.output,
						ignor  =  ( fileSettings["ignor-input"] ) ? fileSettings["ignor-input"] : [],
						compress   = fileSettings.compress,
						data   = null,
						callback;

					switch( type ) {
						case 'css':
							callback = require( './compress-css' );
						break;
						case 'js':
							callback = require( './compress-js' );
						break;
						case 'scss':
							let sassInheritance = require( '../tools/sass-inheritance' ),
								inheritance = sassInheritance( config.projectPath, input, source.scss );

							input    = inheritance.input;

							if ( inheritance.output ) {
								output = inheritance.output
							}

							if ( inheritance.ignor ) {
								ignor = inheritance.ignor
							}

							if ( inheritance.compress ) {
								compress = inheritance.compress
							}

							callback = require( './compile-scss' );
						break;
					}

					ignor = ignor.map( function( file ) {
						return file.replace( '!', '!' + config.projectPath )
					});

					data = {
						input: [ ...ignor, input ],
						changedFile: input,
						output: input.replace( regexp, output ),
						compress: compress
					}

					callback( data, browserSync.reload, gulp );
				});
		}
	}
}
