import { designService } from './design.service.js';
import { achievementService } from '../achievements/achievement.service.js';
import { notificationService } from '../notifications/notification.service.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';
import { validateCreateDesign, validateUpdateDesign, validateQueryDesign } from './design.schema.js';
import { r2Storage } from '../../config/r2/r2.js';
import { cloudinaryStorage } from '../../config/cloudinary/cloudinary.js';
import User from '../auth/auth.model.js';

// Helper to notify all admins
async function notifyAdmins(type, title, message, designId) {
  try {
    const admins = await User.findAll({ where: { role: 'admin', isDeleted: false } });
    for (const admin of admins) {
      await notificationService.create({
        userId: admin.id,
        type,
        title,
        message,
        designId,
      });
    }
  } catch (err) {
    console.error('Error notifying admins:', err);
  }
}

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
  const { id } = req.params;

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return next(new AppError('No pudimos encontrar ese diseño.', 400));
  }

  const design = await designService.findById(id);

  if (!design) {
    return next(new AppError('Diseño no encontrado.', 404));
  }

  // Increment view count
  await designService.incrementViewCount(design.id);

  res.status(200).json({
    status: 'success',
    design,
  });
});

export const createDesign = catchAsync(async (req, res, next) => {
  const parsedBody = {
    ...req.body,
    price: Number(req.body.price),
    categorySuggested: req.body.categorySuggested || req.body.category,
  };
  delete parsedBody.category;

  const { hasError, errorMessages, data } = validateCreateDesign(parsedBody);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const user = req.sessionUser;

  if (!user.emailVerified) {
    return next(new AppError('Verificá tu email para poder subir diseños.', 403));
  }
  const designFile = req.files?.file?.[0];
  const previewFiles = req.files?.previews || [];

  // Upload original design file to R2
  let originalFileKey = null;
  if (designFile) {
    const { key } = await r2Storage.uploadFile(designFile.buffer, designFile.originalname, designFile.mimetype);
    originalFileKey = key;
  }

  // Upload preview files to Cloudinary (watermarked)
  const previewUrls = [];
  const previewPublicIds = [];
  
  for (const preview of previewFiles) {
    const { publicId, url } = await cloudinaryStorage.uploadPreview(preview.buffer, preview.originalname);
    previewUrls.push(url);
    previewPublicIds.push(publicId);
  }

  const design = await designService.create({
    ...data,
    sellerId: user.id,
    originalFileKey,
    originalFileName: designFile?.originalname,
    originalFileSize: designFile?.size,
    fileFormat: designFile?.mimetype,
    previewUrl: previewUrls[0] || null,
    previewKey: previewPublicIds[0] || null,
    previewUrls: previewUrls.length > 0 ? previewUrls : null,
    previewKeys: previewPublicIds.length > 0 ? previewPublicIds : null,
  });

  res.status(201).json({
    status: 'success',
    design,
  });
});

export const updateDesign = catchAsync(async (req, res, next) => {
  const parsedBody = {
    ...req.body,
    price: req.body.price ? Number(req.body.price) : undefined,
    categorySuggested: req.body.categorySuggested || req.body.category,
  };
  delete parsedBody.category;

  const { hasError, errorMessages, data } = validateUpdateDesign(parsedBody);
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

  const designFile = req.files?.file?.[0];
  const previewFiles = req.files?.previews || [];

  // Published designs must change previews through the review flow.
  if (previewFiles.length > 0 && (design.status === 'approved' || design.status === 'paused')) {
    return next(
      new AppError("Para cambiar la preview de un diseño publicado, usá 'Reemplazar preview'.", 400)
    );
  }

  // Upload new preview files to Cloudinary if provided
  const updateData = { ...data };
  if (previewFiles.length > 0) {
    const previewUrls = [];
    const previewPublicIds = [];
    for (const preview of previewFiles) {
      const { publicId, url } = await cloudinaryStorage.uploadPreview(preview.buffer, preview.originalname);
      previewUrls.push(url);
      previewPublicIds.push(publicId);
    }
    updateData.previewUrl = previewUrls[0];
    updateData.previewKey = previewPublicIds[0];
    updateData.previewUrls = previewUrls;
    updateData.previewKeys = previewPublicIds;
  }

  if (designFile) {
    updateData.originalFileName = designFile.originalname;
    updateData.originalFileSize = designFile.size;
    updateData.fileFormat = designFile.mimetype;
  }

  // If rejected, set back to pending
  const wasRejected = design.status === 'rejected';
  if (wasRejected) {
    updateData.status = 'pending';
    updateData.rejectionReason = null;
  }

  const updated = await designService.update(req.params.id, updateData);

  if (wasRejected) {
    try {
      await notifyAdmins(
        'design_resubmitted',
        'Diseño reenviado a revisión',
        `El vendedor reenvió el diseño "${design.title}" tras un rechazo.`,
        design.id
      );
    } catch (notifError) {
      console.error('Error notifying admins:', notifError);
    }
  }

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

  // Approved/paused designs require admin approval to be removed.
  // Not-yet-approved designs (pending/rejected) can be deleted directly.
  if (design.status === 'approved' || design.status === 'paused') {
    return next(
      new AppError(
        'Este diseño está publicado. Usá "Solicitar eliminación" para que la administración lo revise.',
        400
      )
    );
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

  // Assign the category exactly as chosen by the admin (it comes from the
  // managed categories list, so the spelling/case must be preserved).
  const updateData = {};
  if (req.body.category) {
    updateData.category = String(req.body.category).trim();
  }

  const approved = await designService.approve(req.params.id, req.sessionUser.id, updateData);

  // Create notification for seller
  try {
    await notificationService.create({
      userId: design.sellerId,
      type: 'approved',
      title: '¡Diseño aprobado!',
      message: `Tu diseño "${design.title}" fue aprobado y ya está publicado en el marketplace.`,
      designId: design.id,
    });
  } catch (notifError) {
    console.error('Error creating notification:', notifError);
  }

  try {
    await achievementService.evaluateAutomatic(design.sellerId);
  } catch (achError) {
    console.error('Error evaluating achievements:', achError);
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
  if (!design) {
    return next(new AppError('Diseño no encontrado', 404));
  }

  if (design.status !== 'pending') {
    return next(new AppError('Este diseño no está pendiente de aprobación.', 400));
  }

  const rejected = await designService.reject(req.params.id, req.sessionUser.id, reason);

  // Create notification for seller
  try {
    await notificationService.create({
      userId: design.sellerId,
      type: 'rejected',
      title: 'Diseño rechazado',
      message: `Tu diseño "${design.title}" fue rechazado. Motivo: ${reason}`,
      designId: design.id,
    });
  } catch (notifError) {
    console.error('Error creating notification:', notifError);
  }

  try {
    await achievementService.evaluateAutomatic(design.sellerId);
  } catch (achError) {
    console.error('Error evaluating achievements:', achError);
  }

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

export const updateDesignPrice = catchAsync(async (req, res, next) => {
  const { price } = req.body;
  
  if (!price || Number(price) <= 0) {
    return next(new AppError('El precio debe ser mayor a 0.', 422));
  }

  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (design.sellerId !== req.sessionUser.id) {
    return next(new AppError('No tenés permiso para editar este diseño.', 403));
  }

  if (design.status !== 'approved') {
    return next(new AppError('Solo podés editar diseños aprobados.', 400));
  }

  const updated = await designService.update(req.params.id, { price: Number(price) });

  res.status(200).json({ status: 'success', design: updated });
});

export const updateDesignDescription = catchAsync(async (req, res, next) => {
  const { description } = req.body;
  
  if (!description || description.trim().length < 10) {
    return next(new AppError('La descripción debe tener al menos 10 caracteres.', 422));
  }

  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (design.sellerId !== req.sessionUser.id) {
    return next(new AppError('No tenés permiso para editar este diseño.', 403));
  }

  if (design.status !== 'approved') {
    return next(new AppError('Solo podés editar diseños aprobados.', 400));
  }

  const updated = await designService.update(req.params.id, { description: description.trim() });

  res.status(200).json({ status: 'success', design: updated });
});

export const requestPreviewReplacement = catchAsync(async (req, res, next) => {
  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (design.sellerId !== req.sessionUser.id) {
    return next(new AppError('No tenés permiso para editar este diseño.', 403));
  }

  if (design.status !== 'approved') {
    return next(new AppError('Solo podés reemplazar previews de diseños aprobados.', 400));
  }

  const previewFiles = req.files?.previews || [];
  if (previewFiles.length === 0) {
    return next(new AppError('Debés subir al menos una imagen de preview.', 422));
  }

  // Upload new previews to Cloudinary
  const previewUrls = [];
  const previewPublicIds = [];
  for (const preview of previewFiles) {
    const { publicId, url } = await cloudinaryStorage.uploadPreview(preview.buffer, preview.originalname);
    previewUrls.push(url);
    previewPublicIds.push(publicId);
  }

  // Store as pending previews. Do NOT change status: the current version
  // stays published and visible while the new one awaits moderation.
  const updated = await designService.update(req.params.id, {
    pendingPreviewUrl: previewUrls[0] || null,
    pendingPreviewKey: previewPublicIds[0] || null,
    pendingPreviewUrls: previewUrls.length > 0 ? previewUrls : null,
    pendingPreviewKeys: previewPublicIds.length > 0 ? previewPublicIds : null,
  });

  // Notify admins
  await notifyAdmins(
    'preview_review',
    'Nuevo preview pendiente de revisión',
    `El vendedor reemplazó los previews del diseño "${design.title}". Revisá y aprobá.`,
    design.id
  );

  res.status(200).json({ 
    status: 'success', 
    message: 'Preview enviado a revisión. La versión actual sigue publicada hasta que se apruebe.',
    design: updated,
  });
});

export const approvePreview = catchAsync(async (req, res, next) => {
  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (!design.pendingPreviewUrl) {
    return next(new AppError('No hay previews pendientes de aprobación.', 400));
  }

  // Replace current previews with pending ones. Status stays untouched
  // (design keeps being published during and after the review).
  const updated = await designService.update(req.params.id, {
    previewUrl: design.pendingPreviewUrl,
    previewKey: design.pendingPreviewKey,
    previewUrls: design.pendingPreviewUrls,
    previewKeys: design.pendingPreviewKeys,
    pendingPreviewUrl: null,
    pendingPreviewKey: null,
    pendingPreviewUrls: null,
    pendingPreviewKeys: null,
  });

  // Notify seller
  try {
    await notificationService.create({
      userId: design.sellerId,
      type: 'preview_approved',
      title: 'Preview aprobado',
      message: `Los nuevos previews del diseño "${design.title}" fueron aprobados y ya están publicados.`,
      designId: design.id,
    });
  } catch (notifError) {
    console.error('Error creating notification:', notifError);
  }

  res.status(200).json({ status: 'success', design: updated });
});

export const rejectPreview = catchAsync(async (req, res, next) => {
  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (!design.pendingPreviewUrl) {
    return next(new AppError('No hay previews pendientes de aprobación.', 400));
  }

  // Remove pending previews, keep current ones published. Status untouched.
  const updated = await designService.update(req.params.id, {
    pendingPreviewUrl: null,
    pendingPreviewKey: null,
    pendingPreviewUrls: null,
    pendingPreviewKeys: null,
  });

  // Notify seller
  try {
    await notificationService.create({
      userId: design.sellerId,
      type: 'preview_rejected',
      title: 'Preview rechazado',
      message: `Los nuevos previews del diseño "${design.title}" fueron rechazados. La versión anterior sigue publicada.`,
      designId: design.id,
    });
  } catch (notifError) {
    console.error('Error creating notification:', notifError);
  }

  res.status(200).json({ status: 'success', design: updated });
});

export const requestDelete = catchAsync(async (req, res, next) => {
  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (design.sellerId !== req.sessionUser.id) {
    return next(new AppError('No tenés permiso para eliminar este diseño.', 403));
  }

  if (design.status !== 'approved' && design.status !== 'paused') {
    return next(new AppError('Solo podés solicitar eliminar diseños publicados o pausados.', 400));
  }

  const updated = await designService.update(req.params.id, {
    deleteRequested: true,
    deleteRequestedAt: new Date(),
  });

  // Notify admins
  await notifyAdmins(
    'delete_request',
    'Solicitud de eliminación',
    `El vendedor solicitó eliminar el diseño "${design.title}". Revisá y aprobá.`,
    design.id
  );

  res.status(200).json({ 
    status: 'success', 
    message: 'Solicitud de eliminación enviada. El diseño sigue visible hasta que sea aprobada.',
    design: updated,
  });
});

export const approveDelete = catchAsync(async (req, res, next) => {
  const design = await designService.findById(req.params.id);
  if (!design) return next(new AppError('Diseño no encontrado.', 404));

  if (!design.deleteRequested) {
    return next(new AppError('No hay solicitud de eliminación pendiente.', 400));
  }

  // Soft delete - keep files for existing buyers
  await designService.update(req.params.id, {
    isDeleted: true,
    deleteRequested: false,
  });

  // Notify seller
  try {
    await notificationService.create({
      userId: design.sellerId,
      type: 'delete_approved',
      title: 'Diseño eliminado',
      message: `Tu diseño "${design.title}" fue eliminado del marketplace.`,
      designId: design.id,
    });
  } catch (notifError) {
    console.error('Error creating notification:', notifError);
  }

  res.status(200).json({ status: 'success', message: 'Diseño eliminado correctamente.' });
});
