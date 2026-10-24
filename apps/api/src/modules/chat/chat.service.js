import { Op } from 'sequelize';
import Conversation from './conversation.model.js';
import Message from './message.model.js';
import MessageReport from './messageReport.model.js';
import BlockedUser from './blockedUser.model.js';
import ConversationAccessLog from './conversationAccessLog.model.js';
import User from '../auth/auth.model.js';

const PUBLIC_USER_ATTRS = ['id', 'fullname', 'username', 'storeName', 'avatarUrl', 'rank', 'role'];

export class ChatService {
  async findOrCreateConversation({ type = 'buyer_seller', buyerId, sellerId, designId }) {
    const where = { type, buyerId };

    if (type === 'support') {
      where.sellerId = null;
      where.designId = null;
    } else {
      where.sellerId = sellerId;
      where.designId = designId || null;
    }

    const existing = await Conversation.findOne({ where });
    if (existing) return existing;

    return await Conversation.create({
      type,
      buyerId,
      sellerId: type === 'support' ? null : sellerId,
      designId: type === 'support' ? null : designId || null,
    });
  }

  async findConversation(id) {
    return await Conversation.findByPk(id, {
      include: [
        { model: User, as: 'buyer', attributes: PUBLIC_USER_ATTRS },
        { model: User, as: 'seller', attributes: PUBLIC_USER_ATTRS },
      ],
    });
  }

  isParticipant(conversation, userId) {
    return conversation.buyerId === userId || conversation.sellerId === userId;
  }

  async findAllForUser(userId) {
    const conversations = await Conversation.findAll({
      where: { [Op.or]: [{ buyerId: userId }, { sellerId: userId }] },
      include: [
        { model: User, as: 'buyer', attributes: PUBLIC_USER_ATTRS },
        { model: User, as: 'seller', attributes: PUBLIC_USER_ATTRS },
      ],
      order: [
        ['last_message_at', 'DESC'],
        ['created_at', 'DESC'],
      ],
    });

    return await Promise.all(
      conversations.map(async (conversation) => {
        const [lastMessage, unreadCount] = await Promise.all([
          Message.findOne({
            where: { conversationId: conversation.id },
            order: [['created_at', 'DESC']],
          }),
          Message.count({
            where: {
              conversationId: conversation.id,
              senderId: { [Op.ne]: userId },
              readAt: null,
            },
          }),
        ]);

        const data = conversation.toJSON();
        return {
          ...data,
          lastMessage: lastMessage ? lastMessage.toJSON() : null,
          unreadCount,
        };
      })
    );
  }

  async getMessages(conversationId, { after } = {}) {
    const where = { conversationId };
    if (after) where.createdAt = { [Op.gt]: new Date(after) };

    return await Message.findAll({
      where,
      include: [{ model: User, as: 'sender', attributes: PUBLIC_USER_ATTRS }],
      order: [['created_at', 'ASC']],
    });
  }

  async addMessage({ conversationId, senderId, body, isSystem = false }) {
    const message = await Message.create({ conversationId, senderId, body, isSystem });

    await Conversation.update({ lastMessageAt: new Date() }, { where: { id: conversationId } });

    return message;
  }

  async addSystemMessage(conversationId, senderId, body) {
    return await this.addMessage({ conversationId, senderId, body, isSystem: true });
  }

  async markRead(conversationId, userId) {
    await Message.update(
      { readAt: new Date() },
      {
        where: {
          conversationId,
          senderId: { [Op.ne]: userId },
          readAt: null,
        },
      }
    );
  }

  async isBlocked(userId, blockedUserId) {
    const row = await BlockedUser.findOne({ where: { userId, blockedUserId } });
    return Boolean(row);
  }

  async blockUser(userId, blockedUserId) {
    return await BlockedUser.findOrCreate({ where: { userId, blockedUserId } });
  }

  async unblockUser(userId, blockedUserId) {
    return await BlockedUser.destroy({ where: { userId, blockedUserId } });
  }

  async findMessage(id) {
    return await Message.findByPk(id);
  }

  async reportMessage({ messageId, reporterId, reason }) {
    return await MessageReport.create({ messageId, reporterId, reason });
  }

  async logAccess(conversationId, adminId) {
    return await ConversationAccessLog.create({ conversationId, adminId });
  }

  async countUnreadSupportMessages() {
    return await Message.count({
      where: { readAt: null },
      include: [
        {
          model: Conversation,
          as: 'conversation',
          where: { type: 'support' },
          attributes: [],
        },
        {
          model: User,
          as: 'sender',
          where: { role: { [Op.ne]: 'admin' } },
          attributes: [],
        },
      ],
    });
  }

  async findAllForAdmin({ type, userId } = {}) {
    const where = {};
    if (type) where.type = type;
    if (userId) where[Op.or] = [{ buyerId: userId }, { sellerId: userId }];

    return await Conversation.findAll({
      where,
      include: [
        { model: User, as: 'buyer', attributes: PUBLIC_USER_ATTRS },
        { model: User, as: 'seller', attributes: PUBLIC_USER_ATTRS },
      ],
      order: [
        ['last_message_at', 'DESC'],
        ['created_at', 'DESC'],
      ],
      limit: 100,
    });
  }

  async findReports(status = 'pending') {
    const where = {};
    if (status) where.status = status;

    return await MessageReport.findAll({
      where,
      include: [
        {
          model: Message,
          as: 'message',
          include: [{ model: User, as: 'sender', attributes: PUBLIC_USER_ATTRS }],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 100,
    });
  }

  async resolveReport(id) {
    const report = await MessageReport.findByPk(id);
    if (!report) return null;
    await report.update({ status: 'resolved' });
    return report;
  }
}

export const chatService = new ChatService();
