import { Router } from 'express';
import authRouter from '../modules/auth/auth.route.js';
import designsRouter from '../modules/designs/design.route.js';
import purchasesRouter from '../modules/purchases/purchase.route.js';
import favoritesRouter from '../modules/favorites/favorite.route.js';
import adminRouter from '../modules/admin/admin.route.js';
import badgesRouter from '../modules/badges/badge.route.js';
import notificationsRouter from '../modules/notifications/notification.route.js';
import achievementsRouter from '../modules/achievements/achievement.route.js';
import mpRouter from '../modules/mercadopago/mp.route.js';
import betaRouter from '../modules/beta/beta.route.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/designs', designsRouter);
router.use('/purchases', purchasesRouter);
router.use('/favorites', favoritesRouter);
router.use('/admin', adminRouter);
router.use('/badges', badgesRouter);
router.use('/notifications', notificationsRouter);
router.use('/achievements', achievementsRouter);
router.use('/mp', mpRouter);
router.use('/beta', betaRouter);

export default router;
