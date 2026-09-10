import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import User from '../auth/auth.model.js';

class Design extends Model {}

Design.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'designs_id',
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'seller_id',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('sublimado', 'estampado', 'papeleria', 'infantil', 'deportivo', 'religioso', 'otro'),
      allowNull: false,
    },
    categorySuggested: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'category_suggested',
    },
    technique: {
      type: DataTypes.ENUM('sublimado', 'estampado', 'vinilo', 'dtf', 'otro'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'rejection_reason',
    },
    previewUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'preview_url',
    },
    previewKey: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'preview_key',
    },
    originalFileKey: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'original_file_key',
    },
    originalFileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'original_file_name',
    },
    originalFileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'original_file_size',
    },
    fileFormat: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'file_format',
    },
    dpi: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'view_count',
    },
    salesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sales_count',
    },
    ratingAvg: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      field: 'rating_avg',
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'rating_count',
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_deleted',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'approved_at',
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'approved_by',
    },
  },
  {
    sequelize,
    modelName: 'Design',
    tableName: 'designs',
    underscored: true,
  }
);

// Associations
Design.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });
User.hasMany(Design, { foreignKey: 'seller_id', as: 'designs' });

export default Design;
