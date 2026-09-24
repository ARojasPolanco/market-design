import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead } from './notification.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);

export default router;
