import { describe, it, expect, beforeAll } from 'vitest';
import { Op } from 'sequelize';
import sequelize from '../config/database/database.js';
import { runMigrations } from '../config/database/migrator.js';
import ErrorLog from '../modules/logs/errorLog.model.js';
import { errorLogService } from '../modules/logs/errorLog.service.js';
import { globalErrorHandler } from '../errors/error.controller.js';
import { AppError } from '../errors/appError.js';

const makeRes = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  return res;
};

const makeReq = () => ({
  method: 'POST',
  originalUrl: '/api/v1/logs-test',
  ip: '1.2.3.4',
  get: () => 'vitest-agent',
  sessionUser: { id: null },
});

const waitForRow = async (message) => {
  for (let i = 0; i < 20; i += 1) {
    const row = await ErrorLog.findOne({ where: { message } });
    if (row) return row;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return null;
};

beforeAll(async () => {
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
});

describe('Error log', () => {
  it('persists an error with context and redacts sensitive data', async () => {
    const marker = `log-service-${Date.now()}`;
    const err = new Error(`Fallo con test@example.com y Bearer abc.def.ghi - ${marker}`);
    err.statusCode = 500;
    err.status = 'error';

    await errorLogService.log(err, makeReq());

    const row = await ErrorLog.findOne({
      where: { message: { [Op.like]: `%${marker}%` } },
      order: [['id', 'DESC']],
    });
    expect(row).not.toBeNull();
    expect(row.path).toBe('/api/v1/logs-test');
    expect(row.method).toBe('POST');
    expect(row.stack).toBeTruthy();
    expect(row.message).not.toContain('test@example.com');
    expect(row.message).toContain('[email]');
    expect(row.message).not.toContain('abc.def.ghi');
  });

  it('global handler persists 5xx errors', async () => {
    const marker = `log-handler-${Date.now()}`;
    const err = new Error(marker);
    err.statusCode = 500;

    const res = makeRes();
    globalErrorHandler(err, makeReq(), res, () => {});

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toContain('error inesperado');

    const row = await waitForRow(marker);
    expect(row).not.toBeNull();
    expect(row.isOperational).toBe(false);
  });

  it('global handler returns operational 4xx without a stack in production mode', () => {
    const res = makeRes();
    globalErrorHandler(new AppError('No encontrado', 404), makeReq(), res, () => {});

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ status: 'fail', message: 'No encontrado' });
    expect(res.body.stack).toBeUndefined();
  });

  it('does not persist expected operational 4xx errors', async () => {
    const before = await ErrorLog.count();

    const res = makeRes();
    globalErrorHandler(new AppError('Email inválido', 422), makeReq(), res, () => {});

    expect(res.statusCode).toBe(422);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const after = await ErrorLog.count();
    expect(after).toBe(before);
  });
});
