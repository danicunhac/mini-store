import 'dotenv/config';
import { Order } from '../../types';
import { supabase } from '../../providers/supabase';

const accessToken = process.env.SHOPIFY_ACCESS_TOKEN as string;
const apiURL = process.env.SHOPIFY_API_URL as string;

const API_VERSION = '2022-04';

async function fetchOrders() {
  const res = await fetch(
    `${apiURL}/admin/api/${API_VERSION}/orders.json?status=any`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    }
  );

  const { orders } = (await res.json()) as {
    orders: Order[];
  };

  const minifiedOrders = orders.map((order) => {
    const lineItems = order.line_items.map((item) => {
      return {
        product_id: item.product_id,
      };
    });

    return {
      created_at: order.created_at,
      platform_id: order.id,
      line_items: lineItems,
    };
  }) as unknown as Order[];

  await Promise.all(
    minifiedOrders.map(async (order) => {
      const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single();

      if (error) {
        return console.error('Error inserting order', error);
      }

      console.log('Order inserted', data);
    })
  );
}

fetchOrders()
  .then(() => process.exit(0))
  .catch((err) => console.error('ERROR!!!', err));
