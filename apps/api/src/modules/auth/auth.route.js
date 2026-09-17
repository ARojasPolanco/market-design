import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  getPublicProfile,
  updateProfile,
  changePassword,
  verifyEmail,
  activateSeller,
  uploadAvatar,
} from './auth.controller.js';
import { protect } from './auth.middleware.js';
import { uploadSingle } from '../../middlewares/upload.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.get('/profile/:id', getPublicProfile);

// Protected routes
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);
router.post('/activate-seller', protect, activateSeller);
router.post('/upload-avatar', protect, uploadSingle, uploadAvatar);

export default router;
