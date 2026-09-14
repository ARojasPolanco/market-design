import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import sequelize from '../config/database/database.js';
import { runMigrations } from '../config/database/migrator.js';

let server;
let sellerToken;
let adminToken;
let sellerId;
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

describe('Badges Module', () => {
  describe('Setup', () => {
    it('should register a seller', async () => {
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
      sellerId = res.body.user.id;

      // Set role and connect MP
      await sequelize.query(
        `UPDATE users SET role = 'seller', mp_connected = true, email_verified = true WHERE users_id = '${sellerId}'`
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
  });

  describe('GET /api/v1/badges/my-progress', () => {
    it('should return seller progress', async () => {
      if (!dbAvailable || !sellerToken) return;

      const res = await request(server)
        .get('/api/v1/badges/my-progress')
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.progress).toBeDefined();
      expect(res.body.progress.currentRank).toBeDefined();
      expect(res.body.progress.currentCommission).toBeDefined();
      expect(res.body.progress.salesCount).toBeDefined();
      expect(res.body.progress.isVerified).toBeDefined();
    });

    it('should fail without authentication', async () => {
      if (!dbAvailable) return;

      const res = await request(server)
        .get('/api/v1/badges/my-progress');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/badges/progress/:id', () => {
    it('should return seller progress for admin', async () => {
      if (!dbAvailable || !adminToken || !sellerId) return;

      const res = await request(server)
        .get(`/api/v1/badges/progress/${sellerId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.progress).toBeDefined();
      expect(res.body.progress.currentRank).toBe('bronce');
    });

    it('should fail for non-admin viewing other seller', async () => {
      if (!dbAvailable || !sellerToken) return;

      const res = await request(server)
        .get('/api/v1/badges/progress/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/v1/badges/calculate-ranks', () => {
    it('should calculate ranks for admin', async () => {
      if (!dbAvailable || !adminToken) return;

      const res = await request(server)
        .post('/api/v1/badges/calculate-ranks')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.results).toBeDefined();
    });

    it('should fail for non-admin', async () => {
      if (!dbAvailable || !sellerToken) return;

      const res = await request(server)
        .post('/api/v1/badges/calculate-ranks')
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/v1/badges/calculate-badges', () => {
    it('should calculate badges for admin', async () => {
      if (!dbAvailable || !adminToken) return;

      const res = await request(server)
        .post('/api/v1/badges/calculate-badges')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.results).toBeDefined();
    });
  });
});
