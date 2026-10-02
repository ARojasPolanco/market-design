import { Router } from 'express';
import {
  createPurchase,
  handleWebhook,
  verifyPayment,
  getMyPurchases,
  getMySales,
  downloadDesign,
  reDownload,
  createRating,
  getDesignRatings,
  replyToRating,
  deleteRatingReply,
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
router.get('/my/sales', protect, getMySales);
router.get('/:id/verify', protect, verifyPayment);
router.post('/:id/redownload', protect, reDownload);
router.post('/ratings', protect, createRating);
router.post('/ratings/:id/reply', protect, replyToRating);
router.delete('/ratings/:id/reply', protect, deleteRatingReply);

export default router;
