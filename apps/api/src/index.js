import 'dotenv/config';
import app from './app.js';
import { envs } from './config/enviroments.js';
import sequelize from './config/database/database.js';
import { runMigrations } from './config/database/migrator.js';

const PORT = envs.PORT;

async function main() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Run migrations
    await runMigrations();
    console.log('✅ Migrations applied');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${envs.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

main();
