import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import User from '../auth/auth.model.js';
import Conversation from './conversation.model.js';

class ConversationAccessLog extends Model {}

ConversationAccessLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'conversation_access_logs_id',
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'conversation_id',
    },
    adminId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'admin_id',
    },
    accessedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'accessed_at',
    },
  },
  {
    sequelize,
    modelName: 'ConversationAccessLog',
    tableName: 'conversation_access_logs',
    underscored: true,
    timestamps: false,
  }
);

ConversationAccessLog.belongsTo(Conversation, {
  foreignKey: 'conversation_id',
  as: 'conversation',
});
ConversationAccessLog.belongsTo(User, { foreignKey: 'admin_id', as: 'admin' });

export default ConversationAccessLog;
