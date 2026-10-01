import { achievementService } from './achievement.service.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getCatalog = catchAsync(async (_req, res) => {
  const achievements = await achievementService.getCatalog();
  res.status(200).json({ status: 'success', achievements });
});

export const getUserAchievements = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  if (!uuidRegex.test(userId)) {
    return next(new AppError('ID de usuario inválido.', 400));
  }
  const achievements = await achievementService.getUserAchievements(userId);
  res.status(200).json({ status: 'success', achievements });
});

export const grantAchievement = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { achievementId } = req.body;

  if (!achievementId) {
    return next(new AppError('Tenés que indicar el logro a otorgar.', 422));
  }

  const catalog = await achievementService.getCatalog();
  const target = catalog.find((a) => a.id === achievementId);
  if (!target) {
    return next(new AppError('Logro inválido.', 404));
  }
  if (target.type !== 'manual') {
    return next(new AppError('Ese logro se otorga automáticamente.', 422));
  }

  const result = await achievementService.grant(id, achievementId, req.sessionUser.id);
  const achievements = await achievementService.getUserAchievements(id);
  res.status(200).json({ status: 'success', granted: result.granted, achievements });
});

export const revokeAchievement = catchAsync(async (req, res, next) => {
  const { id, achievementId } = req.params;
  const catalog = await achievementService.getCatalog();
  const target = catalog.find((a) => a.id === achievementId);
  if (!target) {
    return next(new AppError('Logro inválido.', 404));
  }
  if (target.type !== 'manual') {
    return next(new AppError('Ese logro se otorga automáticamente.', 422));
  }

  await achievementService.revoke(id, achievementId);
  const achievements = await achievementService.getUserAchievements(id);
  res.status(200).json({ status: 'success', achievements });
});

export const recalculateUserAchievements = catchAsync(async (req, res) => {
  const granted = await achievementService.evaluateAutomatic(req.params.id);
  const achievements = await achievementService.getUserAchievements(req.params.id);
  res.status(200).json({ status: 'success', granted, achievements });
});

export const recalculateAllAchievements = catchAsync(async (_req, res) => {
  const summary = await achievementService.recalculateAll();
  res.status(200).json({ status: 'success', summary });
});
