import 'dotenv/config';
import { Product } from 'types';
import { supabase } from 'providers/supabase';
import extractNextUrl from 'utils/extractNextUrl';

const accessToken = process.env.SHOPIFY_ACCESS_TOKEN as string;
const apiURL = process.env.SHOPIFY_API_URL as string;

const API_VERSION = '2022-04';

type ShopifyProduct = {
  id: string;
  title: string;
};

async function fetchProducts() {
  let allProducts: ShopifyProduct[] = [];
  let nextPageUrl:
    | string
    | null = `${apiURL}/admin/api/${API_VERSION}/products.json?limit=50`;

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

      const { products } = (await res.json()) as {
        products: ShopifyProduct[];
      };

      allProducts = allProducts.concat(products);

      const link = res.headers.get('Link') as string | null;
      nextPageUrl = link ? extractNextUrl(link) : null;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  const minifiedProducts = allProducts.map((product) => {
    return {
      platform_id: product.id,
      name: product.title,
    };
  }) as Product[];

  await Promise.all(
    minifiedProducts.map(async (product) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) {
        return console.error('Error inserting product', error);
      }

      console.log('Product inserted', data);
    })
  );
}

fetchProducts()
  .then(() => process.exit(0))
  .catch((err) => console.error('ERROR!!!', err));
