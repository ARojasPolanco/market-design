import { Router } from 'express';
import { getSlots, createSignup } from './beta.controller.js';

const router = Router();

router.get('/slots', getSlots);
router.post('/', createSignup);

export default router;
