import { Router } from 'express';
import authRouter from '../modules/auth/auth.route.js';
import designsRouter from '../modules/designs/design.route.js';
import purchasesRouter from '../modules/purchases/purchase.route.js';
import favoritesRouter from '../modules/favorites/favorite.route.js';
import adminRouter from '../modules/admin/admin.route.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/designs', designsRouter);
router.use('/purchases', purchasesRouter);
router.use('/favorites', favoritesRouter);
router.use('/admin', adminRouter);

export default router;
