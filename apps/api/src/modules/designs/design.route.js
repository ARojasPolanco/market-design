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
router.get('/my', protect, getMyDesigns);
router.get('/admin/pending', protect, restrictTo('admin'), getPendingDesigns);
router.get('/:id', getDesign);

// Protected routes
router.post('/', protect, restrictTo('seller', 'admin'), createDesign);
router.patch('/:id', protect, restrictTo('seller', 'admin'), updateDesign);
router.delete('/:id', protect, restrictTo('seller', 'admin'), deleteDesign);
router.patch('/:id/approve', protect, restrictTo('admin'), approveDesign);
router.patch('/:id/reject', protect, restrictTo('admin'), rejectDesign);

export default router;
