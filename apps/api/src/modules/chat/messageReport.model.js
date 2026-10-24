import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import Message from './message.model.js';

class MessageReport extends Model {}

MessageReport.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'message_reports_id',
    },
    messageId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'message_id',
    },
    reporterId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'reporter_id',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'MessageReport',
    tableName: 'message_reports',
    underscored: true,
    updatedAt: false,
  }
);

MessageReport.belongsTo(Message, { foreignKey: 'message_id', as: 'message' });

export default MessageReport;
