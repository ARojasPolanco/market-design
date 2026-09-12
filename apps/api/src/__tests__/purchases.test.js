import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import sequelize from '../config/database/database.js';
import { runMigrations } from '../config/database/migrator.js';

let server;
let buyerToken;
let sellerToken;
let adminToken;
let designId;
let dbAvailable = false;

beforeAll(async () => {
  server = app;

  try {
    await sequelize.authenticate();
    dbAvailable = true;
  } catch (_error) {
    console.log('Test DB not available');
    return;
  }

  try {
    await runMigrations();
  } catch (_error) {
    // Migrations might already be applied
  }
});

describe('Purchases Module', () => {
  describe('Setup', () => {
    it('should register a buyer', async () => {
      if (!dbAvailable) return;

      const email = `buyer_${Date.now()}@test.com`;
      const res = await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'Buyer Test',
          username: 'buyer_' + Date.now(),
          email,
          password: 'password123',
        });

      expect(res.status).toBe(201);
      buyerToken = res.body.token;
    });

    it('should register a seller with MP connected', async () => {
      if (!dbAvailable) return;

      const email = `seller_${Date.now()}@test.com`;
      const res = await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'Seller Test',
          username: 'seller_' + Date.now(),
          email,
          password: 'password123',
          storeName: 'Test Store',
        });

      expect(res.status).toBe(201);
      sellerToken = res.body.token;

      // Set role and connect MP
      const userId = res.body.user.id;
      await sequelize.query(
        `UPDATE users SET role = 'seller', mp_connected = true, mp_access_token = 'test_token' WHERE users_id = '${userId}'`
      );

      const loginRes = await request(server)
        .post('/api/v1/auth/login')
        .send({ email, password: 'password123' });
      sellerToken = loginRes.body.token;
    });

    it('should register an admin', async () => {
      if (!dbAvailable) return;

      const email = `admin_${Date.now()}@test.com`;
      const res = await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'Admin Test',
          username: 'admin_' + Date.now(),
          email,
          password: 'password123',
        });

      expect(res.status).toBe(201);

      await sequelize.query(
        `UPDATE users SET role = 'admin' WHERE users_id = '${res.body.user.id}'`
      );

      const loginRes = await request(server)
        .post('/api/v1/auth/login')
        .send({ email, password: 'password123' });
      adminToken = loginRes.body.token;
    });

    it('should create and approve a design', async () => {
      if (!dbAvailable) return;

      const res = await request(server)
        .post('/api/v1/designs')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Test Design for Purchase',
          description: 'This is a test design for purchase testing',
          price: 2500,
          category: 'sublimado',
          technique: 'sublimado',
        });

      expect(res.status).toBe(201);
      designId = res.body.design.id;

      // Approve the design
      const approveRes = await request(server)
        .patch(`/api/v1/designs/${designId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(approveRes.status).toBe(200);
      expect(approveRes.body.design.status).toBe('approved');
    });
  });

  describe('POST /api/v1/purchases', () => {
    it('should fail without authentication', async () => {
      if (!dbAvailable) return;

      const res = await request(server)
        .post('/api/v1/purchases')
        .send({ designId });

      expect(res.status).toBe(401);
    });

    it('should fail with invalid design ID', async () => {
      if (!dbAvailable || !buyerToken) return;

      const res = await request(server)
        .post('/api/v1/purchases')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ designId: 'invalid-uuid' });

      expect(res.status).toBe(422);
    });

    it('should fail for non-existent design', async () => {
      if (!dbAvailable || !buyerToken) return;

      const res = await request(server)
        .post('/api/v1/purchases')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ designId: '00000000-0000-0000-0000-000000000000' });

      expect(res.status).toBe(404);
    });

    it('should create a purchase', async () => {
      if (!dbAvailable || !buyerToken || !designId) return;

      const res = await request(server)
        .post('/api/v1/purchases')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ designId });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.purchase).toBeDefined();
      expect(res.body.purchase.price).toBe('2500.00');
    });

    it('should fail duplicate purchase', async () => {
      if (!dbAvailable || !buyerToken || !designId) return;

      const res = await request(server)
        .post('/api/v1/purchases')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ designId });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/purchases/my', () => {
    it('should return buyer purchases', async () => {
      if (!dbAvailable || !buyerToken) return;

      const res = await request(server)
        .get('/api/v1/purchases/my')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.purchases).toBeDefined();
    });

    it('should fail without authentication', async () => {
      if (!dbAvailable) return;

      const res = await request(server)
        .get('/api/v1/purchases/my');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/purchases/ratings', () => {
    it('should fail without purchase', async () => {
      if (!dbAvailable || !buyerToken || !designId) return;

      const res = await request(server)
        .post('/api/v1/purchases/ratings')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          designId,
          purchaseId: '00000000-0000-0000-0000-000000000000',
          score: 5,
          comment: 'Great design!',
        });

      expect(res.status).toBe(404);
    });

    it('should fail with invalid score', async () => {
      if (!dbAvailable || !buyerToken) return;

      const res = await request(server)
        .post('/api/v1/purchases/ratings')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          designId: '00000000-0000-0000-0000-000000000000',
          purchaseId: '00000000-0000-0000-0000-000000000000',
          score: 6,
        });

      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/v1/purchases/ratings/:designId', () => {
    it('should return ratings for a design', async () => {
      if (!dbAvailable || !designId) return;

      const res = await request(server)
        .get(`/api/v1/purchases/ratings/${designId}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.ratings).toBeDefined();
    });
  });

  describe('GET /api/v1/purchases/download/:token', () => {
    it('should fail with invalid token', async () => {
      if (!dbAvailable) return;

      const res = await request(server)
        .get('/api/v1/purchases/download/invalid-token');

      expect(res.status).toBe(400);
    });
  });
});
