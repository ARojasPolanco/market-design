import { Op } from 'sequelize';
import CustomOrder from './customOrder.model.js';

export class CustomOrderService {
  async create(data) {
    return await CustomOrder.create(data);
  }

  async findById(id) {
    return await CustomOrder.findByPk(id);
  }

  async findByPaymentId(mpPaymentId) {
    return await CustomOrder.findOne({ where: { mpPaymentId } });
  }

  async findByDownloadToken(token) {
    return await CustomOrder.findOne({ where: { downloadToken: token } });
  }

  async update(order, data) {
    return await order.update(data);
  }

  async listForUser(userId) {
    return await CustomOrder.findAll({
      where: { [Op.or]: [{ buyerId: userId }, { sellerId: userId }] },
      order: [['created_at', 'DESC']],
    });
  }

  async findOpenByConversation(conversationId) {
    return await CustomOrder.findOne({
      where: {
        conversationId,
        status: { [Op.in]: ['requested', 'quoted', 'paid'] },
      },
      order: [['created_at', 'DESC']],
    });
  }

  async completePayment(id, mpPaymentId, mpFee) {
    const order = await CustomOrder.findByPk(id);
    if (!order) return null;
    if (order.status === 'paid' || order.status === 'delivered' || order.status === 'completed') {
      return order;
    }
    return await order.update({ status: 'paid', mpPaymentId, mpFee });
  }
}

export const customOrderService = new CustomOrderService();
