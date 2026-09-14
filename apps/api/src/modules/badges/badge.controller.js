import { badgeService } from './badge.service.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';

export const calculateRanks = catchAsync(async (req, res) => {
  const results = await badgeService.calculateRanks();
  const changed = results.filter((r) => r.changed);

  res.status(200).json({
    status: 'success',
    message: `${changed.length} vendedor(es) subieron de nivel.`,
    results: changed,
  });
});

export const calculateBadges = catchAsync(async (req, res) => {
  const results = await badgeService.calculateBadges();

  res.status(200).json({
    status: 'success',
    message: `${results.length} vendedor(es) actualizados.`,
    results,
  });
});

export const getSellerProgress = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Sellers can only see their own progress, admins can see any
  if (req.sessionUser.role !== 'admin' && req.sessionUser.id !== id) {
    return next(new AppError('No tenés permiso para ver este progreso.', 403));
  }

  const progress = await badgeService.getSellerProgress(id);
  if (!progress) {
    return next(new AppError('Vendedor no encontrado.', 404));
  }

  res.status(200).json({
    status: 'success',
    progress,
  });
});

export const getMyProgress = catchAsync(async (req, res) => {
  const progress = await badgeService.getSellerProgress(req.sessionUser.id);

  res.status(200).json({
    status: 'success',
    progress,
  });
});
