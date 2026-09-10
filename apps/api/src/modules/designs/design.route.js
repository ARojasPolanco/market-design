import { Router } from 'express';
import {
  getAllDesigns,
  getDesign,
  createDesign,
  updateDesign,
  deleteDesign,
  approveDesign,
  rejectDesign,
  getPendingDesigns,
  getFeaturedDesigns,
  getTrendingDesigns,
  getMyDesigns,
} from './design.controller.js';
import { protect, restrictTo } from '../auth/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getAllDesigns);
router.get('/featured', getFeaturedDesigns);
router.get('/trending', getTrendingDesigns);

// Protected routes
router.use(protect);

router.get('/my', getMyDesigns);
router.post('/', restrictTo('seller', 'admin'), createDesign);
router.get('/:id', getDesign);
router.patch('/:id', restrictTo('seller', 'admin'), updateDesign);
router.delete('/:id', restrictTo('seller', 'admin'), deleteDesign);

// Admin only
router.get('/admin/pending', restrictTo('admin'), getPendingDesigns);
router.patch('/:id/approve', restrictTo('admin'), approveDesign);
router.patch('/:id/reject', restrictTo('admin'), rejectDesign);

export default router;
