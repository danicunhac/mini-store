import { fetchOrders } from '../../gateways/order';
import { fetchProduct } from '../../gateways/product';
import { FastifyHandler, GetOrdersResponse, Order } from '../../types';

export const getOrders: FastifyHandler<GetOrdersResponse> = async (
  request,
  reply
) => {
  try {
    const orders = await fetchOrders();

    const ordersWithProducts = await Promise.all(
      orders.map(async (order: Order) => {
        const line_items = await Promise.all(
          order.line_items.map(async ({ product_id, ...lineItem }) => {
            const product = await fetchProduct(product_id);

            return {
              ...lineItem,
              product_id: product ? product.id : null,
            };
          })
        );

        return {
          ...order,
          line_items,
        };
      })
    );

    return reply.send({ orders: ordersWithProducts });
  } catch (err) {
    console.error(err);
    return reply.status(500).send(err);
  }
};
