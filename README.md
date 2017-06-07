## Haven Engineering Applicant Exercise

### High-level scenario:

![alt text](/images/shipping_definitions.png)

**Goal**: Given a list of port calls (a sample input can be found at `/data/port-calls.json`), generate the list of possible voyages. The goal is to get all tests to pass by running `npm test`

#### Definitions:
- Port Call: A stop along a ship's voyage, including the name/code of the port, the estimated time of arrival (ETA) at the port, and the estimated time of departure (ETD) from the port.
- Voyage: A trip from one port to another, including the ETD from the port of origin, and the ETA at the port of arrival.

### Types of voyages
#### Across the same route
The simplest case of a voyage can be represented with the following:
- Two port calls on the same route (`routeId`)
- Where the two ports are different
- Where the `etd` of the port of origin is before the `eta` of the port of destination
- See the unit tests for an example: [test/voyages.js#L5-L62](https://github.com/HavenInc/janus-exercise/blob/master/test/voyages.js#L5-L62)

#### Across different routes (transhipments)
The more complex case of a transhipment voyage can be represented with the following:
- Two port calls on different routes (different `routeId`)
- Where the two ports are different
- Where the `etd` of the port of origin is before the `eta` of the port of destination
- And the two ports can be connected by another port
- For example, if the USS Harpoon goes from Hong Kong to Singapore, and the USS Starboard goes from Singapore to Oakland, we have a transhipment voyage from Hong Kong to Oakland.
- See the unit tests for an example: [test/voyages.js#L178-L234](https://github.com/HavenInc/janus-exercise/blob/master/test/voyages.js#L178-L234)

#### Things to consider
- You can assume a ship can stay at a port indefinitely before making a transhipment, i.e. if the USS Harpoon goes from Hong Kong and arrives in Singapore on January 1, and the USS Starboard departs from Singapore on February 1 a month later, a transhipment could still be valid.
- A voyage should not include any port more than once, i.e. the following voyage is invalid `HKHKG -> SGSIN -> HKHKG -> USOAK` because it stops in Hong Kong twice.

#### Sample output
Each voyage should contain **at least** the following fields, but feel free to add more:
```
{
  vessels: [String]   // Array since multiple vessels is possible
  routeIds: [Integer] // Array since multiple routes is possible
  origin: String      // e.g. HKHKG
  destination: String // e.g. USOAK
  etd: Date/String    // e.g. 2016-01-01 00:00:00
  eta: Date/String    // e.g. 2016-02-01 00:00:00
  isTranshipment: Boolean
}
```

#### Getting set up:
Make sure you're running Node v6 and then run
```bash
npm install
```
(If you need to upgrade your version of Node, [this tool](https://github.com/tj/n) is handy)

#### To log the output of passing in test data:
```bash
npm start
```

#### To run tests:
```bash
npm test
```
