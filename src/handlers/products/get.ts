import { fetchProducts } from 'gateways/product';

export const getProducts = async () => {
  try {
    const products = await fetchProducts();

    return products;
  } catch (err) {
    console.error(err);
    return [];
  }
};
