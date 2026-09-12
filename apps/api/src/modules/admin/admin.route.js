import { Router } from 'express';
import {
  approveDesign,
  rejectDesign,
  getPendingDesigns,
  getAllConfig,
  updateConfig,
  getReports,
  reviewReport,
  getStats,
  getUsers,
  suspendUser,
  updateUserRank,
  calculateRanks,
} from './admin.controller.js';
import { createReport } from './admin.controller.js';
import { protect, restrictTo } from '../auth/auth.middleware.js';

const router = Router();

// All admin routes require auth + admin role
router.use(protect);

// Reports (any authenticated user can create)
router.post('/reports', createReport);

// Admin only routes
router.use(restrictTo('admin'));

// Moderation
router.get('/designs/pending', getPendingDesigns);
router.patch('/designs/:id/approve', approveDesign);
router.patch('/designs/:id/reject', rejectDesign);

// Config
router.get('/config', getAllConfig);
router.put('/config', updateConfig);

// Reports management
router.get('/reports', getReports);
router.patch('/reports/:id', reviewReport);

// Stats
router.get('/stats', getStats);

// Users
router.get('/users', getUsers);
router.patch('/users/:id/suspend', suspendUser);
router.patch('/users/:id/rank', updateUserRank);

// Rank calculation
router.post('/ranks/calculate', calculateRanks);

export default router;
