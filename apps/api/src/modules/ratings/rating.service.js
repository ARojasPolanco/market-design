import Rating from './rating.model.js';
import User from '../auth/auth.model.js';
import Design from '../designs/design.model.js';

export class RatingService {
  async create(data) {
    const rating = await Rating.create(data);

    // Update design rating average
    const allRatings = await Rating.findAll({
      where: { designId: data.designId, isDeleted: false },
    });

    const avg = allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length;

    await Design.update(
      { ratingAvg: Math.round(avg * 100) / 100, ratingCount: allRatings.length },
      { where: { id: data.designId } }
    );

    return rating;
  }

  async findByDesign(designId) {
    return await Rating.findAll({
      where: { designId, isDeleted: false },
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'fullname', 'username', 'avatarUrl'] },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findByBuyer(buyerId) {
    return await Rating.findAll({
      where: { buyerId, isDeleted: false },
      include: [
        { model: Design, as: 'design', attributes: ['id', 'title', 'previewUrl'] },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findWithDesign(id) {
    return await Rating.findOne({
      where: { id, isDeleted: false },
      include: [{ model: Design, as: 'design', attributes: ['id', 'sellerId', 'title'] }],
    });
  }

  async reply(ratingId, sellerId, text) {
    const rating = await this.findWithDesign(ratingId);
    if (!rating) return { error: 'not_found' };
    if (rating.design?.sellerId !== sellerId) return { error: 'forbidden' };

    await rating.update({ sellerReply: text, sellerReplyAt: new Date() });
    return { rating };
  }

  async removeReply(ratingId, sellerId) {
    const rating = await this.findWithDesign(ratingId);
    if (!rating) return { error: 'not_found' };
    if (rating.design?.sellerId !== sellerId) return { error: 'forbidden' };

    await rating.update({ sellerReply: null, sellerReplyAt: null });
    return { rating };
  }

  async hasRated(purchaseId) {
    const rating = await Rating.findOne({
      where: { purchaseId, isDeleted: false },
    });
    return !!rating;
  }

  async delete(id) {
    const rating = await Rating.findByPk(id);
    if (!rating) return null;
    return await rating.update({ isDeleted: true });
  }
}

export const ratingService = new RatingService();
