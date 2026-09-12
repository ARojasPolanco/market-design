import { adminService } from './admin.service.js';
import { designService } from '../designs/design.service.js';
import { mailService } from '../../config/resend/resend.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';

// Moderation
export const approveDesign = catchAsync(async (req, res, next) => {
  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (design.status !== 'pending') {
    return next(new AppError('Este diseño no está pendiente de aprobación.', 400));
  }

  const approved = await adminService.approveDesign(req.params.id, req.sessionUser.id);

  // Send email to seller
  try {
    const seller = design.seller;
    if (seller?.email) {
      await mailService.sendDesignApproved(seller.email, design.title);
    }
  } catch (mailError) {
    console.error('Error sending approval email:', mailError);
  }

  res.status(200).json({
    status: 'success',
    design: approved,
  });
});

export const rejectDesign = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  if (!reason || reason.trim().length < 10) {
    return next(new AppError('El motivo del rechazo debe tener al menos 10 caracteres.', 422));
  }

  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (design.status !== 'pending') {
    return next(new AppError('Este diseño no está pendiente de aprobación.', 400));
  }

  const rejected = await adminService.rejectDesign(req.params.id, req.sessionUser.id, reason);

  // Send email to seller
  try {
    const seller = design.seller;
    if (seller?.email) {
      await mailService.sendDesignRejected(seller.email, design.title, reason);
    }
  } catch (mailError) {
    console.error('Error sending rejection email:', mailError);
  }

  res.status(200).json({
    status: 'success',
    design: rejected,
  });
});

export const getPendingDesigns = catchAsync(async (req, res) => {
  const designs = await adminService.getPendingDesigns();
  res.status(200).json({ status: 'success', designs });
});

// Config
export const getAllConfig = catchAsync(async (req, res) => {
  const config = await adminService.getAllConfig();
  res.status(200).json({ status: 'success', config });
});

export const updateConfig = catchAsync(async (req, res) => {
  const { key, value } = req.body;

  if (!key) {
    return res.status(422).json({ status: 'error', message: 'La clave es requerida.' });
  }

  const config = await adminService.updateConfig(key, value);
  res.status(200).json({ status: 'success', config });
});

// Reports
export const createReport = catchAsync(async (req, res, next) => {
  const { designId, reason } = req.body;

  if (!designId || !reason) {
    return next(new AppError('El ID del diseño y el motivo son requeridos.', 422));
  }

  const report = await adminService.createReport(designId, req.sessionUser.id, reason);

  res.status(201).json({ status: 'success', report });
});

export const getReports = catchAsync(async (req, res) => {
  const { status } = req.query;
  const reports = await adminService.getReports(status);
  res.status(200).json({ status: 'success', reports });
});

export const reviewReport = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!['reviewed', 'dismissed'].includes(status)) {
    return next(new AppError('Estado inválido. Use "reviewed" o "dismissed".', 422));
  }

  const report = await adminService.reviewReport(req.params.id, status);
  if (!report) return next(new AppError('Denuncia no encontrada.', 404));

  res.status(200).json({ status: 'success', report });
});

// Stats
export const getStats = catchAsync(async (req, res) => {
  const stats = await adminService.getStats();
  res.status(200).json({ status: 'success', stats });
});

// Users
export const getUsers = catchAsync(async (req, res) => {
  const { role, search, page, limit } = req.query;
  const result = await adminService.getUsers({ role, search, page: Number(page), limit: Number(limit) });
  res.status(200).json({ status: 'success', ...result });
});

export const suspendUser = catchAsync(async (req, res, next) => {
  const user = await adminService.suspendUser(req.params.id);
  if (!user) return next(new AppError('Usuario no encontrado.', 404));

  res.status(200).json({
    status: 'success',
    message: user.status === 'suspended' ? 'Usuario suspendido.' : 'Usuario reactivado.',
  });
});

export const updateUserRank = catchAsync(async (req, res, next) => {
  const { rank } = req.body;

  if (!['bronce', 'plata', 'oro', 'platino', 'diamante'].includes(rank)) {
    return next(new AppError('Rango inválido.', 422));
  }

  const user = await adminService.updateUserRank(req.params.id, rank);
  if (!user) return next(new AppError('Usuario no encontrado.', 404));

  res.status(200).json({ status: 'success', user });
});

export const calculateRanks = catchAsync(async (req, res) => {
  await adminService.calculateRanks();
  res.status(200).json({ status: 'success', message: 'Rangos calculados correctamente.' });
});
