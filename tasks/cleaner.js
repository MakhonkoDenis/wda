'use strict';

module.exports = function cleaner( files, gulp ) {
	let clean  = require( 'gulp-clean' ),
		notify = require( 'gulp-notify' );

	return gulp
		.src( files )
		.pipe( clean( { force: true } ) )
		.pipe( notify(
			{
				title:'Clear theme done.',
				message:'Delete file: <%= file.relative %>'
			}
		) );
}
