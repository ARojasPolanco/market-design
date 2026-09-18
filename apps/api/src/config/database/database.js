import { Sequelize } from 'sequelize';
import { envs } from '../enviroments.js';

const sequelize = new Sequelize(envs.DB_URI, {
  dialect: 'postgres',
  logging: envs.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
  },
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 3,
    timeout: 30000,
  },
});

export default sequelize;
