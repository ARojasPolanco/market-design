import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { envs } from './config/enviroments.js';
import { AppError, globalErrorHandler } from './errors/index.js';
import sequelize from './config/database/database.js';

const app = express();

// Security headers
app.use(helmet());

// Body parser
app.use(express.json());

// CORS
app.use(cors({ origin: envs.CORS_ORIGIN }));

// Rate limiting - more lenient for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: envs.NODE_ENV === 'development' ? 1000 : 100,
  message: 'Demasiados intentos de inicio de sesión. Por favor, esperá 15 minutos e intentá de nuevo.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: envs.RATE_LIMIT_WINDOW_MS,
  max: envs.NODE_ENV === 'development' ? 1000 : envs.RATE_LIMIT_MAX,
  message: 'Demasiadas solicitudes. Por favor, intentá de nuevo más tarde.',
});

app.use('/api/v1/auth', authLimiter);
app.use('/api', apiLimiter);

// Healthcheck
app.get('/health', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (_error) {
    res.status(503).json({ status: 'error', database: 'disconnected', timestamp: new Date().toISOString() });
  }
});

// Routes
import router from './routes/routes.js';
app.use('/api/v1', router);

// Catch-all 404
app.all('*', (req, _res, next) => {
  next(new AppError(`No se encontró la ruta ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
