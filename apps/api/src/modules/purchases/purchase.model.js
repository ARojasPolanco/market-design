import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import User from '../auth/auth.model.js';
import Design from '../designs/design.model.js';

class Purchase extends Model {}

Purchase.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'purchases_id',
    },
    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'buyer_id',
    },
    designId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'design_id',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    commission: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sellerEarnings: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'seller_earnings',
    },
    mpPaymentId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'mp_payment_id',
    },
    mpPreferenceId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'mp_preference_id',
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'refunded'),
      defaultValue: 'pending',
      allowNull: false,
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'download_count',
    },
    lastDownloadAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_download_at',
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
  },
  {
    sequelize,
    modelName: 'Purchase',
    tableName: 'purchases',
    underscored: true,
  }
);

// Associations
Purchase.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });
Purchase.belongsTo(Design, { foreignKey: 'design_id', as: 'design' });
User.hasMany(Purchase, { foreignKey: 'buyer_id', as: 'purchases' });
Design.hasMany(Purchase, { foreignKey: 'design_id', as: 'purchases' });

export default Purchase;
