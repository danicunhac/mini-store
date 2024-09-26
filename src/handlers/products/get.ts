import { fetchProducts } from '../../gateways/product';
import { FastifyHandler, GetProductsResponse } from '../../types';

export const getProducts: FastifyHandler<GetProductsResponse> = async (
  request,
  reply
) => {
  try {
    const products = await fetchProducts();

    return reply.send({ products });
  } catch (err) {
    console.error(err);
    return reply.status(500).send(err);
  }
};
