import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';

class Config extends Model {}

Config.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Config',
    tableName: 'config',
    underscored: true,
    updatedAt: 'updated_at',
    createdAt: false,
  }
);

export default Config;
