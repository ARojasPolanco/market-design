import ModerationLog from './moderation.model.js';
import Config from './config.model.js';
import Report from '../reports/report.model.js';
import Design from '../designs/design.model.js';
import User from '../auth/auth.model.js';
import Purchase from '../purchases/purchase.model.js';
import { Op } from 'sequelize';

export class AdminService {
  // Moderation
  async approveDesign(designId, adminId) {
    const design = await Design.findByPk(designId);
    if (!design) return null;

    await design.update({
      status: 'approved',
      approvedAt: new Date(),
      approvedBy: adminId,
      rejectionReason: null,
    });

    await ModerationLog.create({
      designId,
      adminId,
      action: 'approved',
    });

    return design;
  }

  async rejectDesign(designId, adminId, reason) {
    const design = await Design.findByPk(designId);
    if (!design) return null;

    await design.update({
      status: 'rejected',
      rejectionReason: reason,
    });

    await ModerationLog.create({
      designId,
      adminId,
      action: 'rejected',
      reason,
    });

    return design;
  }

  async getPendingDesigns() {
    return await Design.findAll({
      where: { status: 'pending', isDeleted: false },
      include: [
        { model: User, as: 'seller', attributes: ['id', 'fullname', 'username', 'storeName', 'avatarUrl', 'rank'] },
      ],
      order: [['created_at', 'ASC']],
    });
  }

  async getModerationLogs(designId) {
    return await ModerationLog.findAll({
      where: { designId },
      include: [
        { model: User, as: 'admin', attributes: ['id', 'fullname', 'username'] },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  // Config
  async getConfig(key) {
    const config = await Config.findOne({ where: { key } });
    return config ? config.value : null;
  }

  async getAllConfig() {
    const configs = await Config.findAll();
    return configs.reduce((acc, c) => {
      acc[c.key] = c.value;
      return acc;
    }, {});
  }

  async updateConfig(key, value) {
    const config = await Config.findOne({ where: { key } });
    if (config) {
      return await config.update({ value, updatedAt: new Date() });
    }
    return await Config.create({ key, value });
  }

  // Reports
  async createReport(designId, reporterId, reason) {
    return await Report.create({ designId, reporterId, reason });
  }

  async getReports(status = null) {
    const where = {};
    if (status) where.status = status;

    return await Report.findAll({
      where,
      include: [
        {
          model: Design,
          as: 'design',
          include: [
            { model: User, as: 'seller', attributes: ['id', 'fullname', 'username'] },
          ],
        },
        { model: User, as: 'reporter', attributes: ['id', 'fullname', 'username'] },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async reviewReport(reportId, status) {
    const report = await Report.findByPk(reportId);
    if (!report) return null;
    return await report.update({ status, updatedAt: new Date() });
  }

  // Stats
  async getStats() {
    const [totalUsers, totalDesigns, pendingDesigns, totalPurchases, totalRevenue] = await Promise.all([
      User.count({ where: { isDeleted: false } }),
      Design.count({ where: { isDeleted: false } }),
      Design.count({ where: { status: 'pending', isDeleted: false } }),
      Purchase.count({ where: { status: 'completed' } }),
      Purchase.sum('commission', { where: { status: 'completed' } }),
    ]);

    return {
      totalUsers,
      totalDesigns,
      pendingDesigns,
      totalPurchases,
      totalRevenue: totalRevenue || 0,
    };
  }

  // Users
  async getUsers(filters = {}) {
    const where = { isDeleted: false };

    if (filters.role) where.role = filters.role;
    if (filters.search) {
      where[Op.or] = [
        { fullname: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } },
        { username: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    const { page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return { users: rows, total: count, page: Number(page), totalPages: Math.ceil(count / limit) };
  }

  async suspendUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) return null;
    return await user.update({ status: user.status === 'suspended' ? 'active' : 'suspended' });
  }

  async updateUserRank(userId, rank) {
    const user = await User.findByPk(userId);
    if (!user) return null;
    return await user.update({ rank });
  }

  // Auto rank calculation
  async calculateRanks() {
    const sellers = await User.findAll({
      where: { role: 'seller', isDeleted: false },
    });

    for (const seller of sellers) {
      // Skip manually assigned ranks (platino, diamante)
      if (['platino', 'diamante'].includes(seller.rank)) continue;

      // Count sales in last 90 days
      const salesCount = await Purchase.count({
        where: {
          status: 'completed',
          createdAt: {
            [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          },
        },
        include: [
          {
            model: Design,
            as: 'design',
            where: { sellerId: seller.id },
            attributes: [],
          },
        ],
      });

      let newRank = 'bronce';
      if (salesCount >= 200) newRank = 'oro';
      else if (salesCount >= 50) newRank = 'plata';

      if (newRank !== seller.rank) {
        await seller.update({ rank: newRank });
      }
    }
  }
}

export const adminService = new AdminService();
