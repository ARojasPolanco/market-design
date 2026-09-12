import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import User from '../auth/auth.model.js';
import Design from '../designs/design.model.js';

class Report extends Model {}

Report.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'reports_id',
    },
    designId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'design_id',
    },
    reporterId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'reporter_id',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed', 'dismissed'),
      defaultValue: 'pending',
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Report',
    tableName: 'reports',
    underscored: true,
  }
);

Report.belongsTo(User, { foreignKey: 'reporter_id', as: 'reporter' });
Report.belongsTo(Design, { foreignKey: 'design_id', as: 'design' });

export default Report;
