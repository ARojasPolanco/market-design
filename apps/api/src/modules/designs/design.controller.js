import { designService } from './design.service.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';
import { validateCreateDesign, validateUpdateDesign, validateQueryDesign } from './design.schema.js';

export const getAllDesigns = catchAsync(async (req, res) => {
  const { hasError, errorMessages, data } = validateQueryDesign(req.query);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const result = await designService.findAll(data);

  res.status(200).json({
    status: 'success',
    ...result,
  });
});

export const getDesign = catchAsync(async (req, res, next) => {
  const design = await designService.findById(req.params.id);

  if (!design) {
    return next(new AppError('Diseño no encontrado', 404));
  }

  // Increment view count
  await designService.incrementViewCount(design.id);

  res.status(200).json({
    status: 'success',
    design,
  });
});

export const createDesign = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateCreateDesign(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  // Check if seller has MP connected
  const user = req.sessionUser;
  if (!user.mpConnected) {
    return next(new AppError('Debés conectar tu cuenta de Mercado Pago para publicar diseños.', 400));
  }

  const design = await designService.create({
    ...data,
    sellerId: user.id,
    originalFileName: req.file?.originalname,
    originalFileSize: req.file?.size,
    fileFormat: req.file?.mimetype,
  });

  res.status(201).json({
    status: 'success',
    design,
  });
});

export const updateDesign = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateUpdateDesign(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const design = await designService.findById(req.params.id);
  if (!design) {
    return next(new AppError('Diseño no encontrado', 404));
  }

  // Only seller can update their own design
  if (design.sellerId !== req.sessionUser.id && req.sessionUser.role !== 'admin') {
    return next(new AppError('No tenés permiso para editar este diseño.', 403));
  }

  // If rejected, set back to pending
  const updateData = { ...data };
  if (design.status === 'rejected') {
    updateData.status = 'pending';
    updateData.rejectionReason = null;
  }

  const updated = await designService.update(req.params.id, updateData);

  res.status(200).json({
    status: 'success',
    design: updated,
  });
});

export const deleteDesign = catchAsync(async (req, res, next) => {
  const design = await designService.findById(req.params.id);
  if (!design) {
    return next(new AppError('Diseño no encontrado', 404));
  }

  if (design.sellerId !== req.sessionUser.id && req.sessionUser.role !== 'admin') {
    return next(new AppError('No tenés permiso para eliminar este diseño.', 403));
  }

  await designService.delete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Diseño eliminado correctamente',
  });
});

export const approveDesign = catchAsync(async (req, res, next) => {
  const design = await designService.findById(req.params.id);
  if (!design) {
    return next(new AppError('Diseño no encontrado', 404));
  }

  if (design.status !== 'pending') {
    return next(new AppError('Este diseño no está pendiente de aprobación.', 400));
  }

  const approved = await designService.approve(req.params.id, req.sessionUser.id);

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
  if (!design) {
    return next(new AppError('Diseño no encontrado', 404));
  }

  if (design.status !== 'pending') {
    return next(new AppError('Este diseño no está pendiente de aprobación.', 400));
  }

  const rejected = await designService.reject(req.params.id, reason);

  res.status(200).json({
    status: 'success',
    design: rejected,
  });
});

export const getPendingDesigns = catchAsync(async (req, res) => {
  const designs = await designService.findPending();

  res.status(200).json({
    status: 'success',
    designs,
  });
});

export const getFeaturedDesigns = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 8;
  const designs = await designService.findFeatured(limit);

  res.status(200).json({
    status: 'success',
    designs,
  });
});

export const getTrendingDesigns = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 8;
  const designs = await designService.findTrending(limit);

  res.status(200).json({
    status: 'success',
    designs,
  });
});

export const getMyDesigns = catchAsync(async (req, res) => {
  const designs = await designService.findBySeller(req.sessionUser.id);

  res.status(200).json({
    status: 'success',
    designs,
  });
});
