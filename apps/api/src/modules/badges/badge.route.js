import { Router } from 'express';
import {
  calculateRanks,
  calculateBadges,
  getSellerProgress,
  getMyProgress,
} from './badge.controller.js';
import { protect, restrictTo } from '../auth/auth.middleware.js';

const router = Router();

router.use(protect);

// Seller can see their own progress
router.get('/my-progress', getMyProgress);
router.get('/progress/:id', getSellerProgress);

// Admin only
router.post('/calculate-ranks', restrictTo('admin'), calculateRanks);
router.post('/calculate-badges', restrictTo('admin'), calculateBadges);

export default router;
