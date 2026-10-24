import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import sequelize from '../config/database/database.js';
import { runMigrations } from '../config/database/migrator.js';

let server;
let buyerToken;
let sellerToken;
let sellerId;
let adminToken;
let conversationId;
let supportConversationId;

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
  return { token: res.body.token, id: res.body.user.id, email };
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

  const buyer = await register('Chat Buyer', 'chatbuyer');
  buyerToken = buyer.token;

  const seller = await register('Chat Seller', 'chatseller');
  sellerToken = seller.token;
  sellerId = seller.id;
  await sequelize.query(`UPDATE users SET role = 'seller' WHERE users_id = '${sellerId}'`);

  const admin = await register('Chat Admin', 'chatadmin');
  adminToken = admin.token;
  await sequelize.query(`UPDATE users SET role = 'admin' WHERE users_id = '${admin.id}'`);
});

describe('Chat Module', () => {
  it('creates a conversation between buyer and seller', async () => {
    const res = await request(server)
      .post('/api/v1/chat/conversations')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ sellerId });

    expect(res.status).toBe(201);
    expect(res.body.conversation.id).toBeDefined();
    conversationId = res.body.conversation.id;
  });

  it('sends a message', async () => {
    const res = await request(server)
      .post(`/api/v1/chat/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ body: 'Hola, me interesa una modificación.' });

    expect(res.status).toBe(201);
    expect(res.body.message.body).toContain('modificación');
  });

  it('lets the seller list the conversation and read messages', async () => {
    const list = await request(server)
      .get('/api/v1/chat/conversations')
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(list.status).toBe(200);
    expect(list.body.conversations.some((c) => c.id === conversationId)).toBe(true);

    const messages = await request(server)
      .get(`/api/v1/chat/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(messages.status).toBe(200);
    expect(messages.body.messages.length).toBeGreaterThan(0);
  });

  it('blocks access to non-participants', async () => {
    const outsider = await register('Outsider', 'chatoutsider');

    const res = await request(server)
      .get(`/api/v1/chat/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${outsider.token}`);

    expect(res.status).toBe(403);
  });

  it('keeps an empty message from being sent', async () => {
    const res = await request(server)
      .post(`/api/v1/chat/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ body: '   ' });

    expect(res.status).toBe(422);
  });

  it('creates a support conversation', async () => {
    const res = await request(server)
      .post('/api/v1/chat/conversations')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ type: 'support' });

    expect(res.status).toBe(200);
    expect(res.body.conversation.type).toBe('support');
    supportConversationId = res.body.conversation.id;
  });

  it('notifies the seller when the buyer sends a message', async () => {
    const res = await request(server)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(res.status).toBe(200);
    expect(
      res.body.notifications.some(
        (notification) =>
          notification.conversationId === conversationId && notification.type === 'message'
      )
    ).toBe(true);
  });

  it('notifies admins when a user writes to support', async () => {
    await request(server)
      .post(`/api/v1/chat/conversations/${supportConversationId}/messages`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ body: 'Hola soporte, tengo una consulta.' });

    const res = await request(server)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(
      res.body.notifications.some(
        (notification) =>
          notification.conversationId === supportConversationId && notification.type === 'message'
      )
    ).toBe(true);
  });

  it('lets an admin audit conversations and messages', async () => {
    const list = await request(server)
      .get('/api/v1/admin/chat/conversations')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(list.status).toBe(200);

    const messages = await request(server)
      .get(`/api/v1/admin/chat/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(messages.status).toBe(200);
    expect(messages.body.messages.length).toBeGreaterThan(0);
  });
});
