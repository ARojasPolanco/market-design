import crypto from 'node:crypto';
import { customOrderService } from './customOrder.service.js';
import { validateCreateCustomOrder, validateQuoteCustomOrder } from './customOrder.schema.js';
import { chatService } from '../chat/chat.service.js';
import User from '../auth/auth.model.js';
import { mpService } from '../../config/mercadopago/mercadopago.js';
import { r2Storage } from '../../config/r2/r2.js';
import { mailService } from '../../config/resend/resend.js';
import { notificationService } from '../notifications/notification.service.js';
import { getCommissionRate } from '../../config/ranks.js';
import { appUrl } from '../../config/enviroments.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';

const shortId = (id) => String(id).substring(0, 8).toUpperCase();

export const createOrder = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateCreateCustomOrder(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const buyerId = req.sessionUser.id;
  if (data.sellerId === buyerId) {
    return next(new AppError('No podés pedir un servicio a vos mismo.', 400));
  }

  const seller = await User.findByPk(data.sellerId, { attributes: ['id', 'role'] });
  if (!seller || seller.role !== 'seller') {
    return next(new AppError('El vendedor indicado no existe.', 404));
  }

  let conversation = null;
  if (data.conversationId) {
    conversation = await chatService.findConversation(data.conversationId);
    if (!conversation || !chatService.isParticipant(conversation, buyerId)) {
      return next(new AppError('No tenés acceso a esa conversación.', 403));
    }
  } else {
    conversation = await chatService.findOrCreateConversation({
      type: 'buyer_seller',
      buyerId,
      sellerId: data.sellerId,
      designId: data.baseDesignId,
    });
  }

  const order = await customOrderService.create({
    buyerId,
    sellerId: data.sellerId,
    baseDesignId: data.baseDesignId || null,
    conversationId: conversation.id,
    title: data.title || 'Servicio personalizado',
    description: data.description || null,
    status: 'requested',
  });

  try {
    await chatService.addSystemMessage(
      conversation.id,
      buyerId,
      `Pedido personalizado #${shortId(order.id)} creado.`
    );
  } catch (_error) {
    // System message is best-effort.
  }

  res.status(201).json({ status: 'success', order, conversationId: conversation.id });
});

export const quoteOrder = catchAsync(async (req, res, next) => {
  const order = await customOrderService.findById(req.params.id);
  if (!order) {
    return next(new AppError('Pedido no encontrado.', 404));
  }
  if (order.sellerId !== req.sessionUser.id) {
    return next(new AppError('Solo el vendedor puede cotizar este pedido.', 403));
  }
  if (!['requested', 'quoted'].includes(order.status)) {
    return next(new AppError('Este pedido ya no se puede cotizar.', 400));
  }

  const { hasError, errorMessages, data } = validateQuoteCustomOrder(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  await order.update({
    price: data.price,
    description: data.description || order.description,
    status: 'quoted',
  });

  if (order.conversationId) {
    try {
      await chatService.addSystemMessage(
        order.conversationId,
        req.sessionUser.id,
        `Presupuesto enviado: $${Number(data.price).toLocaleString('es-AR')} (pedido #${shortId(order.id)}).`
      );
    } catch (_error) {
      // best-effort
    }
  }

  try {
    await notificationService.create({
      userId: order.buyerId,
      type: 'custom_order',
      title: 'Presupuesto recibido',
      message: `Te enviaron un presupuesto de $${Number(data.price).toLocaleString('es-AR')}.`,
    });
  } catch (_error) {
    // best-effort
  }

  res.status(200).json({ status: 'success', order });
});

export const payOrder = catchAsync(async (req, res, next) => {
  const order = await customOrderService.findById(req.params.id);
  if (!order) {
    return next(new AppError('Pedido no encontrado.', 404));
  }
  if (order.buyerId !== req.sessionUser.id) {
    return next(new AppError('No tenés acceso a este pedido.', 403));
  }
  if (order.status !== 'quoted' || !order.price) {
    return next(new AppError('El pedido no tiene un presupuesto para pagar.', 400));
  }

  const seller = await User.findByPk(order.sellerId, {
    attributes: ['id', 'rank', 'mpConnected', 'mpAccessToken', 'mpRefreshToken'],
  });
  if (!seller?.mpConnected || !seller.mpAccessToken) {
    return next(new AppError('El vendedor todavía no conectó su cuenta de Mercado Pago.', 409));
  }

  const price = Number(order.price);
  const commissionRate = getCommissionRate(seller.rank) / 100;
  const commission = Math.round(price * commissionRate * 100) / 100;

  const preferenceItems = [{ title: order.title || 'Servicio personalizado', price }];
  const externalReference = `custom:${order.id}`;

  let preference = null;
  try {
    preference = await mpService.createSellerPreference(seller.mpAccessToken, {
      items: preferenceItems,
      externalReference,
      marketplaceFee: commission,
    });
  } catch (_mpError) {
    if (seller.mpRefreshToken) {
      try {
        const refreshed = await mpService.refreshAccessToken(seller.mpRefreshToken);
        await seller.update({
          mpAccessToken: refreshed.access_token,
          mpRefreshToken: refreshed.refresh_token || seller.mpRefreshToken,
        });
        preference = await mpService.createSellerPreference(refreshed.access_token, {
          items: preferenceItems,
          externalReference,
          marketplaceFee: commission,
        });
      } catch (refreshError) {
        console.error('MP custom order preference/refresh error:', refreshError.message);
      }
    }
  }

  if (!preference) {
    return next(
      new AppError('No pudimos iniciar el pago con Mercado Pago. Intentá de nuevo.', 502)
    );
  }

  await order.update({ mpPreferenceId: preference.id });

  res.status(200).json({
    status: 'success',
    preferenceId: preference.id,
    initPoint: preference.init_point,
  });
});

export const deliverOrder = catchAsync(async (req, res, next) => {
  const order = await customOrderService.findById(req.params.id);
  if (!order) {
    return next(new AppError('Pedido no encontrado.', 404));
  }
  if (order.sellerId !== req.sessionUser.id) {
    return next(new AppError('Solo el vendedor puede entregar este pedido.', 403));
  }
  if (!['paid', 'delivered'].includes(order.status)) {
    return next(new AppError('El pedido todavía no está pago.', 400));
  }
  if (!req.file) {
    return next(new AppError('Adjuntá el archivo final del diseño.', 422));
  }

  const { key } = await r2Storage.uploadPrivateFile(
    req.file.buffer,
    req.file.originalname,
    req.file.mimetype
  );

  const downloadToken = crypto.randomBytes(32).toString('hex');
  const downloadTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await order.update({
    fileKey: key,
    originalFileName: req.file.originalname,
    status: 'delivered',
    deliveredAt: new Date(),
    downloadToken,
    downloadTokenExpires,
  });

  const buyer = await User.findByPk(order.buyerId, { attributes: ['id', 'email'] });
  if (buyer?.email) {
    try {
      await mailService.sendCustomOrderDelivered(buyer.email, {
        title: order.title || 'Tu diseño personalizado',
        downloadUrl: `${appUrl}/pedido/${downloadToken}`,
        orderNumber: shortId(order.id),
      });
    } catch (mailError) {
      console.error('Error sending custom order email:', mailError);
    }
  }

  try {
    await notificationService.create({
      userId: order.buyerId,
      type: 'custom_order',
      title: '¡Tu diseño está listo!',
      message: `Ya podés descargar "${order.title || 'tu diseño personalizado'}".`,
    });
  } catch (_error) {
    // best-effort
  }

  if (order.conversationId) {
    try {
      await chatService.addSystemMessage(
        order.conversationId,
        req.sessionUser.id,
        `Pedido #${shortId(order.id)} entregado. El comprador ya puede descargar el archivo.`
      );
    } catch (_error) {
      // best-effort
    }
  }

  res.status(200).json({
    status: 'success',
    order: {
      id: order.id,
      status: order.status,
      originalFileName: order.originalFileName,
      deliveredAt: order.deliveredAt,
    },
  });
});

export const listMyOrders = catchAsync(async (req, res) => {
  const orders = await customOrderService.listForUser(req.sessionUser.id);
  res.status(200).json({ status: 'success', orders });
});

export const getOrder = catchAsync(async (req, res, next) => {
  const order = await customOrderService.findById(req.params.id);
  if (!order) {
    return next(new AppError('Pedido no encontrado.', 404));
  }
  const userId = req.sessionUser.id;
  if (order.buyerId !== userId && order.sellerId !== userId) {
    return next(new AppError('No tenés acceso a este pedido.', 403));
  }
  res.status(200).json({ status: 'success', order });
});

export const downloadOrder = catchAsync(async (req, res, next) => {
  const order = await customOrderService.findById(req.params.id);
  if (!order) {
    return next(new AppError('Pedido no encontrado.', 404));
  }
  if (order.buyerId !== req.sessionUser.id) {
    return next(new AppError('No tenés acceso a este pedido.', 403));
  }
  if (!order.fileKey) {
    return next(new AppError('El archivo todavía no está disponible.', 404));
  }

  const signedUrl = await r2Storage.getSignedDownloadUrl(order.fileKey, 3600);
  res.status(200).json({
    status: 'success',
    downloadUrl: signedUrl,
    fileName: order.originalFileName || 'diseno-personalizado.zip',
  });
});

export const downloadOrderByToken = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const order = await customOrderService.findByDownloadToken(token);
  if (!order) {
    return next(new AppError('El enlace de descarga no es válido o ya fue usado.', 400));
  }
  if (order.downloadTokenExpires && new Date() > order.downloadTokenExpires) {
    return next(new AppError('El enlace de descarga expiró. Pedí uno nuevo desde tu panel.', 400));
  }
  if (!order.fileKey) {
    return next(new AppError('El archivo todavía no está disponible.', 404));
  }

  const signedUrl = await r2Storage.getSignedDownloadUrl(order.fileKey, 3600);
  res.status(200).json({
    status: 'success',
    downloadUrl: signedUrl,
    fileName: order.originalFileName || 'diseno-personalizado.zip',
  });
});
