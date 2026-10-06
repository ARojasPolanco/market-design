import BetaSignup from './betaSignup.model.js';

export class BetaService {
  async create(data) {
    return await BetaSignup.create(data);
  }

  async findByEmail(email) {
    return await BetaSignup.findOne({ where: { email } });
  }

  async countBySlot(slotKey) {
    return await BetaSignup.count({ where: { slotKey } });
  }

  async findAll() {
    return await BetaSignup.findAll({ order: [['created_at', 'DESC']] });
  }
}

export const betaService = new BetaService();
