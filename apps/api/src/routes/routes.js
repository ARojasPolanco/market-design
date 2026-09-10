import { Router } from 'express';
import authRouter from '../modules/auth/auth.route.js';
import designsRouter from '../modules/designs/design.route.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/designs', designsRouter);

export default router;
