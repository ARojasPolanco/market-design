import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import sequelize from '../config/database/database.js';
import { runMigrations } from '../config/database/migrator.js';

let server;
let sellerToken;
let sellerId;
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

describe('Designs Module', () => {
  describe('Setup: Register users', () => {
    it('should register a seller', async () => {
      if (!dbAvailable) return;
      const email = `seller_${Date.now()}@test.com`;
      const username = 'seller_' + Date.now();

      const res = await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'Seller Test',
          username,
          email,
          password: 'password123',
          storeName: 'Test Store',
        });

      expect(res.status).toBe(201);
      sellerToken = res.body.token;
      sellerId = res.body.user.id;

      // Set role to seller and connect MP
      await sequelize.query(
        `UPDATE users SET role = 'seller', mp_connected = true, mp_access_token = 'test_token' WHERE users_id = '${sellerId}'`
      );

      // Re-login to get token with correct role
      const loginRes = await request(server)
        .post('/api/v1/auth/login')
        .send({ email, password: 'password123' });

      sellerToken = loginRes.body.token;
    });

    it('should register an admin', async () => {
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

      // Set role to admin
      await sequelize.query(
        `UPDATE users SET role = 'admin' WHERE users_id = '${res.body.user.id}'`
      );

      // Login with admin role
      const loginRes = await request(server)
        .post('/api/v1/auth/login')
        .send({ email, password: 'password123' });

      adminToken = loginRes.body.token;
    });
  });

  describe('GET /api/v1/designs', () => {
    it('should return list of designs', async () => {
      const res = await request(server)
        .get('/api/v1/designs');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.designs).toBeDefined();
      expect(res.body.total).toBeGreaterThanOrEqual(0);
    });

    it('should filter by category', async () => {
      const res = await request(server)
        .get('/api/v1/designs?category=sublimado');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('should filter by price range', async () => {
      const res = await request(server)
        .get('/api/v1/designs?priceMin=100&priceMax=5000');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('should sort by popular', async () => {
      const res = await request(server)
        .get('/api/v1/designs?sort=popular');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('should search by text', async () => {
      const res = await request(server)
        .get('/api/v1/designs?search=test');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });

  describe('GET /api/v1/designs/featured', () => {
    it('should return featured designs', async () => {
      const res = await request(server)
        .get('/api/v1/designs/featured');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.designs).toBeDefined();
    });
  });

  describe('GET /api/v1/designs/trending', () => {
    it('should return trending designs', async () => {
      const res = await request(server)
        .get('/api/v1/designs/trending');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.designs).toBeDefined();
    });
  });

  describe('POST /api/v1/designs', () => {
    it('should fail without authentication', async () => {
      const res = await request(server)
        .post('/api/v1/designs')
        .send({
          title: 'Test Design',
          description: 'This is a test design description',
          price: 2500,
          category: 'sublimado',
          technique: 'sublimado',
        });

      expect(res.status).toBe(401);
    });

    it('should fail with invalid category', async () => {
      if (!sellerToken) return;

      const res = await request(server)
        .post('/api/v1/designs')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Test Design',
          description: 'This is a test design description',
          price: 2500,
          category: 'invalid_category',
          technique: 'sublimado',
        });

      expect(res.status).toBe(422);
    });

    it('should fail with short title', async () => {
      if (!sellerToken) return;

      const res = await request(server)
        .post('/api/v1/designs')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'ab',
          description: 'This is a test design description',
          price: 2500,
          category: 'sublimado',
          technique: 'sublimado',
        });

      expect(res.status).toBe(422);
    });

    it('should fail with negative price', async () => {
      if (!sellerToken) return;

      const res = await request(server)
        .post('/api/v1/designs')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Test Design',
          description: 'This is a test design description',
          price: -100,
          category: 'sublimado',
          technique: 'sublimado',
        });

      expect(res.status).toBe(422);
    });

    it('should create design successfully', async () => {
      if (!sellerToken) return;

      const res = await request(server)
        .post('/api/v1/designs')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Test Design',
          description: 'This is a test design description for sublimation',
          price: 2500,
          category: 'sublimado',
          technique: 'sublimado',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.design).toBeDefined();
      expect(res.body.design.title).toBe('Test Design');
      expect(res.body.design.status).toBe('pending');

      designId = res.body.design.id;
    });
  });

  describe('GET /api/v1/designs/:id', () => {
    it('should return 404 for non-existent design', async () => {
      const res = await request(server)
        .get('/api/v1/designs/00000000-0000-0000-0000-000000000000');

      expect(res.status).toBe(404);
    });

    it('should return design by id', async () => {
      if (!designId) return;

      const res = await request(server)
        .get(`/api/v1/designs/${designId}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.design).toBeDefined();
      expect(res.body.design.id).toBe(designId);
    });
  });

  describe('PATCH /api/v1/designs/:id', () => {
    it('should update design title', async () => {
      if (!designId || !sellerToken) return;

      const res = await request(server)
        .patch(`/api/v1/designs/${designId}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Updated Design Title',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.design.title).toBe('Updated Design Title');
    });

    it('should fail to update other seller design', async () => {
      if (!designId) return;

      // Register another seller
      const email = `other_${Date.now()}@test.com`;
      const regRes = await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'Other Seller',
          username: 'other_' + Date.now(),
          email,
          password: 'password123',
        });

      const otherToken = regRes.body.token;

      const updateRes = await request(server)
        .patch(`/api/v1/designs/${designId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          title: 'Hacked Title',
        });

      expect(updateRes.status).toBe(403);
    });
  });

  describe('Admin endpoints', () => {
    it('should get pending designs', async () => {
      if (!adminToken) return;

      const res = await request(server)
        .get('/api/v1/designs/admin/pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.designs).toBeDefined();
    });

    it('should fail to get pending designs without admin role', async () => {
      if (!sellerToken) return;

      const res = await request(server)
        .get('/api/v1/designs/admin/pending')
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(403);
    });

    it('should approve a design', async () => {
      if (!designId || !adminToken) return;

      const res = await request(server)
        .patch(`/api/v1/designs/${designId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.design.status).toBe('approved');
    });

    it('should reject a design with reason', async () => {
      if (!sellerToken || !adminToken) return;

      // Create a new design to reject
      const createRes = await request(server)
        .post('/api/v1/designs')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({
          title: 'Design to Reject',
          description: 'This design will be rejected for testing',
          price: 1000,
          category: 'infantil',
          technique: 'estampado',
        });

      if (createRes.status !== 201) return;

      const rejectId = createRes.body.design.id;

      const res = await request(server)
        .patch(`/api/v1/designs/${rejectId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          reason: 'Este diseño contiene contenido con copyright.',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.design.status).toBe('rejected');
      expect(res.body.design.rejectionReason).toBe('Este diseño contiene contenido con copyright.');
    });

    it('should fail to reject without reason', async () => {
      if (!adminToken) return;

      const res = await request(server)
        .patch(`/api/v1/designs/${designId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          reason: '',
        });

      expect(res.status).toBe(422);
    });
  });

  describe('GET /api/v1/designs/my', () => {
    it('should return seller designs', async () => {
      if (!sellerToken) return;

      const res = await request(server)
        .get('/api/v1/designs/my')
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.designs).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const res = await request(server)
        .get('/api/v1/designs/my');

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/designs/:id', () => {
    it('should soft delete a design', async () => {
      if (!designId || !sellerToken) return;

      const res = await request(server)
        .delete(`/api/v1/designs/${designId}`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');

      // Verify it's deleted
      const getRes = await request(server)
        .get(`/api/v1/designs/${designId}`);

      expect(getRes.status).toBe(404);
    });
  });
});
