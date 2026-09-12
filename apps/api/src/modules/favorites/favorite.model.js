import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import User from '../auth/auth.model.js';
import Design from '../designs/design.model.js';

class Favorite extends Model {}

Favorite.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'favorites_id',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    designId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'design_id',
    },
  },
  {
    sequelize,
    modelName: 'Favorite',
    tableName: 'favorites',
    underscored: true,
  }
);

Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Favorite.belongsTo(Design, { foreignKey: 'design_id', as: 'design' });
User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' });
Design.hasMany(Favorite, { foreignKey: 'design_id', as: 'favorites' });

export default Favorite;
