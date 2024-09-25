import { FastifyHandler, GetOrdersResponse } from '../../types';

export const getOrders: FastifyHandler<GetOrdersResponse> = async (
  request,
  reply
) => {
  return { orders: [] };
};
