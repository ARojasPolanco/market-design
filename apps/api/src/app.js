import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { envs } from './config/enviroments.js';
import { AppError, globalErrorHandler } from './errors/index.js';

const app = express();

// Security headers
app.use(helmet());

// Body parser
app.use(express.json());

// CORS
app.use(cors({ origin: envs.CORS_ORIGIN }));

// Rate limiting
const limiter = rateLimit({
  windowMs: envs.RATE_LIMIT_WINDOW_MS,
  max: envs.RATE_LIMIT_MAX,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Healthcheck
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
import router from './routes/routes.js';
app.use('/api/v1', router);

// Catch-all 404
app.all('*', (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
