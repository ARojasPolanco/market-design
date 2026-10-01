import { Op } from 'sequelize';
import Achievement from './achievement.model.js';
import SellerAchievement from './sellerAchievement.model.js';
import User from '../auth/auth.model.js';
import Design from '../designs/design.model.js';
import Purchase from '../purchases/purchase.model.js';
import Report from '../reports/report.model.js';

const LEGEND_ID = 'leyenda';
const AUTO_IDS = ['racha_activa', 'cero_disputas', 'siempre_creando', 'cero_rechazos'];

const RACHA_WINDOW_DAYS = 14;
const RACHA_MIN_SALES = 4;
const RACHA_MAX_GAP_DAYS = 3;
const CERO_DISPUTAS_MIN_SALES = 20;
const SIEMPRE_CREANDO_MONTHS = 3;
const CERO_RECHAZOS_MIN_DESIGNS = 5;

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);
const monthKey = (date) => new Date(date).toISOString().slice(0, 7);

export class AchievementService {
  async getCatalog() {
    return await Achievement.findAll({ order: [['sort_order', 'ASC']] });
  }

  async getUserAchievements(userId) {
    const [catalog, owned] = await Promise.all([
      this.getCatalog(),
      SellerAchievement.findAll({ where: { userId } }),
    ]);

    const ownedMap = new Map(owned.map((o) => [o.achievementId, o]));

    return catalog.map((a) => {
      const grant = ownedMap.get(a.id);
      const data = a.toJSON();
      return {
        ...data,
        earned: Boolean(grant),
        earnedAt: grant ? grant.earnedAt : null,
      };
    });
  }

  async _countSales(sellerId) {
    return await Purchase.count({
      where: { status: 'completed' },
      include: [{ model: Design, as: 'design', where: { sellerId }, attributes: [] }],
    });
  }

  async _countReports(sellerId) {
    return await Report.count({
      include: [{ model: Design, as: 'design', where: { sellerId }, attributes: [] }],
    });
  }

  async _meetsRachaActiva(sellerId) {
    const since = new Date(Date.now() - RACHA_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const purchases = await Purchase.findAll({
      where: { status: 'completed', createdAt: { [Op.gte]: since } },
      include: [{ model: Design, as: 'design', where: { sellerId }, attributes: [] }],
      attributes: ['createdAt'],
      order: [['created_at', 'ASC']],
    });

    if (purchases.length < RACHA_MIN_SALES) return false;

    const days = [...new Set(purchases.map((p) => dayKey(p.createdAt)))].sort();
    for (let i = 1; i < days.length; i += 1) {
      const gap = (new Date(days[i]) - new Date(days[i - 1])) / (24 * 60 * 60 * 1000);
      if (gap > RACHA_MAX_GAP_DAYS) return false;
    }
    return true;
  }

  async _meetsCeroDisputas(sellerId) {
    const [sales, reports] = await Promise.all([
      this._countSales(sellerId),
      this._countReports(sellerId),
    ]);
    return sales >= CERO_DISPUTAS_MIN_SALES && reports === 0;
  }

  async _meetsSiempreCreando(sellerId) {
    const designs = await Design.findAll({
      where: { sellerId, status: 'approved', approvedAt: { [Op.ne]: null } },
      attributes: ['approvedAt'],
    });

    const months = new Set(designs.map((d) => monthKey(d.approvedAt)));
    const now = new Date();
    for (let i = 0; i < SIEMPRE_CREANDO_MONTHS; i += 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      if (!months.has(monthKey(d))) return false;
    }
    return true;
  }

  async _meetsCeroRechazos(sellerId) {
    const [total, rejected] = await Promise.all([
      Design.count({ where: { sellerId, isDeleted: false } }),
      Design.count({ where: { sellerId, status: 'rejected' } }),
    ]);
    return total >= CERO_RECHAZOS_MIN_DESIGNS && rejected === 0;
  }

  async _ruleFor(id, sellerId) {
    switch (id) {
      case 'racha_activa':
        return this._meetsRachaActiva(sellerId);
      case 'cero_disputas':
        return this._meetsCeroDisputas(sellerId);
      case 'siempre_creando':
        return this._meetsSiempreCreando(sellerId);
      case 'cero_rechazos':
        return this._meetsCeroRechazos(sellerId);
      default:
        return false;
    }
  }

  async grant(userId, achievementId, grantedBy = null) {
    const achievement = await Achievement.findByPk(achievementId);
    if (!achievement) return { granted: false, reason: 'not_found' };

    const [, created] = await SellerAchievement.findOrCreate({
      where: { userId, achievementId },
      defaults: { userId, achievementId, grantedBy, earnedAt: new Date() },
    });

    if (created) {
      await this._checkLegend(userId);
    }

    return { granted: created, achievement: achievement.toJSON() };
  }

  async revoke(userId, achievementId) {
    const deleted = await SellerAchievement.destroy({ where: { userId, achievementId } });
    if (deleted > 0 && achievementId !== LEGEND_ID) {
      await this._checkLegend(userId);
    }
    return { revoked: deleted > 0 };
  }

  async _checkLegend(userId) {
    const owned = await SellerAchievement.count({
      where: { userId, achievementId: { [Op.ne]: LEGEND_ID } },
    });
    if (owned >= 9) {
      await SellerAchievement.findOrCreate({
        where: { userId, achievementId: LEGEND_ID },
        defaults: { userId, achievementId: LEGEND_ID, earnedAt: new Date() },
      });
    }
  }

  async evaluateAutomatic(userId) {
    const grantedIds = [];
    for (const id of AUTO_IDS) {
      const already = await SellerAchievement.findOne({ where: { userId, achievementId: id } });
      if (already) continue;
      const meets = await this._ruleFor(id, userId);
      if (meets) {
        const { granted } = await this.grant(userId, id);
        if (granted) grantedIds.push(id);
      }
    }
    await this._checkLegend(userId);
    return grantedIds;
  }

  async recalculateAll() {
    const sellers = await User.findAll({ where: { role: 'seller', isDeleted: false }, attributes: ['id'] });
    const summary = [];
    for (const seller of sellers) {
      const granted = await this.evaluateAutomatic(seller.id);
      if (granted.length > 0) summary.push({ userId: seller.id, granted });
    }
    return summary;
  }
}

export const achievementService = new AchievementService();
