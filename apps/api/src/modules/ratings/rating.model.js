import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import User from '../auth/auth.model.js';
import Design from '../designs/design.model.js';
import Purchase from '../purchases/purchase.model.js';

class Rating extends Model {}

Rating.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'ratings_id',
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
    purchaseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'purchase_id',
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_deleted',
    },
  },
  {
    sequelize,
    modelName: 'Rating',
    tableName: 'ratings',
    underscored: true,
  }
);

// Associations
Rating.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });
Rating.belongsTo(Design, { foreignKey: 'design_id', as: 'design' });
Rating.belongsTo(Purchase, { foreignKey: 'purchase_id', as: 'purchase' });
User.hasMany(Rating, { foreignKey: 'buyer_id', as: 'ratings' });
Design.hasMany(Rating, { foreignKey: 'design_id', as: 'ratings' });

export default Rating;
