const SECTION = {
    NODE_COORD_SECTION: "NODE_COORD_SECTION",
    DEMAND_SECTION: "DEMAND_SECTION",
    DEPOT_SECTION: "DEPOT_SECTION",
}

module.exports = ( file, hooks ) => {
    if ( Buffer.isBuffer( file ) ) file = file.toString();
    const lines = file.split( /\r?\n/ );
    const instance = {};
    const coords = {};
    const demand = {};
    const depots = [];
    let lastDataSection = null;
    lines.forEach( line => {
        line = line.trim();
        if ( line.includes( "EOF" ) || line == "" ) return;
        if ( line.includes( SECTION.NODE_COORD_SECTION ) ) {
            lastDataSection = SECTION.NODE_COORD_SECTION;
        } else if ( line.includes( SECTION.DEMAND_SECTION ) ) {
            lastDataSection = SECTION.DEMAND_SECTION;
        } else if ( line.includes( SECTION.DEPOT_SECTION ) ) {
            lastDataSection = SECTION.DEPOT_SECTION
        } else {
            if ( !lastDataSection ) {
                const [ field, ...values ] = line.split( ":" );
                if ( hooks && hooks[ field.trim() ] ) {
                    const customEvaluation = hooks[ field.trim() ]( values.join( ':' ).trim() );
                    Object.keys( customEvaluation ).forEach( key => instance[ key ] = customEvaluation[ key ] );
                } else {
                    let v = values.join( ':' ).trim();
                    if ( !isNaN( v ) ) v = Number( v );
                    instance[ field.trim() ] = v;
                }
            } else {
                const values = line.split( " " );
                if ( lastDataSection === SECTION.NODE_COORD_SECTION ) {
                    coords[ values[ 0 ] ] = {
                        x: Number( values[ 1 ] ),
                        y: Number( values[ 2 ] )
                    };
                } else if ( lastDataSection === SECTION.DEMAND_SECTION ) {
                    demand[ values[ 0 ] ] = Number( values[ 1 ] );
                } else if ( lastDataSection === SECTION.DEPOT_SECTION ) {
                    if ( values[ 0 ] === "-1" ) lastDataSection = null;
                    else( depots.push( Number( values[ 0 ] ) ) );
                }
            }
        }
    } );
    return { ...instance,
        coords,
        demand,
        depots
    }
}