import { Router } from 'express';
import {
  createOrder,
  quoteOrder,
  payOrder,
  deliverOrder,
  listMyOrders,
  getOrder,
  downloadOrder,
  downloadOrderByToken,
} from './customOrder.controller.js';
import { protect } from '../auth/auth.middleware.js';
import { uploadSingle } from '../../middlewares/upload.js';

const router = Router();

// Public: download link sent by email (token based).
router.get('/download/:token', downloadOrderByToken);

router.use(protect);

router.post('/', createOrder);
router.get('/', listMyOrders);
router.get('/:id', getOrder);
router.post('/:id/quote', quoteOrder);
router.post('/:id/pay', payOrder);
router.post('/:id/deliver', uploadSingle, deliverOrder);
router.get('/:id/download', downloadOrder);

export default router;
