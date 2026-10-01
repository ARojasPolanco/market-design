import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';

class Achievement extends Model {}

Achievement.init(
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    criterion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('manual', 'auto'),
      allowNull: false,
      defaultValue: 'manual',
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
  },
  {
    sequelize,
    modelName: 'Achievement',
    tableName: 'achievements',
    underscored: true,
    timestamps: false,
  }
);

export default Achievement;
