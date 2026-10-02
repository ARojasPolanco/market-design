import { purchaseService } from './purchase.service.js';
import { designService } from '../designs/design.service.js';
import { ratingService } from '../ratings/rating.service.js';
import { authService } from '../auth/auth.service.js';
import { mpService } from '../../config/mercadopago/mercadopago.js';
import { r2Storage } from '../../config/r2/r2.js';
import { mailService } from '../../config/resend/resend.js';
import { appUrl } from '../../config/enviroments.js';
import { getCommissionRate } from '../../config/ranks.js';
import { achievementService } from '../achievements/achievement.service.js';
import { notificationService } from '../notifications/notification.service.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';
import { validateCreatePurchase, validateCreateRating } from './purchase.schema.js';

export const createPurchase = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateCreatePurchase(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  if (!req.sessionUser.emailVerified) {
    return next(new AppError('Verificá tu email para poder comprar.', 403));
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

  // Calculate commission based on seller rank (fixed rates, not admin-editable)
  const sellerRank = design.seller?.rank || 'bronce';
  const commissionRate = getCommissionRate(sellerRank) / 100;
  const commission = Math.round(design.price * commissionRate * 100) / 100;
  const sellerEarnings = Math.round((design.price - commission) * 100) / 100;

  // Check if this is a simulation (mpPaymentId starts with 'sim_')
  const isSimulation = data.mpPaymentId?.startsWith('sim_');

  // Create purchase record
  const purchase = await purchaseService.create({
    buyerId: req.sessionUser.id,
    designId: data.designId,
    price: design.price,
    commission,
    sellerEarnings,
    status: isSimulation ? 'completed' : 'pending',
    mpPaymentId: data.mpPaymentId || null,
    mpPreferenceId: data.mpPreferenceId || null,
  });

  // If simulation, update design stats and send emails
  if (isSimulation) {
    await designService.update(design.id, {
      salesCount: (design.salesCount || 0) + 1,
    });

    // Send purchase confirmation email to buyer
    try {
      const buyer = req.sessionUser;
      const downloadUrl = `${appUrl}/comprador/panel`;
      await mailService.sendPurchaseConfirmation(buyer.email, {
        designTitle: design.title,
        downloadUrl,
        orderNumber: purchase.id.substring(0, 8).toUpperCase(),
        purchaseDate: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        previewUrl: design.previewUrl,
        sellerName: design.seller?.storeName || design.seller?.username || 'Vendedor',
      });
    } catch (_emailError) {
      // Don't fail the purchase if email fails
    }

    try {
      await notificationService.create({
        userId: design.sellerId,
        type: 'sale',
        title: '¡Nueva venta!',
        message: `Vendiste "${design.title}" por $${Number(design.price).toLocaleString()}.`,
        designId: design.id,
      });
    } catch (notifError) {
      console.error('Error creating sale notification:', notifError);
    }

    try {
      await achievementService.evaluateAutomatic(design.sellerId);
    } catch (achError) {
      console.error('Error evaluating achievements:', achError);
    }

    return res.status(201).json({
      status: 'success',
      purchase: { id: purchase.id, price: purchase.price },
    });
  }

  // Real payment: the seller must have connected their Mercado Pago account
  const sellerCreds = await authService.findMpCredentials(design.sellerId);
  if (!sellerCreds?.mpConnected || !sellerCreds.mpAccessToken) {
    await purchase.destroy();
    return next(
      new AppError('El vendedor todavía no conectó su cuenta de Mercado Pago.', 409)
    );
  }

  const preferenceItems = [{ title: design.title, price: Number(design.price) }];

  let preference = null;
  try {
    preference = await mpService.createSellerPreference(sellerCreds.mpAccessToken, {
      items: preferenceItems,
      externalReference: purchase.id,
      marketplaceFee: commission,
    });
  } catch (_mpError) {
    // Access token may be expired: try to refresh it once.
    if (sellerCreds.mpRefreshToken) {
      try {
        const refreshed = await mpService.refreshAccessToken(sellerCreds.mpRefreshToken);
        await authService.update(design.sellerId, {
          mpAccessToken: refreshed.access_token,
          mpRefreshToken: refreshed.refresh_token || sellerCreds.mpRefreshToken,
        });
        preference = await mpService.createSellerPreference(refreshed.access_token, {
          items: preferenceItems,
          externalReference: purchase.id,
          marketplaceFee: commission,
        });
      } catch (refreshError) {
        console.error('MP preference/refresh error:', refreshError.message);
      }
    }
  }

  if (!preference) {
    await purchase.destroy();
    return next(
      new AppError('No pudimos iniciar el pago con Mercado Pago. Intentá de nuevo.', 502)
    );
  }

  await purchase.update({ mpPreferenceId: preference.id });

  return res.status(201).json({
    status: 'success',
    purchase: {
      id: purchase.id,
      price: purchase.price,
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    },
  });
});

export const handleWebhook = catchAsync(async (req, res) => {
  const { type, data } = req.body;
  const signature = req.headers['x-signature'];
  const requestId = req.headers['x-request-id'];
  const dataId = data?.id || req.query?.['data.id'];

  if (!mpService.verifyWebhookSignature({ dataId, signature, requestId })) {
    return res.status(401).json({ status: 'error', message: 'Firma de webhook inválida.' });
  }

  if (type === 'payment') {
    const paymentId = data.id;

    try {
      const seller = req.body.user_id
        ? await authService.findByMpUserId(req.body.user_id)
        : null;
      const payment = await mpService.getPayment(paymentId, seller?.mpAccessToken);

      if (payment.status === 'approved') {
        let purchase = null;
        if (payment.external_reference) {
          purchase = await purchaseService.findById(payment.external_reference);
        }
        if (!purchase) {
          purchase = await purchaseService.findByMpPaymentId(paymentId);
        }

        if (purchase && purchase.status !== 'completed') {
          // Mercado Pago processing fee (borne by the seller)
          const mpFee = Array.isArray(payment.fee_details)
            ? payment.fee_details.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
            : null;

          // Complete purchase
          const completed = await purchaseService.completePurchase(purchase.id, paymentId, mpFee);

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
              const downloadUrl = `${appUrl}/compra/${completed.downloadToken}`;

              await mailService.sendPurchaseConfirmation(buyer.email, {
                designTitle: design.title,
                downloadUrl,
                orderNumber: purchase.id.substring(0, 8).toUpperCase(),
                purchaseDate: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                previewUrl: design.previewUrl,
                sellerName: design.seller?.storeName || design.seller?.username || 'Vendedor',
              });
            } catch (mailError) {
              console.error('Error sending purchase email:', mailError);
            }
          }

          if (design) {
            try {
              await notificationService.create({
                userId: design.sellerId,
                type: 'sale',
                title: '¡Nueva venta!',
                message: `Vendiste "${design.title}" por $${Number(design.price).toLocaleString()}.`,
                designId: design.id,
              });
            } catch (notifError) {
              console.error('Error creating sale notification:', notifError);
            }

            try {
              await achievementService.evaluateAutomatic(design.sellerId);
            } catch (achError) {
              console.error('Error evaluating achievements:', achError);
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

export const getMySales = catchAsync(async (req, res) => {
  const sales = await purchaseService.findBySeller(req.sessionUser.id);

  const totalEarnings = sales.reduce((sum, s) => sum + Number(s.sellerEarnings || 0), 0);
  const totalMpFees = sales.reduce((sum, s) => sum + Number(s.mpFee || 0), 0);
  const netEarnings = Math.round((totalEarnings - totalMpFees) * 100) / 100;
  const totalSales = sales.length;

  // Get seller's designs to calculate views
  const designs = await designService.findBySeller(req.sessionUser.id);
  const totalViews = designs.reduce((sum, d) => sum + (d.viewCount || 0), 0);
  const conversionRate = totalViews > 0 ? Math.round((totalSales / totalViews) * 100 * 10) / 10 : 0;

  res.status(200).json({
    status: 'success',
    sales,
    stats: {
      totalEarnings,
      totalMpFees,
      netEarnings,
      totalSales,
      totalViews,
      conversionRate,
    },
  });
});

export const downloadDesign = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const purchase = await purchaseService.findByDownloadToken(token);
  if (!purchase) {
    return next(
      new AppError('El enlace de descarga no es válido o ya expiró. Pedí uno nuevo desde tu panel.', 400)
    );
  }

  if (purchase.downloadTokenExpires && new Date() > purchase.downloadTokenExpires) {
    return next(
      new AppError('El enlace de descarga ya expiró. Pedí uno nuevo desde tu panel.', 400)
    );
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

export const replyToRating = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const text = (req.body?.reply || '').trim();

  if (text.length < 2 || text.length > 1000) {
    return next(new AppError('La respuesta debe tener entre 2 y 1000 caracteres.', 422));
  }

  const { rating, error } = await ratingService.reply(id, req.sessionUser.id, text);
  if (error === 'not_found') {
    return next(new AppError('Reseña no encontrada.', 404));
  }
  if (error === 'forbidden') {
    return next(new AppError('No podés responder reseñas de diseños que no son tuyos.', 403));
  }

  try {
    await notificationService.create({
      userId: rating.buyerId,
      type: 'review_reply',
      title: 'El vendedor respondió tu reseña',
      message: `Respondieron tu comentario en "${rating.design?.title || 'un diseño'}": ${text.slice(0, 120)}`,
      designId: rating.designId,
    });
  } catch (notifError) {
    console.error('Error creating notification:', notifError);
  }

  res.status(200).json({
    status: 'success',
    rating,
  });
});

export const deleteRatingReply = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { rating, error } = await ratingService.removeReply(id, req.sessionUser.id);
  if (error === 'not_found') {
    return next(new AppError('Reseña no encontrada.', 404));
  }
  if (error === 'forbidden') {
    return next(new AppError('No podés responder reseñas de diseños que no son tuyos.', 403));
  }

  res.status(200).json({
    status: 'success',
    rating,
  });
});
