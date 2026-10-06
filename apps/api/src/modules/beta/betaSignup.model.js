import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';

class BetaSignup extends Model {}

BetaSignup.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'beta_signups_id',
    },
    fullname: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    whatsapp: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    slotKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'slot_key',
    },
    utmSource: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: 'utm_source',
    },
    utmMedium: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: 'utm_medium',
    },
    utmCampaign: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: 'utm_campaign',
    },
  },
  {
    sequelize,
    modelName: 'BetaSignup',
    tableName: 'beta_signups',
    underscored: true,
  }
);

export default BetaSignup;
