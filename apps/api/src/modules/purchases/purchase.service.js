import Purchase from './purchase.model.js';
import Design from '../designs/design.model.js';
import User from '../auth/auth.model.js';
import crypto from 'crypto';

export class PurchaseService {
  async create(data) {
    return await Purchase.create(data);
  }

  async findById(id) {
    return await Purchase.findOne({
      where: { id },
      include: [
        {
          model: Design,
          as: 'design',
          include: [{ model: User, as: 'seller', attributes: ['id', 'fullname', 'username', 'storeName'] }],
        },
        { model: User, as: 'buyer', attributes: ['id', 'fullname', 'username', 'email'] },
      ],
    });
  }

  async findByMpPaymentId(mpPaymentId) {
    return await Purchase.findOne({
      where: { mpPaymentId },
      include: [
        {
          model: Design,
          as: 'design',
          include: [{ model: User, as: 'seller', attributes: ['id', 'fullname', 'username', 'email'] }],
        },
        { model: User, as: 'buyer', attributes: ['id', 'fullname', 'username', 'email'] },
      ],
    });
  }

  async findByBuyer(buyerId) {
    return await Purchase.findAll({
      where: { buyerId, status: 'completed' },
      include: [
        {
          model: Design,
          as: 'design',
          include: [{ model: User, as: 'seller', attributes: ['id', 'fullname', 'username', 'storeName', 'avatarUrl'] }],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findBySeller(sellerId) {
    return await Purchase.findAll({
      where: { status: 'completed' },
      include: [
        {
          model: Design,
          as: 'design',
          where: { sellerId },
          attributes: ['id', 'title', 'price'],
        },
        { model: User, as: 'buyer', attributes: ['id', 'fullname', 'username'] },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async completePurchase(id, mpPaymentId) {
    const purchase = await Purchase.findByPk(id);
    if (!purchase) return null;

    const downloadToken = crypto.randomBytes(32).toString('hex');
    const downloadTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    return await purchase.update({
      status: 'completed',
      mpPaymentId,
      downloadToken,
      downloadTokenExpires,
    });
  }

  async incrementDownload(id) {
    const purchase = await Purchase.findByPk(id);
    if (!purchase) return null;

    const downloadToken = crypto.randomBytes(32).toString('hex');
    const downloadTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return await purchase.update({
      downloadCount: purchase.downloadCount + 1,
      lastDownloadAt: new Date(),
      downloadToken,
      downloadTokenExpires,
    });
  }

  async findByDownloadToken(token) {
    return await Purchase.findOne({
      where: { downloadToken: token, status: 'completed' },
      include: [
        {
          model: Design,
          as: 'design',
          include: [{ model: User, as: 'seller', attributes: ['id', 'fullname', 'username'] }],
        },
        { model: User, as: 'buyer', attributes: ['id', 'fullname', 'username', 'email'] },
      ],
    });
  }

  async hasPurchased(buyerId, designId) {
    const purchase = await Purchase.findOne({
      where: { buyerId, designId, status: ['pending', 'completed'] },
    });
    return !!purchase;
  }

  async getPurchaseForRating(buyerId, designId) {
    return await Purchase.findOne({
      where: { buyerId, designId, status: 'completed' },
    });
  }
}

export const purchaseService = new PurchaseService();
