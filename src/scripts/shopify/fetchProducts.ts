async function fetchProducts() {}

fetchProducts()
  .then(() => process.exit(0))
  .catch((err) => console.error('ERROR!!!', err));
