# VRPtoJSON

This module parses .vrp files to .json. For a specification see [this site](http://neo.lcc.uma.es/vrp/vrp-instances/capacitated-vrp-instances/). The parser has only been validated against the `Augerat et al.` instances.

## Usage
The function accepts either a string or a buffer as the first parameter, and a dictionary of hooks as the second parameter.

```js
const fs = require( 'fs' );
const parseVRP = require( 'vrptojson' );
const file = fs.readFileSync( '../instances/A-VRP/A-n32-k5.vrp' );
const instance = parseVRP( file );
```

Example Input:
```
NAME : ABC-123
COMMENT : (Test et al, Optimal value: 100)
TYPE : CVRP
DIMENSION : 5
EDGE_WEIGHT_TYPE : EUC_2D 
CAPACITY : 100
NODE_COORD_SECTION 
 1 10 10
 2 0 0
 3 20 20
 4 20 0
 5 0 20
DEMAND_SECTION 
1 0 
2 10 
3 10 
4 10 
5 10 
DEPOT_SECTION 
 1  
 -1  
EOF 
```

Example output:
```json
{ NAME: 'ABC-123',
  COMMENT: '(Test et al, Optimal value: 100)',
  TYPE: 'CVRP',
  DIMENSION: 5,
  EDGE_WEIGHT_TYPE: 'EUC_2D',
  CAPACITY: 100,
  coords:
   { '1': { x: 10, y: 10 },
     '2': { x: 0, y: 0 },
     '3': { x: 20, y: 20 },
     '4': { x: 20, y: 0 },
     '5': { x: 0, y: 20 } },
  demand: { '1': 0, '2': 10, '3': 10, '4': 10, '5': 10 },
  depots: [ 1 ] }
```


## Hooks
Each key value pair in the specification part can be parsed with custom functions.

Example: 
```js
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
const instance = parseVRP( file, hooks );
```
This codes parses the "COMMENT" value and reads the best-known / optimum value. You have to return an dictionary of key value pairs that will be included in the final result.

New output
```json
{ NAME: 'ABC-123',
  BEST_KNOWN: 100,
  TYPE: 'CVRP',
  DIMENSION: 5,
  EDGE_WEIGHT_TYPE: 'EUC_2D',
  CAPACITY: 100,
  coords:
   { '1': { x: 10, y: 10 },
     '2': { x: 0, y: 0 },
     '3': { x: 20, y: 20 },
     '4': { x: 20, y: 0 },
     '5': { x: 0, y: 20 } },
  demand: { '1': 0, '2': 10, '3': 10, '4': 10, '5': 10 },
  depots: [ 1 ] }
```
Notice that "COMMENT" is not included, because it was no returned by the hook function.