import { Router } from 'express';
import { getCatalog, getUserAchievements } from './achievement.controller.js';

const router = Router();

router.get('/', getCatalog);
router.get('/user/:userId', getUserAchievements);

export default router;
