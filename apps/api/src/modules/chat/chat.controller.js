import { chatService } from './chat.service.js';
import {
  validateCreateConversation,
  validateSendMessage,
  validateReportMessage,
} from './chat.schema.js';
import User from '../auth/auth.model.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';

export const createConversation = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateCreateConversation(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const userId = req.sessionUser.id;

  if (data.type === 'support') {
    if (req.sessionUser.role === 'admin') {
      return next(
        new AppError('El soporte lo responden los admins desde el panel de administración.', 400)
      );
    }

    const conversation = await chatService.findOrCreateConversation({
      type: 'support',
      buyerId: userId,
    });
    return res.status(200).json({ status: 'success', conversation });
  }

  if (!data.sellerId) {
    return next(new AppError('Indicá el vendedor con el que querés hablar.', 422));
  }
  if (data.sellerId === userId) {
    return next(new AppError('No podés iniciar una conversación con vos mismo.', 400));
  }

  const seller = await User.findByPk(data.sellerId, { attributes: ['id', 'role'] });
  if (!seller || seller.role !== 'seller') {
    return next(new AppError('El vendedor indicado no existe.', 404));
  }

  const conversation = await chatService.findOrCreateConversation({
    type: 'buyer_seller',
    buyerId: userId,
    sellerId: data.sellerId,
    designId: data.designId,
  });

  res.status(201).json({ status: 'success', conversation });
});

export const listConversations = catchAsync(async (req, res) => {
  const conversations = await chatService.findAllForUser(req.sessionUser.id);
  res.status(200).json({ status: 'success', conversations });
});

export const getMessages = catchAsync(async (req, res, next) => {
  const conversation = await chatService.findConversation(req.params.id);
  if (!conversation) {
    return next(new AppError('Conversación no encontrada.', 404));
  }
  if (!chatService.isParticipant(conversation, req.sessionUser.id)) {
    return next(new AppError('No tenés acceso a esta conversación.', 403));
  }

  const messages = await chatService.getMessages(conversation.id, {
    after: req.query.after,
  });

  res.status(200).json({ status: 'success', conversation, messages });
});

export const sendMessage = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateSendMessage(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const conversation = await chatService.findConversation(req.params.id);
  if (!conversation) {
    return next(new AppError('Conversación no encontrada.', 404));
  }

  const userId = req.sessionUser.id;
  if (!chatService.isParticipant(conversation, userId)) {
    return next(new AppError('No tenés acceso a esta conversación.', 403));
  }

  const otherId = conversation.buyerId === userId ? conversation.sellerId : conversation.buyerId;

  if (otherId) {
    const [iBlocked, theyBlocked] = await Promise.all([
      chatService.isBlocked(userId, otherId),
      chatService.isBlocked(otherId, userId),
    ]);
    if (iBlocked || theyBlocked) {
      return next(new AppError('No podés enviar mensajes en esta conversación.', 403));
    }
  }

  const message = await chatService.addMessage({
    conversationId: conversation.id,
    senderId: userId,
    body: data.body,
  });

  res.status(201).json({ status: 'success', message });
});

export const markRead = catchAsync(async (req, res, next) => {
  const conversation = await chatService.findConversation(req.params.id);
  if (!conversation) {
    return next(new AppError('Conversación no encontrada.', 404));
  }
  if (!chatService.isParticipant(conversation, req.sessionUser.id)) {
    return next(new AppError('No tenés acceso a esta conversación.', 403));
  }

  await chatService.markRead(conversation.id, req.sessionUser.id);
  res.status(200).json({ status: 'success' });
});

export const reportMessage = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateReportMessage(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const message = await chatService.findMessage(req.params.id);
  if (!message) {
    return next(new AppError('Mensaje no encontrado.', 404));
  }

  const conversation = await chatService.findConversation(message.conversationId);
  if (!conversation || !chatService.isParticipant(conversation, req.sessionUser.id)) {
    return next(new AppError('No tenés acceso a este mensaje.', 403));
  }
  if (message.senderId === req.sessionUser.id) {
    return next(new AppError('No podés reportar tu propio mensaje.', 400));
  }

  await chatService.reportMessage({
    messageId: message.id,
    reporterId: req.sessionUser.id,
    reason: data.reason,
  });

  res.status(201).json({ status: 'success', message: 'Reporte enviado. Gracias.' });
});

export const blockUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (id === req.sessionUser.id) {
    return next(new AppError('No podés bloquearte a vos mismo.', 400));
  }
  await chatService.blockUser(req.sessionUser.id, id);
  res.status(200).json({ status: 'success', message: 'Usuario bloqueado.' });
});

export const unblockUser = catchAsync(async (req, res) => {
  await chatService.unblockUser(req.sessionUser.id, req.params.id);
  res.status(200).json({ status: 'success', message: 'Usuario desbloqueado.' });
});

// ---- Admin ----

export const adminListConversations = catchAsync(async (req, res) => {
  const conversations = await chatService.findAllForAdmin({
    type: req.query.type,
    userId: req.query.userId,
  });
  res.status(200).json({ status: 'success', conversations });
});

export const adminGetMessages = catchAsync(async (req, res, next) => {
  const conversation = await chatService.findConversation(req.params.id);
  if (!conversation) {
    return next(new AppError('Conversación no encontrada.', 404));
  }

  await chatService.logAccess(conversation.id, req.sessionUser.id);
  const messages = await chatService.getMessages(conversation.id);

  res.status(200).json({ status: 'success', conversation, messages });
});

export const adminListReports = catchAsync(async (req, res) => {
  const reports = await chatService.findReports(req.query.status || 'pending');
  res.status(200).json({ status: 'success', reports });
});

export const adminResolveReport = catchAsync(async (req, res) => {
  const report = await chatService.resolveReport(req.params.id);
  res.status(200).json({ status: 'success', report });
});

export const adminReply = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateSendMessage(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const conversation = await chatService.findConversation(req.params.id);
  if (!conversation) {
    return next(new AppError('Conversación no encontrada.', 404));
  }
  if (conversation.type !== 'support') {
    return next(new AppError('Los admins solo pueden responder conversaciones de soporte.', 403));
  }

  await chatService.logAccess(conversation.id, req.sessionUser.id);

  const message = await chatService.addMessage({
    conversationId: conversation.id,
    senderId: req.sessionUser.id,
    body: data.body,
  });

  res.status(201).json({ status: 'success', message });
});
