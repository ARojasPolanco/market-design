import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import User from '../auth/auth.model.js';
import Achievement from './achievement.model.js';

class SellerAchievement extends Model {}

SellerAchievement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'seller_achievements_id',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    achievementId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'achievement_id',
    },
    earnedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'earned_at',
    },
    grantedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'granted_by',
    },
  },
  {
    sequelize,
    modelName: 'SellerAchievement',
    tableName: 'seller_achievements',
    underscored: true,
    timestamps: false,
  }
);

SellerAchievement.belongsTo(Achievement, { foreignKey: 'achievement_id', as: 'achievement' });
SellerAchievement.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Achievement.hasMany(SellerAchievement, { foreignKey: 'achievement_id', as: 'grants' });

export default SellerAchievement;
