import fastify from 'fastify';
import { getOrders, getProducts } from 'handlers';

export const app = fastify();

app.get('/', () => {
  return { status: 'ok' };
});

app.get('/products', async (_request, reply) => {
  try {
    const products = await getProducts();
    return reply.send(products);
  } catch (err) {
    console.error(err);
    return reply.status(500).send(err);
  }
});

app.get('/orders', async (_request, reply) => {
  try {
    const orders = await getOrders();
    return reply.send(orders);
  } catch (err) {
    console.error(err);
    return reply.status(500).send(err);
  }
});
