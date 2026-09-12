import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import User from '../auth/auth.model.js';
import Design from '../designs/design.model.js';

class ModerationLog extends Model {}

ModerationLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'moderation_logs_id',
    },
    designId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'design_id',
    },
    adminId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'admin_id',
    },
    action: {
      type: DataTypes.ENUM('approved', 'rejected'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ModerationLog',
    tableName: 'moderation_logs',
    underscored: true,
    timestamps: true,
    updatedAt: false,
  }
);

ModerationLog.belongsTo(User, { foreignKey: 'admin_id', as: 'admin' });
ModerationLog.belongsTo(Design, { foreignKey: 'design_id', as: 'design' });

export default ModerationLog;
