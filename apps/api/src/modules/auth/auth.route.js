import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail,
} from './auth.controller.js';
import { protect } from './auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);

export default router;
