import { Sequelize } from 'sequelize';
import { envs } from '../enviroments.js';

const sequelize = new Sequelize(envs.DB_URI, {
  dialect: 'postgres',
  logging: envs.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
  },
});

export default sequelize;
