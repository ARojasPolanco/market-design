import Design from './design.model.js';
import User from '../auth/auth.model.js';
import { Op } from 'sequelize';
import sequelize from '../../config/database/database.js';

export class DesignService {
  async findAll(filters = {}) {
    const where = { isDeleted: false };

    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;
    if (filters.technique) where.technique = filters.technique;
    if (filters.sellerId) where.sellerId = filters.sellerId;

    if (filters.priceMin || filters.priceMax) {
      where.price = {};
      if (filters.priceMin) where.price[Op.gte] = filters.priceMin;
      if (filters.priceMax) where.price[Op.lte] = filters.priceMax;
    }

    if (filters.search) {
      where[Op.or] = [
        sequelize.where(
          sequelize.fn('LOWER', sequelize.col('title')),
          { [Op.like]: `%${filters.search.toLowerCase()}%` }
        ),
        sequelize.where(
          sequelize.fn('LOWER', sequelize.col('description')),
          { [Op.like]: `%${filters.search.toLowerCase()}%` }
        ),
      ];
    }

    const order = this._buildOrder(filters.sort);

    const { page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    const { rows, count } = await Design.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'fullname', 'username', 'storeName', 'avatarUrl', 'rank', 'isVerified', 'isTopSeller'],
        },
      ],
      order,
      limit,
      offset,
    });

    return {
      designs: rows,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / limit),
    };
  }

  async findById(id) {
    return await Design.findOne({
      where: { id, isDeleted: false },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'fullname', 'username', 'storeName', 'avatarUrl', 'rank', 'isVerified', 'isTopSeller', 'rating'],
        },
      ],
    });
  }

  async findBySeller(sellerId) {
    return await Design.findAll({
      where: { sellerId, isDeleted: false, status: 'approved' },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'fullname', 'username', 'storeName', 'avatarUrl', 'rank'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async create(data) {
    return await Design.create(data);
  }

  async update(id, data) {
    const design = await Design.findByPk(id);
    if (!design) return null;
    return await design.update(data);
  }

  async delete(id) {
    const design = await Design.findByPk(id);
    if (!design) return null;
    return await design.update({ isDeleted: true });
  }

  async incrementViewCount(id) {
    const design = await Design.findByPk(id);
    if (!design) return null;
    return await design.update({ viewCount: design.viewCount + 1 });
  }

  async approve(id, adminId) {
    const design = await Design.findByPk(id);
    if (!design) return null;
    return await design.update({
      status: 'approved',
      approvedAt: new Date(),
      approvedBy: adminId,
      rejectionReason: null,
    });
  }

  async reject(id, reason) {
    const design = await Design.findByPk(id);
    if (!design) return null;
    return await design.update({
      status: 'rejected',
      rejectionReason: reason,
    });
  }

  async findPending() {
    return await Design.findAll({
      where: { status: 'pending', isDeleted: false },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'fullname', 'username', 'storeName', 'avatarUrl'],
        },
      ],
      order: [['created_at', 'ASC']],
    });
  }

  async findFeatured(limit = 8) {
    return await Design.findAll({
      where: { status: 'approved', isDeleted: false },
      order: [['sales_count', 'DESC']],
      limit,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'fullname', 'username', 'storeName', 'avatarUrl', 'rank', 'isVerified'],
        },
      ],
    });
  }

  async findTrending(limit = 8) {
    return await Design.findAll({
      where: { status: 'approved', isDeleted: false },
      order: [['view_count', 'DESC']],
      limit,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'fullname', 'username', 'storeName', 'avatarUrl', 'rank', 'isVerified'],
        },
      ],
    });
  }

  _buildOrder(sort) {
    switch (sort) {
      case 'popular':
        return [['sales_count', 'DESC']];
      case 'trending':
        return [['view_count', 'DESC']];
      case 'rating':
        return [['rating_avg', 'DESC']];
      case 'price_asc':
        return [['price', 'ASC']];
      case 'price_desc':
        return [['price', 'DESC']];
      case 'recent':
      default:
        return [['created_at', 'DESC']];
    }
  }
}

export const designService = new DesignService();
