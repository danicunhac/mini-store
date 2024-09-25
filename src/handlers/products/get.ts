import { FastifyHandler, GetProductsResponse, Product } from '../../types';

export const getProducts: FastifyHandler<GetProductsResponse> = async (
  request,
  reply
) => {
  return { products: [] };
};
