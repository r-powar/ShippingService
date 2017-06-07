const assert = require('chai').assert;
const { generateVoyages } = require('../main');

describe('Voyages', () => {
  it('should generate voyages for one route', () => {
    const calls = [
      {
        id: 1,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'HKHKG',
        eta: null,
        etd: '2016-01-03 00:00:00'
      },
      {
        id: 2,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'SGSIN',
        eta: '2016-01-06 00:00:00',
        etd: '2016-01-09 00:00:00'
      },
      {
        id: 3,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'USLAX',
        eta: '2016-01-12 00:00:00',
        etd: null
      }
    ];

    const voyages = generateVoyages(calls)
      .map(voyage => {
        const { origin, destination, etd, eta } = voyage;

        return { origin, destination, etd, eta };
      });

    const expected = [
      {
        origin: 'HKHKG',
        destination: 'SGSIN',
        etd: '2016-01-03 00:00:00',
        eta: '2016-01-06 00:00:00'
      },
      {
        origin: 'HKHKG',
        destination: 'USLAX',
        etd: '2016-01-03 00:00:00',
        eta: '2016-01-12 00:00:00'
      },
      {
        origin: 'SGSIN',
        destination: 'USLAX',
        etd: '2016-01-09 00:00:00',
        eta: '2016-01-12 00:00:00'
      }
    ];

    assert.deepEqual(voyages, expected);
  });

  it('should generate voyages for multiple routes', () => {
    const calls = [
      {
        id: 1,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'HKHKG',
        eta: null,
        etd: '2016-01-03 00:00:00'
      },
      {
        id: 2,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'SGSIN',
        eta: '2016-01-06 00:00:00',
        etd: '2016-01-09 00:00:00'
      },
      {
        id: 3,
        vessel: 'USS Starboard',
        routeId: 2,
        port: 'USLAX',
        eta: '2016-01-12 00:00:00',
        etd: '2016-01-14 00:00:00'
      },
      {
        id: 4,
        vessel: 'USS Starboard',
        routeId: 2,
        port: 'USOAK',
        eta: '2016-01-18 00:00:00',
        etd: null
      }
    ];

    const voyages = generateVoyages(calls)
      .map(voyage => {
        const { origin, destination, etd, eta } = voyage;

        return { origin, destination, etd, eta };
      });

    const expected = [
      {
        origin: 'HKHKG',
        destination: 'SGSIN',
        etd: '2016-01-03 00:00:00',
        eta: '2016-01-06 00:00:00'
      },
      {
        origin: 'USLAX',
        destination: 'USOAK',
        etd: '2016-01-14 00:00:00',
        eta: '2016-01-18 00:00:00'
      }
    ];

    assert.deepEqual(voyages, expected);
  });

  it('should not loop to same port', () => {
    const calls = [
      {
        id: 1,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'HKHKG',
        eta: null,
        etd: '2016-01-03 00:00:00'
      },
      {
        id: 2,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'SGSIN',
        eta: '2016-01-06 00:00:00',
        etd: '2016-01-09 00:00:00'
      },
      {
        id: 3,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'HKHKG',
        eta: '2016-01-12 00:00:00',
        etd: null
      }
    ];

    const voyages = generateVoyages(calls)
      .map(voyage => {
        const { origin, destination, etd, eta } = voyage;

        return { origin, destination, etd, eta };
      });

    const expected = [
      {
        origin: 'HKHKG',
        destination: 'SGSIN',
        etd: '2016-01-03 00:00:00',
        eta: '2016-01-06 00:00:00'
      },
      {
        origin: 'SGSIN',
        destination: 'HKHKG',
        etd: '2016-01-09 00:00:00',
        eta: '2016-01-12 00:00:00'
      }
    ];

    assert.deepEqual(voyages, expected);
  });

  it('should generate transhipment across one route', () => {
    const calls = [
      {
        id: 1,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'HKHKG',
        eta: null,
        etd: '2016-01-03 00:00:00'
      },
      {
        id: 2,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'SGSIN',
        eta: '2016-01-06 00:00:00',
        etd: '2016-01-09 00:00:00'
      },
      {
        id: 3,
        vessel: 'USS Starboard',
        routeId: 2,
        port: 'SGSIN',
        eta: '2016-01-12 00:00:00',
        etd: '2016-01-14 00:00:00'
      },
      {
        id: 4,
        vessel: 'USS Starboard',
        routeId: 2,
        port: 'USOAK',
        eta: '2016-01-18 00:00:00',
        etd: null
      }
    ];

    const voyages = generateVoyages(calls)
      .filter(voyage => voyage.isTranshipment)
      .map(voyage => {
        const { vessels, routeIds, origin, destination, etd, eta } = voyage;

        return { vessels, routeIds, origin, destination, etd, eta };
      });

    const transhipment = [
      { // USS Harpoon -> USS Starboard
        vessels: ['USS Harpoon', 'USS Starboard'],
        routeIds: [1, 2],
        origin: 'HKHKG',
        destination: 'USOAK',
        etd: '2016-01-03 00:00:00',
        eta: '2016-01-18 00:00:00'
      }
    ];

    assert.deepEqual(voyages, transhipment);
  });

  it('should generate transhipment across multiple routes', () => {
    const calls = [
      {
        id: 1,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'HKHKG',
        eta: null,
        etd: '2016-01-03 00:00:00'
      },
      {
        id: 2,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'SGSIN',
        eta: '2016-01-06 00:00:00',
        etd: '2016-01-09 00:00:00'
      },
      {
        id: 3,
        vessel: 'USS Starboard',
        routeId: 2,
        port: 'SGSIN',
        eta: '2016-01-12 00:00:00',
        etd: '2016-01-14 00:00:00'
      },
      {
        id: 4,
        vessel: 'USS Starboard',
        routeId: 2,
        port: 'USOAK',
        eta: '2016-01-18 00:00:00',
        etd: null
      },
      {
        id: 5,
        vessel: 'HMS Port',
        routeId: 3,
        port: 'USOAK',
        eta: '2016-01-21 00:00:00',
        etd: '2016-01-23 00:00:00'
      },
      {
        id: 6,
        vessel: 'HMS Port',
        routeId: 3,
        port: 'USLAX',
        eta: '2016-01-28 00:00:00',
        etd: null
      }
    ];

    const voyages = generateVoyages(calls)
      .filter(voyage => voyage.isTranshipment)
      .map(voyage => {
        const { vessels, routeIds, origin, destination, etd, eta } = voyage;

        return { vessels, routeIds, origin, destination, etd, eta };
      });

    const transhipments = [
      { // USS Harpoon -> USS Starboard
        vessels: ['USS Harpoon', 'USS Starboard'],
        routeIds: [1, 2],
        origin: 'HKHKG',
        destination: 'USOAK',
        etd: '2016-01-03 00:00:00',
        eta: '2016-01-18 00:00:00'
      },
      { // USS Harpoon -> USS Starboard -> HMS Port
        vessels: ['USS Harpoon', 'USS Starboard', 'HMS Port'],
        routeIds: [1, 2, 3],
        origin: 'HKHKG',
        destination: 'USLAX',
        etd: '2016-01-03 00:00:00',
        eta: '2016-01-28 00:00:00'
      },
      { // USS Starboard -> HMS Port
        vessels: ['USS Starboard', 'HMS Port'],
        routeIds: [2, 3],
        origin: 'SGSIN',
        destination: 'USLAX',
        etd: '2016-01-14 00:00:00',
        eta: '2016-01-28 00:00:00'
      }
    ];

    assert.deepEqual(voyages, transhipments);
  });

  it('should not hit the same port twice in a transhipment', () => {
    const calls = [
      {
        id: 1,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'HKHKG',
        eta: null,
        etd: '2016-01-03 00:00:00'
      },
      {
        id: 2,
        vessel: 'USS Harpoon',
        routeId: 1,
        port: 'SGSIN',
        eta: '2016-01-06 00:00:00',
        etd: '2016-01-09 00:00:00'
      },
      {
        id: 3,
        vessel: 'USS Starboard',
        routeId: 2,
        port: 'SGSIN',
        eta: '2016-01-12 00:00:00',
        etd: '2016-01-14 00:00:00'
      },
      {
        id: 4,
        vessel: 'USS Starboard',
        routeId: 2,
        port: 'HKHKG',
        eta: '2016-01-18 00:00:00',
        etd: '2016-01-19 00:00:00'
      },
      {
        id: 5,
        vessel: 'USS Starboard',
        routeId: 2,
        port: 'CNSHA',
        eta: '2016-01-25 00:00:00',
        etd: null
      }
    ];

    const voyages = generateVoyages(calls)
      .filter(voyage => voyage.isTranshipment)
      .map(voyage => {
        const { origin, destination, etd, eta } = voyage;

        return { origin, destination, etd, eta };
      });

    const expected = []; // no transhipments

    assert.deepEqual(voyages, expected);
  });
});
