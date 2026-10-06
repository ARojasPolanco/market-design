import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import app from '../app.js';
import sequelize from '../config/database/database.js';
import { runMigrations } from '../config/database/migrator.js';
import User from '../modules/auth/auth.model.js';

let server;
let authToken;
let userId;
let dbAvailable = false;

beforeAll(async () => {
  server = app;

  try {
    await sequelize.authenticate();
    console.log('Test DB connected');
    dbAvailable = true;
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
});

describe('Auth Module', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      if (!dbAvailable) return;
      const res = await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'Test User',
          username: 'testuser_' + Date.now(),
          email: `test_${Date.now()}@example.com`,
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toContain('@example.com');

      authToken = res.body.token;
      userId = res.body.user.id;
    });

    it('should fail with duplicate email', async () => {
      const email = `duplicate_${Date.now()}@example.com`;

      // First registration
      await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'User One',
          username: 'userone_' + Date.now(),
          email,
          password: 'password123',
        });

      // Duplicate registration
      const res = await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'User Two',
          username: 'usertwo_' + Date.now(),
          email,
          password: 'password123',
        });

      expect(res.status).toBe(400);
    });

    it('should fail with invalid email', async () => {
      const res = await request(server).post('/api/v1/auth/register').send({
        fullname: 'Test User',
        username: 'testuser_invalid',
        email: 'not-an-email',
        password: 'password123',
      });

      expect(res.status).toBe(422);
    });

    it('should fail with short password', async () => {
      const res = await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'Test User',
          username: 'testuser_short',
          email: `test_short_${Date.now()}@example.com`,
          password: '123',
        });

      expect(res.status).toBe(422);
    });

    it('should fail with missing required fields', async () => {
      const res = await request(server)
        .post('/api/v1/auth/register')
        .send({
          email: `test_missing_${Date.now()}@example.com`,
        });

      expect(res.status).toBe(422);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const email = `login_${Date.now()}@example.com`;
      const password = 'password123';

      // Register first
      await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'Login User',
          username: 'loginuser_' + Date.now(),
          email,
          password,
        });

      // Login
      const res = await request(server)
        .post('/api/v1/auth/login')
        .send({ identifier: email, password });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
    });

    it('should fail with wrong password', async () => {
      const email = `wrongpass_${Date.now()}@example.com`;

      await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'Wrong Pass User',
          username: 'wrongpass_' + Date.now(),
          email,
          password: 'correctpassword',
        });

      const res = await request(server)
        .post('/api/v1/auth/login')
        .send({ identifier: email, password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('should login successfully with username', async () => {
      const email = `byname_${Date.now()}@example.com`;
      const username = 'byname_' + Date.now();
      const password = 'password123';

      await request(server)
        .post('/api/v1/auth/register')
        .send({ fullname: 'By Name User', username, email, password });

      const res = await request(server)
        .post('/api/v1/auth/login')
        .send({ identifier: username, password });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.username).toBe(username);
    });

    it('should fail with non-existent email', async () => {
      const res = await request(server).post('/api/v1/auth/login').send({
        identifier: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/auth/profile', () => {
    it('should get profile with valid token', async () => {
      if (!authToken) {
        console.log('No auth token available, skipping');
        return;
      }

      const res = await request(server)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.user).toBeDefined();
      expect(res.body.user.id).toBe(userId);
    });

    it('should fail without token', async () => {
      const res = await request(server).get('/api/v1/auth/profile');

      expect(res.status).toBe(401);
    });

    it('should fail with invalid token', async () => {
      const res = await request(server)
        .get('/api/v1/auth/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/auth/profile', () => {
    it('should update profile successfully', async () => {
      if (!authToken) {
        console.log('No auth token available, skipping');
        return;
      }

      const res = await request(server)
        .patch('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          storeName: 'Mi Tienda Test',
          description: 'Descripción de prueba',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.user.storeName).toBe('Mi Tienda Test');
    });
  });

  describe('PATCH /api/v1/auth/change-password', () => {
    it('should change password successfully', async () => {
      const email = `changepass_${Date.now()}@example.com`;
      const password = 'oldpassword123';

      // Register
      const regRes = await request(server)
        .post('/api/v1/auth/register')
        .send({
          fullname: 'Change Pass User',
          username: 'changepass_' + Date.now(),
          email,
          password,
        });

      const token = regRes.body.token;

      // Change password
      const res = await request(server)
        .patch('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: password,
          newPassword: 'newpassword123',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');

      // Login with new password
      const loginRes = await request(server)
        .post('/api/v1/auth/login')
        .send({ identifier: email, password: 'newpassword123' });

      expect(loginRes.status).toBe(200);
    });

    it('should fail with wrong current password', async () => {
      if (!authToken) {
        console.log('No auth token available, skipping');
        return;
      }

      const res = await request(server)
        .patch('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(server).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});

describe('Password reset', () => {
  it('POST /forgot-password always responds 200 (no user enumeration)', async () => {
    const res = await request(server)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'does-not-exist@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });

  it('resets the password with a valid token and allows login', async () => {
    const email = `reset_${Date.now()}@example.com`;
    const password = 'password123';

    await request(server)
      .post('/api/v1/auth/register')
      .send({ fullname: 'Reset User', username: 'reset_' + Date.now(), email, password });

    const user = await User.findOne({ where: { email } });
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    await user.update({
      passwordResetToken: tokenHash,
      passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000),
    });

    const res = await request(server)
      .post('/api/v1/auth/reset-password')
      .send({ token: rawToken, password: 'brandnewpass123' });

    expect(res.status).toBe(200);

    const loginRes = await request(server)
      .post('/api/v1/auth/login')
      .send({ identifier: email, password: 'brandnewpass123' });

    expect(loginRes.status).toBe(200);

    const oldLogin = await request(server)
      .post('/api/v1/auth/login')
      .send({ identifier: email, password });

    expect(oldLogin.status).toBe(401);
  });

  it('rejects an invalid token', async () => {
    const res = await request(server)
      .post('/api/v1/auth/reset-password')
      .send({ token: 'invalid-token', password: 'brandnewpass123' });

    expect(res.status).toBe(400);
  });

  it('rejects an expired token', async () => {
    const email = `expired_${Date.now()}@example.com`;

    await request(server)
      .post('/api/v1/auth/register')
      .send({
        fullname: 'Expired User',
        username: 'expired_' + Date.now(),
        email,
        password: 'password123',
      });

    const user = await User.findOne({ where: { email } });
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    await user.update({
      passwordResetToken: tokenHash,
      passwordResetExpires: new Date(Date.now() - 1000),
    });

    const res = await request(server)
      .post('/api/v1/auth/reset-password')
      .send({ token: rawToken, password: 'brandnewpass123' });

    expect(res.status).toBe(400);
  });
});
