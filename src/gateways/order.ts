import { supabase } from 'providers/supabase';
import { Order } from 'types';

export const fetchOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase.from('orders').select();

  if (error) {
    console.error(`Error fetching orders: ${error}`);
    throw error;
  }

  return data;
};
