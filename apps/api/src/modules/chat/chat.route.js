import { Router } from 'express';
import {
  createConversation,
  listConversations,
  getMessages,
  sendMessage,
  markRead,
  reportMessage,
  blockUser,
  unblockUser,
} from './chat.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = Router();

router.use(protect);

router.post('/conversations', createConversation);
router.get('/conversations', listConversations);
router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);
router.patch('/conversations/:id/read', markRead);
router.post('/messages/:id/report', reportMessage);
router.post('/users/:id/block', blockUser);
router.delete('/users/:id/block', unblockUser);

export default router;
