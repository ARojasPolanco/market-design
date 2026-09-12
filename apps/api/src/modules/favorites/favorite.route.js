import { Router } from 'express';
import { addFavorite, removeFavorite, getMyFavorites, checkFavorite } from './favorite.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/my', getMyFavorites);
router.get('/check/:designId', checkFavorite);
router.post('/', addFavorite);
router.delete('/:designId', removeFavorite);

export default router;
