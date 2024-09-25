import { FastifyReply, FastifyRequest } from 'fastify';

export type FastifyHandler<T> = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<T>;

export type Product = {
  id: string; // A unique ID for this product
  platform_id: string; // The Shopify ID of the product
  name: string; // The Shopify name of the product
};

export type Order = {
  id: string; // A unique ID for this order
  platform_id: string; // The Shopify ID of the order
  line_items: [
    {
      product_id: string | null; // An ID referencing the unique ID you used to store Shopify products. If the product does not exist in your database, return null
    }
  ];
};

export type GetProductsResponse = {
  products: Product[];
};

export type GetOrdersResponse = {
  orders: Order[];
};
