import Notification from './notification.model.js';

export class NotificationService {
  async create(data) {
    return await Notification.create(data);
  }

  async findByUser(userId, unreadOnly = false) {
    const where = { userId };
    if (unreadOnly) where.isRead = false;

    return await Notification.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: 50,
    });
  }

  async countUnread(userId) {
    return await Notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id) {
    const notification = await Notification.findByPk(id);
    if (!notification) return null;
    return await notification.update({ isRead: true });
  }

  async markAllAsRead(userId) {
    return await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
  }
}

export const notificationService = new NotificationService();
