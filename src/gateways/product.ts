import { supabase } from 'providers/supabase';
import { Product } from 'types';

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select();

  if (error) {
    console.error(`Error fetching products: ${error}`);
    throw error;
  }

  return data;
};

export const fetchProduct = async (
  product_id: string | null
): Promise<Product | null> => {
  if (!product_id) {
    return null;
  }

  const { data, error } = await supabase
    .from('products')
    .select()
    .eq('platform_id', product_id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching product ${product_id}: ${error}`);
    throw error;
  }

  return data;
};
