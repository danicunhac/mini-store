import 'dotenv/config';
import { Order } from 'types';
import { supabase } from 'providers/supabase';
import extractNextUrl from 'utils/extractNextUrl';

const accessToken = process.env.SHOPIFY_ACCESS_TOKEN as string;
const apiURL = process.env.SHOPIFY_API_URL as string;

const API_VERSION = '2022-04';

type ShopifyOrder = {
  id: string;
  created_at: string;
  line_items: {
    product_id: string;
  }[];
};

async function fetchOrders() {
  let allOrders: ShopifyOrder[] = [];
  let nextPageUrl:
    | string
    | null = `${apiURL}/admin/api/${API_VERSION}/orders.json?status=any`;

  try {
    while (nextPageUrl) {
      const res = await fetch(nextPageUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const { orders } = (await res.json()) as {
        orders: ShopifyOrder[];
      };

      allOrders = allOrders.concat(orders);

      console.log('res.headers', res.headers);

      const link = res.headers.get('link') as string | null;
      nextPageUrl = link ? extractNextUrl(link) : null;
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
  }

  const minifiedOrders = allOrders.map((order) => {
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
  }) as Order[];

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

      // console.log('Order inserted', data);
    })
  );
}

fetchOrders()
  .then(() => process.exit(0))
  .catch((err) => console.error('ERROR!!!', err));
