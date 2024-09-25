import fastify from 'fastify';
import { getOrders, getProducts } from './handlers';

export const app = fastify();

app.get('/', () => {
  return { status: 'ok' };
});

app.get('/products', getProducts);

app.get('/orders', getOrders);
