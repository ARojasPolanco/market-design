import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import User from '../auth/auth.model.js';

class CustomOrder extends Model {}

CustomOrder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'custom_orders_id',
    },
    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'buyer_id',
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'seller_id',
    },
    baseDesignId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'base_design_id',
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'conversation_id',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'requested',
    },
    mpPreferenceId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'mp_preference_id',
    },
    mpPaymentId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'mp_payment_id',
    },
    mpFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'mp_fee',
    },
    commission: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    fileKey: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'file_key',
    },
    originalFileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'original_file_name',
    },
    downloadToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'download_token',
    },
    downloadTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'download_token_expires',
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'delivered_at',
    },
  },
  {
    sequelize,
    modelName: 'CustomOrder',
    tableName: 'custom_orders',
    underscored: true,
  }
);

CustomOrder.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });
CustomOrder.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });

export default CustomOrder;
