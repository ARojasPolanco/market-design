import { Umzug } from 'umzug';
import { SequelizeStorage } from 'umzug';
import sequelize from './database.js';
import { info, warn, error, debug } from '../logger.js';

const migrator = new Umzug({
  migrations: {
    glob: ['migrations/*.js', { cwd: process.cwd() }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: { info, warn, error, debug },
});

export const runMigrations = async () => {
  await migrator.up();
};

export const rollbackMigrations = async () => {
  await migrator.down();
};

export default migrator;
