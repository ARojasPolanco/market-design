import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import sequelize from '../config/database/database.js';
import { runMigrations } from '../config/database/migrator.js';
import { BETA_SLOTS } from '../config/beta.js';

let server;
let adminToken;
let dbAvailable = false;

beforeAll(async () => {
  server = app;

  try {
    await sequelize.authenticate();
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

  // Register an admin and promote it
  const email = `beta_admin_${Date.now()}@test.com`;
  const res = await request(server).post('/api/v1/auth/register').send({
    fullname: 'Beta Admin',
    username: 'betaadmin_' + Date.now(),
    email,
    password: 'password123',
  });
  await sequelize.query(`UPDATE users SET role = 'admin' WHERE users_id = '${res.body.user.id}'`);
  const loginRes = await request(server)
    .post('/api/v1/auth/login')
    .send({ identifier: email, password: 'password123' });
  adminToken = loginRes.body.token;
});

describe('Beta Module', () => {
  describe('GET /api/v1/beta/slots', () => {
    it('returns the three meeting slots without exposing meet links', async () => {
      if (!dbAvailable) return;

      const res = await request(server).get('/api/v1/beta/slots');

      expect(res.status).toBe(200);
      expect(res.body.slots).toHaveLength(BETA_SLOTS.length);
      expect(res.body.slots[0]).toHaveProperty('label');
      expect(res.body.slots[0]).toHaveProperty('remaining');
      expect(JSON.stringify(res.body)).not.toContain('meet.google.com');
    });
  });

  describe('POST /api/v1/beta', () => {
    it('registers a signup', async () => {
      if (!dbAvailable) return;

      const res = await request(server)
        .post('/api/v1/beta')
        .send({
          fullname: 'Vendedora Test',
          email: `vendedora_${Date.now()}@test.com`,
          whatsapp: '+54 9 11 1234-5678',
          slotKey: BETA_SLOTS[0].key,
          utmSource: 'facebook',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
    });

    it('fails with an invalid email', async () => {
      if (!dbAvailable) return;

      const res = await request(server)
        .post('/api/v1/beta')
        .send({ fullname: 'Test', email: 'not-an-email', slotKey: BETA_SLOTS[0].key });

      expect(res.status).toBe(422);
    });

    it('fails with an unknown slot', async () => {
      if (!dbAvailable) return;

      const res = await request(server)
        .post('/api/v1/beta')
        .send({ fullname: 'Test', email: `slot_${Date.now()}@test.com`, slotKey: '1999-01-01' });

      expect(res.status).toBe(422);
    });

    it('lets an existing email change its date', async () => {
      if (!dbAvailable) return;

      const email = `change_${Date.now()}@test.com`;

      await request(server)
        .post('/api/v1/beta')
        .send({ fullname: 'Cambia Fecha', email, slotKey: BETA_SLOTS[0].key });

      const res = await request(server)
        .post('/api/v1/beta')
        .send({ fullname: 'Cambia Fecha', email, slotKey: BETA_SLOTS[1].key });

      expect(res.status).toBe(200);
      expect(res.body.slot.key).toBe(BETA_SLOTS[1].key);
    });
  });

  describe('GET /api/v1/admin/beta', () => {
    it('requires authentication', async () => {
      if (!dbAvailable) return;

      const res = await request(server).get('/api/v1/admin/beta');
      expect(res.status).toBe(401);
    });

    it('returns signups for an admin', async () => {
      if (!dbAvailable || !adminToken) return;

      const res = await request(server)
        .get('/api/v1/admin/beta')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.signups)).toBe(true);
      expect(res.body.slots).toHaveLength(BETA_SLOTS.length);
    });
  });
});
