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
  updateDesignPrice,
  updateDesignDescription,
  requestPreviewReplacement,
  approvePreview,
  rejectPreview,
  requestDelete,
  approveDelete,
} from './design.controller.js';
import { protect, restrictTo } from '../auth/auth.middleware.js';
import { uploadDesignFiles } from '../../middlewares/upload.js';

const router = Router();

// Public routes
router.get('/', getAllDesigns);
router.get('/featured', getFeaturedDesigns);
router.get('/trending', getTrendingDesigns);
router.get('/my', protect, getMyDesigns);
router.get('/admin/pending', protect, restrictTo('admin'), getPendingDesigns);
router.get('/:id', getDesign);

// Protected routes
router.post('/', protect, restrictTo('seller', 'admin'), uploadDesignFiles, createDesign);
router.patch('/:id', protect, restrictTo('seller', 'admin'), uploadDesignFiles, updateDesign);
router.patch('/:id/price', protect, restrictTo('seller', 'admin'), updateDesignPrice);
router.patch('/:id/description', protect, restrictTo('seller', 'admin'), updateDesignDescription);
router.patch('/:id/preview', protect, restrictTo('seller', 'admin'), uploadDesignFiles, requestPreviewReplacement);
router.patch('/:id/request-delete', protect, restrictTo('seller', 'admin'), requestDelete);
router.delete('/:id', protect, restrictTo('seller', 'admin'), deleteDesign);
router.patch('/:id/approve', protect, restrictTo('admin'), approveDesign);
router.patch('/:id/reject', protect, restrictTo('admin'), rejectDesign);
router.patch('/:id/approve-preview', protect, restrictTo('admin'), approvePreview);
router.patch('/:id/reject-preview', protect, restrictTo('admin'), rejectPreview);
router.patch('/:id/approve-delete', protect, restrictTo('admin'), approveDelete);

export default router;
