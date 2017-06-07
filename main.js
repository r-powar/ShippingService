const { calls } = require('./data/port-calls.json');

// TODO: implement this function
const generateVoyages = (calls) => {
  return calls;
};

// Log results if running directly
if (require.main === module) {
  const voyages = generateVoyages(calls);

  console.log(voyages);
}

// Otherwise just export the `generateVoyages` function
module.exports = { generateVoyages };
