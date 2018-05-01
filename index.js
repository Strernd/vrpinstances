const fs = require( "fs" );
const vrptojson = require( "vrptojson" );

function parse( instance ) {
    if ( !instance.coords || !instance.demand || !instance.depots || !instance.EDGE_WEIGHT_TYPE || !instance.CAPACITY ) throw "Illegal instance argument";
    if ( instance.EDGE_WEIGHT_TYPE != 'EUC_2D' ) throw "Parser does not support this Edge Weight Type";
    const distances = {}; // distanceMatrix
    Object.keys( instance.coords ).forEach( c => distances[ c ] = {} );
    Object.keys( instance.coords ).forEach( ai => {
        let a = instance.coords[ ai ];
        Object.keys( instance.coords ).forEach( bi => {
            let b = instance.coords[ bi ];
            distances[ ai ][ bi ] = dist( a, b );
        } );
    } );

    const returnedInstance = {};
    if ( instance.BEST_KNOWN ) returnedInstance.best = instance.BEST_KNOWN;
    returnedInstance.n = instance.DIMENSION;
    returnedInstance.distances = distances;
    returnedInstance.demand = instance.demand;
    returnedInstance.c = instance.CAPACITY;
    returnedInstance.depot = instance.depots[ 0 ];
    returnedInstance.coords = instance.coords;
    return returnedInstance;
}

function dist( a, b ) {
    return Math.sqrt( Math.pow( a.x - b.x, 2 ) + Math.pow( a.y - b.y, 2 ) );
}

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

function get( name ) {
    const dir = __dirname + "/instances/";
    const files = fs.readdirSync( dir );
    if ( files.indexOf( name + ".vrp" ) >= 0 ) {
        const file = fs.readFileSync( dir + name + '.vrp' );
        const json = vrptojson( file, hooks );
        return parse( json );
    } else {
        throw "Instance not in library"
    }
}

function listInstances() {
    const dir = __dirname + "/instances/";
    const files = fs.readdirSync( dir );
    return files.map( x => x.split( "." )[ 0 ] );
}

module.exports = {
    parse,
    get,
    listInstances
}