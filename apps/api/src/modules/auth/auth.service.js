import User from './auth.model.js';
import { Op } from 'sequelize';

export class AuthService {
  async findAll(filters = {}) {
    const where = { isDeleted: false };
    if (filters.role) where.role = filters.role;
    if (filters.search) {
      where[Op.or] = [
        { fullname: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } },
        { username: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }
    return await User.findAll({ where, attributes: { exclude: ['password'] } });
  }

  async findOneByEmail(email) {
    return await User.findOne({ where: { email, isDeleted: false } });
  }

  async findOneByUsername(username) {
    return await User.findOne({ where: { username, isDeleted: false } });
  }

  async findOneById(id) {
    return await User.findByPk(id, { attributes: { exclude: ['password'] } });
  }

  async findByVerificationToken(token) {
    return await User.findOne({ where: { emailVerificationToken: token } });
  }

  async create(data) {
    return await User.create(data);
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update({ isDeleted: true });
  }
}

export const authService = new AuthService();
