const fs = require( 'fs' );
const vtj = require( './index' );

const file = fs.readFileSync( './test.vrp' );
const hooks = {
    COMMENT: function ( value ) {
        const words = value.split( " " );
        const idx = words.findIndex( x => x == "value:" );
        let best = words[ idx + 1 ];
        best = best.substring( 0, best.length - 1 );
        return {
            BEST_KNOWN: Number( best )
        }
    }
}
const instance = vtj( file, hooks );
console.log( instance );