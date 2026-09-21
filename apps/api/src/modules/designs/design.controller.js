import { designService } from './design.service.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';
import { validateCreateDesign, validateUpdateDesign, validateQueryDesign } from './design.schema.js';
import { r2Storage } from '../../config/r2/r2.js';
import { cloudinaryStorage } from '../../config/cloudinary/cloudinary.js';

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
    return next(new AppError('ID de diseño inválido.', 400));
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

export const createDesign = catchAsync(async (req, res) => {
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
  const designFile = req.files?.file?.[0];
  const previewFiles = req.files?.previews || [];

  // Upload original design file to R2
  let originalFileKey = null;
  if (designFile) {
    const { key } = await r2Storage.uploadFile(designFile.buffer, designFile.originalname, designFile.mimetype);
    originalFileKey = key;
  }

  // Upload preview files to Cloudinary (watermarked + clean)
  const previewUrls = [];        // Watermarked URLs (public display)
  const previewPublicIds = [];   // Watermarked public IDs
  const previewCleanUrls = [];   // Clean URLs (for buyers)
  const previewCleanIds = [];    // Clean public IDs
  
  for (const preview of previewFiles) {
    const { publicId, cleanPublicId, url, cleanUrl } = await cloudinaryStorage.uploadPreview(preview.buffer, preview.originalname);
    previewUrls.push(url);
    previewPublicIds.push(publicId);
    previewCleanUrls.push(cleanUrl);
    previewCleanIds.push(cleanPublicId);
  }

  const design = await designService.create({
    ...data,
    sellerId: user.id,
    originalFileKey,
    originalFileName: designFile?.originalname,
    originalFileSize: designFile?.size,
    fileFormat: designFile?.mimetype,
    previewUrl: previewUrls[0] || null,           // Watermarked
    previewKey: previewPublicIds[0] || null,       // Watermarked public ID
    previewUrls: previewUrls.length > 0 ? previewUrls : null,
    previewKeys: previewPublicIds.length > 0 ? previewPublicIds : null,
    // Store clean versions for buyers
    originalPreviewUrl: previewCleanUrls[0] || null,
    originalPreviewKey: previewCleanIds[0] || null,
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
