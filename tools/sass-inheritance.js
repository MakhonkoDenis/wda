'use strict';
let filesSistem = null;

module.exports = function sassInheritance( path, file, scssSource ) {
	let sassGraph = require( 'sass-graph' ),
		files = ( filesSistem ) ? filesSistem : sassGraph.parseDir( path, { extensions: [ 'scss' ] } ),
		key, importedBy;

	for ( key in files.index ) {
		file = file.replace( /\/|\\/g, '\/' );
		key = key.replace( /\/|\\/g, '\/' );

		if ( file !== key ){
			continue;
		}

		importedBy = files.index[key].importedBy;
		if ( 0 !== importedBy.length ) {
			return sassInheritance( path, importedBy[0], scssSource );
		} else {
			let data = { input: file };

			for ( let files of scssSource ) {
				let sourceFiles = path + files.input;

				sourceFiles = sourceFiles.replace( /\/|\\/g, '\/' );

				if ( sourceFiles === file ) {
					data.output = files.output;
					data.ignor  = ( files["ignor-input"] ) ? files["ignor-input"] : [];
					data.compress = files.compress;

					break;
				}
			}

			return data;
		}
	}
}
