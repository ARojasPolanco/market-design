import { Router } from 'express';
import { getConnectUrl, handleCallback } from './mp.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = Router();

router.get('/connect', protect, getConnectUrl);
router.get('/callback', handleCallback);

export default router;
