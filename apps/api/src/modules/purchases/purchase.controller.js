import { purchaseService } from './purchase.service.js';
import { designService } from '../designs/design.service.js';
import { ratingService } from '../ratings/rating.service.js';
import { mpService } from '../../config/mercadopago/mercadopago.js';
import { r2Storage } from '../../config/r2/r2.js';
import { mailService } from '../../config/resend/resend.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';
import { validateCreatePurchase, validateCreateRating } from './purchase.schema.js';

export const createPurchase = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateCreatePurchase(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const design = await designService.findById(data.designId);
  if (!design) {
    return next(new AppError('Diseño no encontrado', 404));
  }

  if (design.status !== 'approved') {
    return next(new AppError('Este diseño no está disponible para compra.', 400));
  }

  // Check if already purchased
  const alreadyPurchased = await purchaseService.hasPurchased(req.sessionUser.id, data.designId);
  if (alreadyPurchased) {
    return next(new AppError('Ya compraste este diseño.', 400));
  }

  // Calculate commission (default 20%)
  const commissionRate = 0.20;
  const commission = Math.round(design.price * commissionRate * 100) / 100;
  const sellerEarnings = Math.round((design.price - commission) * 100) / 100;

  // Create purchase record
  const purchase = await purchaseService.create({
    buyerId: req.sessionUser.id,
    designId: data.designId,
    price: design.price,
    commission,
    sellerEarnings,
    status: 'pending',
  });

  // Create MP preference
  try {
    const preference = await mpService.createPreference(
      [
        {
          title: design.title,
          price: Number(design.price),
        },
      ],
      purchase.id,
      design.sellerId
    );

    await purchase.update({ mpPreferenceId: preference.id });

    res.status(201).json({
      status: 'success',
      purchase: {
        id: purchase.id,
        price: purchase.price,
        preferenceId: preference.id,
        initPoint: preference.init_point,
      },
    });
  } catch (_error) {
    await purchase.update({ status: 'refunded' });
    return next(new AppError('Error al crear la preferencia de pago.', 500));
  }
});

export const handleWebhook = catchAsync(async (req, res) => {
  const { type, data } = req.body;

  if (type === 'payment') {
    const paymentId = data.id;

    try {
      const payment = await mpService.getPayment(paymentId);

      if (payment.status === 'approved') {
        const purchase = await purchaseService.findByMpPaymentId(paymentId);

        if (purchase && purchase.status === 'pending') {
          // Complete purchase
          const completed = await purchaseService.completePurchase(purchase.id, paymentId);

          // Update design sales count
          await designService.update(purchase.designId, {
            salesCount: (purchase.design?.salesCount || 0) + 1,
          });

          // Send download email
          const design = await designService.findById(purchase.designId);
          const buyer = purchase.buyer;

          if (design && buyer) {
            try {
              // Generate signed download URL
              const downloadUrl = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/compra/${completed.downloadToken}`;

              await mailService.sendPurchaseConfirmation(
                buyer.email,
                design.title,
                downloadUrl
              );
            } catch (mailError) {
              console.error('Error sending purchase email:', mailError);
            }
          }
        }
      }
    } catch (_error) {
      console.error('Webhook payment error:', _error);
    }
  }

  res.status(200).json({ received: true });
});

export const verifyPayment = catchAsync(async (req, res, next) => {
  const { orderNumber } = req.params;

  const purchase = await purchaseService.findById(orderNumber);
  if (!purchase) {
    return next(new AppError('Compra no encontrada', 404));
  }

  res.status(200).json({
    status: 'success',
    purchase: {
      id: purchase.id,
      status: purchase.status,
      design: purchase.design,
      createdAt: purchase.createdAt,
    },
  });
});

export const getMyPurchases = catchAsync(async (req, res) => {
  const purchases = await purchaseService.findByBuyer(req.sessionUser.id);

  res.status(200).json({
    status: 'success',
    purchases,
  });
});

export const downloadDesign = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const purchase = await purchaseService.findByDownloadToken(token);
  if (!purchase) {
    return next(new AppError('Link de descarga inválido o expirado.', 400));
  }

  if (purchase.downloadTokenExpires && new Date() > purchase.downloadTokenExpires) {
    return next(new AppError('El link de descarga ha expirado. Solicitá uno nuevo desde tu panel.', 400));
  }

  // Generate new signed URL
  const design = purchase.design;
  if (!design.originalFileKey) {
    return next(new AppError('Archivo no disponible.', 404));
  }

  const signedUrl = await r2Storage.getSignedDownloadUrl(design.originalFileKey, 3600);

  // Increment download count
  await purchaseService.incrementDownload(purchase.id);

  res.status(200).json({
    status: 'success',
    downloadUrl: signedUrl,
    fileName: design.originalFileName || `${design.title}.zip`,
  });
});

export const reDownload = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const purchase = await purchaseService.findById(id);
  if (!purchase) {
    return next(new AppError('Compra no encontrada', 404));
  }

  if (purchase.buyerId !== req.sessionUser.id) {
    return next(new AppError('No tenés permiso para descargar este archivo.', 403));
  }

  if (purchase.status !== 'completed') {
    return next(new AppError('Esta compra no está completada.', 400));
  }

  const design = purchase.design;
  if (!design.originalFileKey) {
    return next(new AppError('Archivo no disponible.', 404));
  }

  const signedUrl = await r2Storage.getSignedDownloadUrl(design.originalFileKey, 3600);

  await purchaseService.incrementDownload(purchase.id);

  res.status(200).json({
    status: 'success',
    downloadUrl: signedUrl,
    fileName: design.originalFileName || `${design.title}.zip`,
  });
});

export const createRating = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateCreateRating(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  // Verify purchase exists and belongs to user
  const purchase = await purchaseService.findById(data.purchaseId);
  if (!purchase) {
    return next(new AppError('Compra no encontrada.', 404));
  }

  if (purchase.buyerId !== req.sessionUser.id) {
    return next(new AppError('Solo podés valorar diseños que compraste.', 403));
  }

  if (purchase.designId !== data.designId) {
    return next(new AppError('El diseño no coincide con la compra.', 400));
  }

  // Check if already rated
  const alreadyRated = await ratingService.hasRated(data.purchaseId);
  if (alreadyRated) {
    return next(new AppError('Ya valoraste este diseño.', 400));
  }

  const rating = await ratingService.create({
    buyerId: req.sessionUser.id,
    designId: data.designId,
    purchaseId: data.purchaseId,
    score: data.score,
    comment: data.comment,
  });

  res.status(201).json({
    status: 'success',
    rating,
  });
});

export const getDesignRatings = catchAsync(async (req, res) => {
  const { designId } = req.params;
  const ratings = await ratingService.findByDesign(designId);

  res.status(200).json({
    status: 'success',
    ratings,
  });
});
