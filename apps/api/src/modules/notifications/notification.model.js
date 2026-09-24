import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import User from '../auth/auth.model.js';

class Notification extends Model {}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'notifications_id',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    designId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'design_id',
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_read',
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    underscored: true,
  }
);

Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

export default Notification;
