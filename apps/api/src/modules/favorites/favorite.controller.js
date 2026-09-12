import { favoriteService } from './favorite.service.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';

export const addFavorite = catchAsync(async (req, res, next) => {
  const { designId } = req.body;

  if (!designId) {
    return next(new AppError('El ID del diseño es requerido.', 422));
  }

  const favorite = await favoriteService.add(req.sessionUser.id, designId);

  res.status(201).json({
    status: 'success',
    favorite,
  });
});

export const removeFavorite = catchAsync(async (req, res, next) => {
  const { designId } = req.params;

  const result = await favoriteService.remove(req.sessionUser.id, designId);
  if (!result) {
    return next(new AppError('Favorito no encontrado.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Favorito eliminado.',
  });
});

export const getMyFavorites = catchAsync(async (req, res) => {
  const favorites = await favoriteService.findByUser(req.sessionUser.id);

  res.status(200).json({
    status: 'success',
    favorites,
  });
});

export const checkFavorite = catchAsync(async (req, res) => {
  const { designId } = req.params;
  const isFav = await favoriteService.isFavorite(req.sessionUser.id, designId);

  res.status(200).json({
    status: 'success',
    isFavorite: isFav,
  });
});
