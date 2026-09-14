import User from '../auth/auth.model.js';
import Design from '../designs/design.model.js';
import Purchase from '../purchases/purchase.model.js';
import { mailService } from '../../config/resend/resend.js';
import { Op } from 'sequelize';

const ROLLING_PERIOD_DAYS = 90;

export class BadgeService {
  async calculateRanks() {
    const sellers = await User.findAll({
      where: { role: 'seller', isDeleted: false },
    });

    const results = [];

    for (const seller of sellers) {
      const oldRank = seller.rank;

      // Skip manually assigned ranks (platino, diamante)
      if (['platino', 'diamante'].includes(seller.rank)) {
        results.push({ id: seller.id, name: seller.fullname, rank: seller.rank, changed: false });
        continue;
      }

      // Count sales in rolling period
      const salesCount = await Purchase.count({
        where: {
          status: 'completed',
          createdAt: {
            [Op.gte]: new Date(Date.now() - ROLLING_PERIOD_DAYS * 24 * 60 * 60 * 1000),
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

      // Determine rank based on sales
      let newRank = 'bronce';
      if (salesCount >= 200) newRank = 'oro';
      else if (salesCount >= 50) newRank = 'plata';

      if (newRank !== oldRank) {
        await seller.update({ rank: newRank });
        results.push({ id: seller.id, name: seller.fullname, oldRank, newRank, changed: true });

        // Send email notification
        try {
          const rankInfo = this._getRankInfo(newRank);
          await mailService.sendRankUpgrade(seller.email, rankInfo.name, rankInfo.commission);
        } catch (mailError) {
          console.error(`Error sending rank email to ${seller.email}:`, mailError);
        }
      } else {
        results.push({ id: seller.id, name: seller.fullname, rank: seller.rank, changed: false });
      }
    }

    return results;
  }

  async calculateBadges() {
    const sellers = await User.findAll({
      where: { role: 'seller', isDeleted: false },
    });

    const results = [];

    for (const seller of sellers) {
      const updates = {};

      // Check verified badge: email + MP + profile complete
      const isVerified = Boolean(
        seller.emailVerified &&
        seller.mpConnected &&
        seller.fullname &&
        seller.username &&
        (seller.storeName || seller.description)
      );

      if (isVerified !== seller.isVerified) {
        updates.isVerified = isVerified;
      }

      // Check top seller badge: X sales without disputes in 90 days
      const salesCount = await Purchase.count({
        where: {
          status: 'completed',
          createdAt: {
            [Op.gte]: new Date(Date.now() - ROLLING_PERIOD_DAYS * 24 * 60 * 60 * 1000),
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

      const isTopSeller = salesCount >= 50; // Threshold for top seller
      if (isTopSeller !== seller.isTopSeller) {
        updates.isTopSeller = isTopSeller;
      }

      if (Object.keys(updates).length > 0) {
        await seller.update(updates);
        results.push({
          id: seller.id,
          name: seller.fullname,
          updates,
        });
      }
    }

    return results;
  }

  async getSellerProgress(sellerId) {
    const seller = await User.findByPk(sellerId);
    if (!seller) return null;

    // Count sales in rolling period
    const salesCount = await Purchase.count({
      where: {
        status: 'completed',
        createdAt: {
          [Op.gte]: new Date(Date.now() - ROLLING_PERIOD_DAYS * 24 * 60 * 60 * 1000),
        },
      },
      include: [
        {
          model: Design,
          as: 'design',
          where: { sellerId },
          attributes: [],
        },
      ],
    });

    const rankInfo = this._getRankInfo(seller.rank);
    const nextRank = this._getNextRank(seller.rank);

    return {
      currentRank: seller.rank,
      currentCommission: rankInfo.commission,
      salesCount,
      isVerified: seller.isVerified,
      isTopSeller: seller.isTopSeller,
      nextRank: nextRank
        ? {
            name: nextRank.name,
            salesNeeded: nextRank.salesNeeded - salesCount,
            commission: nextRank.commission,
          }
        : null,
    };
  }

  _getRankInfo(rank) {
    const ranks = {
      bronce: { name: 'Bronce', commission: 20, salesNeeded: 0 },
      plata: { name: 'Plata', commission: 18, salesNeeded: 50 },
      oro: { name: 'Oro', commission: 15, salesNeeded: 200 },
      platino: { name: 'Platino', commission: 12, salesNeeded: 0 },
      diamante: { name: 'Diamante', commission: 10, salesNeeded: 0 },
    };
    return ranks[rank] || ranks.bronce;
  }

  _getNextRank(currentRank) {
    const progression = {
      bronce: { name: 'Plata', commission: 18, salesNeeded: 50 },
      plata: { name: 'Oro', commission: 15, salesNeeded: 200 },
      oro: null,
      platino: null,
      diamante: null,
    };
    return progression[currentRank] || null;
  }
}

export const badgeService = new BadgeService();
