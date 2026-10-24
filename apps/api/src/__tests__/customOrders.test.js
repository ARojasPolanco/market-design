import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import sequelize from '../config/database/database.js';
import { runMigrations } from '../config/database/migrator.js';

let server;
let buyerToken;
let sellerToken;
let sellerId;
let orderId;

const register = async (fullname, role) => {
  const email = `${role}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}@test.com`;
  const res = await request(server)
    .post('/api/v1/auth/register')
    .send({
      fullname,
      username: `${role}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      email,
      password: 'password123',
    });
  return { token: res.body.token, id: res.body.user.id };
};

beforeAll(async () => {
  server = app;

  try {
    await sequelize.authenticate();
  } catch (_error) {
    throw new Error(
      'La base de datos de test no está disponible. Levantá PostgreSQL (docker compose up) antes de correr los tests.'
    );
  }

  try {
    await runMigrations();
  } catch (_error) {
    // Migrations might already be applied
  }

  const buyer = await register('Order Buyer', 'orderbuyer');
  buyerToken = buyer.token;

  const seller = await register('Order Seller', 'orderseller');
  sellerToken = seller.token;
  sellerId = seller.id;
  await sequelize.query(`UPDATE users SET role = 'seller' WHERE users_id = '${sellerId}'`);
});

describe('Custom Orders Module', () => {
  it('creates a custom order (requested)', async () => {
    const res = await request(server)
      .post('/api/v1/custom-orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ sellerId, title: 'Cambiar colores', description: 'Quiero otra paleta' });

    expect(res.status).toBe(201);
    expect(res.body.order.status).toBe('requested');
    orderId = res.body.order.id;
  });

  it('does not let a non-seller quote', async () => {
    const res = await request(server)
      .post(`/api/v1/custom-orders/${orderId}/quote`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ price: 1000 });

    expect(res.status).toBe(403);
  });

  it('lets the seller quote the order', async () => {
    const res = await request(server)
      .post(`/api/v1/custom-orders/${orderId}/quote`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ price: 1500 });

    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe('quoted');
    expect(Number(res.body.order.price)).toBe(1500);
  });

  it('lists the order for the buyer', async () => {
    const res = await request(server)
      .get('/api/v1/custom-orders')
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.orders.some((o) => o.id === orderId)).toBe(true);
  });

  it('does not allow paying an order without a quote', async () => {
    const created = await request(server)
      .post('/api/v1/custom-orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        sellerId,
        baseDesignId: '11111111-1111-4111-8111-111111111111',
        title: 'Sin presupuesto',
      });

    const res = await request(server)
      .post(`/api/v1/custom-orders/${created.body.order.id}/pay`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(res.status).toBe(400);
  });
});
