import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import User from '../auth/auth.model.js';

class Conversation extends Model {}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'conversations_id',
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'buyer_seller',
    },
    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'buyer_id',
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'seller_id',
    },
    designId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'design_id',
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_message_at',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'open',
    },
  },
  {
    sequelize,
    modelName: 'Conversation',
    tableName: 'conversations',
    underscored: true,
  }
);

Conversation.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });
Conversation.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });

export default Conversation;
