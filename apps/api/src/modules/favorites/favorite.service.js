import Favorite from './favorite.model.js';
import Design from '../designs/design.model.js';
import User from '../auth/auth.model.js';

export class FavoriteService {
  async add(userId, designId) {
    const existing = await Favorite.findOne({ where: { userId, designId } });
    if (existing) return existing;
    return await Favorite.create({ userId, designId });
  }

  async remove(userId, designId) {
    const favorite = await Favorite.findOne({ where: { userId, designId } });
    if (!favorite) return null;
    await favorite.destroy();
    return true;
  }

  async findByUser(userId) {
    return await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Design,
          as: 'design',
          include: [
            { model: User, as: 'seller', attributes: ['id', 'fullname', 'username', 'storeName', 'avatarUrl', 'rank', 'isVerified'] },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async isFavorite(userId, designId) {
    const favorite = await Favorite.findOne({ where: { userId, designId } });
    return !!favorite;
  }
}

export const favoriteService = new FavoriteService();
