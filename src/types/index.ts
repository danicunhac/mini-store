import { FastifyReply, FastifyRequest } from 'fastify';
import { Tables } from '../../database.types';

export type FastifyHandler<T> = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<T>;

export type Product = Tables<'products'>;
export type Order = Tables<'orders'> & {
  line_items: {
    product_id: string | null;
  }[];
};

export type GetProductsResponse = {
  products: Product[];
};

export type GetOrdersResponse = {
  orders: Order[];
};
