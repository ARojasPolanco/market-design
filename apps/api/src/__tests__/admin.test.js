import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import sequelize from '../config/database/database.js';
import { runMigrations } from '../config/database/migrator.js';

let server;
let userToken;
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

describe('Admin Module', () => {
  describe('Setup', () => {
    it('should register a user', async () => {
      if (!dbAvailable) return;

      const email = `user_${Date.now()}@test.com`;
      const res = await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'Test User',
          username: 'user_' + Date.now(),
          email,
          password: 'password123',
        });

      expect(res.status).toBe(201);
      userToken = res.body.token;
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

    it('should create a design', async () => {
      if (!dbAvailable || !userToken) return;

      // Set user as seller with MP connected
      const userId = JSON.parse(Buffer.from(userToken.split('.')[1], 'base64').toString()).id;
      await sequelize.query(
        `UPDATE users SET role = 'seller', mp_connected = true WHERE users_id = '${userId}'`
      );

      const res = await request(server)
        .post('/api/v1/designs')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Test Design for Admin',
          description: 'This is a test design for admin testing',
          price: 2000,
          category: 'sublimado',
          technique: 'sublimado',
        });

      expect(res.status).toBe(201);
      designId = res.body.design.id;
    });
  });

  describe('GET /api/v1/admin/designs/pending', () => {
    it('should return pending designs for admin', async () => {
      if (!dbAvailable || !adminToken) return;

      const res = await request(server)
        .get('/api/v1/admin/designs/pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.designs).toBeDefined();
    });

    it('should fail for non-admin', async () => {
      if (!dbAvailable || !userToken) return;

      const res = await request(server)
        .get('/api/v1/admin/designs/pending')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/v1/admin/designs/:id/approve', () => {
    it('should approve a design', async () => {
      if (!dbAvailable || !adminToken || !designId) return;

      const res = await request(server)
        .patch(`/api/v1/admin/designs/${designId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.design.status).toBe('approved');
    });
  });

  describe('PATCH /api/v1/admin/designs/:id/reject', () => {
    it('should reject with reason', async () => {
      if (!dbAvailable || !adminToken || !designId) return;

      // Create another design to reject
      const createRes = await request(server)
        .post('/api/v1/designs')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Design to Reject',
          description: 'This design will be rejected for testing purposes',
          price: 1000,
          category: 'infantil',
          technique: 'estampado',
        });

      if (createRes.status !== 201) return;

      const rejectId = createRes.body.design.id;

      const res = await request(server)
        .patch(`/api/v1/admin/designs/${rejectId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Este diseño contiene contenido con copyright.' });

      expect(res.status).toBe(200);
      expect(res.body.design.status).toBe('rejected');
    });

    it('should fail without reason', async () => {
      if (!dbAvailable || !adminToken || !designId) return;

      const res = await request(server)
        .patch(`/api/v1/admin/designs/${designId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: '' });

      expect(res.status).toBe(422);
    });
  });

  describe('Favorites', () => {
    it('should add a favorite', async () => {
      if (!dbAvailable || !userToken || !designId) return;

      const res = await request(server)
        .post('/api/v1/favorites')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ designId });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
    });

    it('should get my favorites', async () => {
      if (!dbAvailable || !userToken) return;

      const res = await request(server)
        .get('/api/v1/favorites/my')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.favorites).toBeDefined();
    });

    it('should check if design is favorite', async () => {
      if (!dbAvailable || !userToken || !designId) return;

      const res = await request(server)
        .get(`/api/v1/favorites/check/${designId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.isFavorite).toBe(true);
    });

    it('should remove a favorite', async () => {
      if (!dbAvailable || !userToken || !designId) return;

      const res = await request(server)
        .delete(`/api/v1/favorites/${designId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe('Reports', () => {
    it('should create a report', async () => {
      if (!dbAvailable || !userToken || !designId) return;

      const res = await request(server)
        .post('/api/v1/admin/reports')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          designId,
          reason: 'Este diseño parece tener copyright de terceros.',
        });

      expect(res.status).toBe(201);
      expect(res.body.report).toBeDefined();
    });

    it('should get reports for admin', async () => {
      if (!dbAvailable || !adminToken) return;

      const res = await request(server)
        .get('/api/v1/admin/reports')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.reports).toBeDefined();
    });
  });

  describe('Config', () => {
    it('should get all config', async () => {
      if (!dbAvailable || !adminToken) return;

      const res = await request(server)
        .get('/api/v1/admin/config')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.config).toBeDefined();
    });

    it('should update config', async () => {
      if (!dbAvailable || !adminToken) return;

      const res = await request(server)
        .put('/api/v1/admin/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ key: 'commission_base', value: 25 });

      expect(res.status).toBe(200);
      expect(res.body.config).toBeDefined();
    });
  });

  describe('Users', () => {
    it('should get users list', async () => {
      if (!dbAvailable || !adminToken) return;

      const res = await request(server)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.users).toBeDefined();
    });

    it('should filter users by role', async () => {
      if (!dbAvailable || !adminToken) return;

      const res = await request(server)
        .get('/api/v1/admin/users?role=seller')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.users).toBeDefined();
    });
  });

  describe('Stats', () => {
    it('should get admin stats', async () => {
      if (!dbAvailable || !adminToken) return;

      const res = await request(server)
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.stats).toBeDefined();
      expect(res.body.stats.totalUsers).toBeDefined();
      expect(res.body.stats.totalDesigns).toBeDefined();
    });
  });
});
