#VRP Instances
This module parses .vrp instances in .json format and returns a custom format with distance matrix. Only euclidian distance is available. The module also has a list of CVRP Instances: Set A and B from [Augerat et al.](http://neo.lcc.uma.es/vrp/vrp-instances/capacitated-vrp-instances/).

## Usage
You can use [vrptojson](https://www.npmjs.com/package/vrptojson) to parse .vrp files.
```js
const vrp = require("vrpInstances");
const instance = vrp.parse(vrpFileInJs);
```

Example output for the test instance file in [vrptojson](https://www.npmjs.com/package/vrptojson)
```json
{ best: 100,
  n: 5,
  distances:
   { '1':
      { '1': 0,
        '2': 14.142135623730951,
        '3': 14.142135623730951,
        '4': 14.142135623730951,
        '5': 14.142135623730951 },
     '2':
      { '1': 14.142135623730951,
        '2': 0,
        '3': 28.284271247461902,
        '4': 20,
        '5': 20 },
     '3':
      { '1': 14.142135623730951,
        '2': 28.284271247461902,
        '3': 0,
        '4': 20,
        '5': 20 },
     '4':
      { '1': 14.142135623730951,
        '2': 20,
        '3': 20,
        '4': 0,
        '5': 28.284271247461902 },
     '5':
      { '1': 14.142135623730951,
        '2': 20,
        '3': 20,
        '4': 28.284271247461902,
        '5': 0 } },
  demand: { '1': 0, '2': 10, '3': 10, '4': 10, '5': 10 },
  coords: ...,
  c: 100,
  depot: 1 }
```

You can also get instances of the Augerat et al. A and B set directly with 
```js
const instance = vrp.get('A-n32-k5');
```

You can use `vrp.listInstances()` to see a list of all available instances.