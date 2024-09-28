import { fetchOrders } from 'gateways/order';
import { fetchProduct } from 'gateways/product';
import { Order } from 'types';

export const getOrders = async () => {
  try {
    const orders = await fetchOrders();

    const ordersWithProducts = await Promise.all(
      orders.map(async (order: Order) => {
        const line_items = await Promise.all(
          order.line_items
            .map(async ({ product_id, ...lineItem }) => {
              const product = await fetchProduct(product_id);

              if (!product) {
                return null;
              }

              return {
                ...lineItem,
                product_id: product.id,
              };
            })
            .filter(Boolean)
        );

        return {
          ...order,
          line_items,
        };
      })
    );

    return ordersWithProducts;
  } catch (err) {
    console.error(err);
    return [];
  }
};
