import { adminService } from './admin.service.js';
import { designService } from '../designs/design.service.js';
import { badgeService } from '../badges/badge.service.js';
import { notificationService } from '../notifications/notification.service.js';
import { mailService } from '../../config/resend/resend.js';
import { r2Storage } from '../../config/r2/r2.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';

// Moderation
export const pauseDesign = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  if (!reason || reason.trim().length < 10) {
    return next(new AppError('El motivo de la pausa debe tener al menos 10 caracteres.', 422));
  }

  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (design.status !== 'approved') {
    return next(new AppError('Solo se pueden pausar diseños aprobados.', 400));
  }

  // Generate ticket ID
  const ticketId = `MD-${String(Date.now()).slice(-6)}`;

  const paused = await designService.pause(req.params.id, req.sessionUser.id, reason, ticketId);

  // Create notification for seller
  try {
    await notificationService.create({
      userId: design.sellerId,
      type: 'paused',
      title: 'Diseño pausado - Acción requerida',
      message: `Tu diseño "${design.title}" fue pausado. Ticket: ${ticketId}. Motivo: ${reason}`,
      designId: design.id,
    });
  } catch (notifError) {
    console.error('Error creating notification:', notifError);
  }

  // Send email to seller
  try {
    const seller = design.seller;
    if (seller?.email) {
      await mailService.sendDesignPaused(seller.email, design.title, reason, ticketId);
    }
  } catch (mailError) {
    console.error('Error sending pause email:', mailError);
  }

  res.status(200).json({
    status: 'success',
    design: paused,
    ticketId,
  });
});

export const unpauseDesign = catchAsync(async (req, res, next) => {
  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (design.status !== 'paused') {
    return next(new AppError('Este diseño no está pausado.', 400));
  }

  const unpaused = await designService.unpause(req.params.id);

  res.status(200).json({
    status: 'success',
    design: unpaused,
  });
});

export const getPausedDesigns = catchAsync(async (req, res) => {
  const designs = await designService.findByStatus('paused');
  res.status(200).json({ status: 'success', designs });
});

export const downloadDesignFile = catchAsync(async (req, res, next) => {
  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (!design.originalFileKey) {
    return next(new AppError('Este diseño no tiene archivo original.', 404));
  }

  const signedUrl = await r2Storage.getSignedDownloadUrl(design.originalFileKey, 3600);

  res.status(200).json({
    status: 'success',
    downloadUrl: signedUrl,
    fileName: design.originalFileName || `${design.title}.zip`,
  });
});

export const getPendingDesigns = catchAsync(async (req, res) => {
  const designs = await designService.findNewPending();
  res.status(200).json({ status: 'success', designs });
});

export const getPreviewRequests = catchAsync(async (req, res) => {
  const designs = await designService.findPreviewRequests();
  res.status(200).json({ status: 'success', designs });
});

export const getDeleteRequests = catchAsync(async (req, res) => {
  const designs = await designService.findDeleteRequests();
  res.status(200).json({ status: 'success', designs });
});

export const rejectDeleteRequest = catchAsync(async (req, res, next) => {
  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (!design.deleteRequested) {
    return next(new AppError('No hay solicitud de eliminación pendiente.', 400));
  }

  await designService.rejectDelete(req.params.id);

  // Notify seller
  try {
    await notificationService.create({
      userId: design.sellerId,
      type: 'delete_rejected',
      title: 'Solicitud de eliminación rechazada',
      message: `Tu solicitud para eliminar "${design.title}" fue revisada. El diseño sigue publicado.`,
      designId: design.id,
    });
  } catch (notifError) {
    console.error('Error creating notification:', notifError);
  }

  res.status(200).json({ status: 'success', message: 'Solicitud rechazada. El diseño sigue publicado.' });
});

// Config
export const getAllConfig = catchAsync(async (req, res) => {
  const config = await adminService.getAllConfig();
  res.status(200).json({ status: 'success', config });
});

// Only these keys can be edited via the API. Commission and other values are
// intentionally not configurable (fixed in code) to avoid tampering.
const EDITABLE_CONFIG_KEYS = ['categories', 'techniques'];

export const updateConfig = catchAsync(async (req, res) => {
  const { key, value } = req.body;

  if (!key) {
    return res.status(422).json({ status: 'error', message: 'La clave es requerida.' });
  }

  if (!EDITABLE_CONFIG_KEYS.includes(key)) {
    return res.status(422).json({ status: 'error', message: 'Clave de configuración no editable.' });
  }

  const config = await adminService.updateConfig(key, value);
  res.status(200).json({ status: 'success', config });
});

// Reports
export const createReport = catchAsync(async (req, res, next) => {
  const { designId, reason } = req.body;

  if (!designId || !reason) {
    return next(new AppError('Faltan el diseño o el motivo de la denuncia.', 422));
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
  const { role, search, page = '1', limit = '20' } = req.query;
  const result = await adminService.getUsers({ role, search, page: Number(page), limit: Number(limit) });
  res.status(200).json({ status: 'success', ...result });
});

export const suspendUser = catchAsync(async (req, res, next) => {
  const { user, error } = await adminService.suspendUser(req.params.id);
  if (!user) return next(new AppError('Usuario no encontrado.', 404));
  if (error === 'admin') {
    return next(new AppError('No se puede suspender a un administrador.', 400));
  }

  res.status(200).json({
    status: 'success',
    message: user.status === 'suspended' ? 'Usuario suspendido.' : 'Usuario reactivado.',
    user,
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
  const results = await badgeService.calculateRanks();
  const changed = results.filter((r) => r.changed);
  res.status(200).json({
    status: 'success',
    message: `${changed.length} vendedor(es) subieron de nivel.`,
    results: changed,
  });
});

export const getPublicCategories = catchAsync(async (req, res) => {
  const config = await adminService.getConfig('categories');
  const categories = config || [
    'Sublimado',
    'Estampado',
    'Papelería',
    'Infantil',
    'Deportivo',
    'Religioso',
  ];
  res.status(200).json({ status: 'success', categories });
});

export const getPublicTechniques = catchAsync(async (req, res) => {
  const config = await adminService.getConfig('techniques');
  const techniques = config || [
    'Sublimado',
    'Estampado',
    'Vinilo textil',
    'DTF',
    'Impresión 3D',
    'Serigrafía',
    'Bordado',
  ];
  res.status(200).json({ status: 'success', techniques });
});

export const getCategoryCounts = catchAsync(async (req, res) => {
  // Get counts for approved designs grouped by category
  // Only categories with at least 1 approved design, ordered by count DESC
  const [counts] = await designService.countByCategory();

  const categories = counts.map(row => ({
    name: row.category,
    count: parseInt(row.count, 10),
  }));

  res.status(200).json({ status: 'success', categories });
});
