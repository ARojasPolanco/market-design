import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { envs } from '../../config/enviroments.js';
import { getSlots, createSignup } from './beta.controller.js';

const router = Router();

// Tighter limit for the public signup endpoint (per IP) to curb bots.
const betaSignupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: envs.NODE_ENV === 'production' ? 10 : 1000,
  message: 'Demasiadas solicitudes. Por favor, intentá de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/slots', getSlots);
router.post('/', betaSignupLimiter, createSignup);

export default router;
