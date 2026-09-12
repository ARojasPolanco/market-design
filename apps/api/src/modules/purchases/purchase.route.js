import { Router } from 'express';
import {
  createPurchase,
  handleWebhook,
  verifyPayment,
  getMyPurchases,
  downloadDesign,
  reDownload,
  createRating,
  getDesignRatings,
} from './purchase.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = Router();

// Public routes
router.post('/webhook', handleWebhook);
router.get('/download/:token', downloadDesign);
router.get('/ratings/:designId', getDesignRatings);

// Protected routes
router.post('/', protect, createPurchase);
router.get('/my', protect, getMyPurchases);
router.get('/:id/verify', protect, verifyPayment);
router.post('/:id/redownload', protect, reDownload);
router.post('/ratings', protect, createRating);

export default router;
