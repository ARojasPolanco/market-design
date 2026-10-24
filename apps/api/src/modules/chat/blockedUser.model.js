import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';

class BlockedUser extends Model {}

BlockedUser.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'blocked_users_id',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    blockedUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'blocked_user_id',
    },
  },
  {
    sequelize,
    modelName: 'BlockedUser',
    tableName: 'blocked_users',
    underscored: true,
    updatedAt: false,
  }
);

export default BlockedUser;
