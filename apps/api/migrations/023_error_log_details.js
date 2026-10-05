export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE errors ADD COLUMN IF NOT EXISTS status_code INTEGER'
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE errors ADD COLUMN IF NOT EXISTS method VARCHAR(10)'
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE errors ADD COLUMN IF NOT EXISTS path VARCHAR(255)'
  );
  await queryInterface.sequelize.query('ALTER TABLE errors ADD COLUMN IF NOT EXISTS user_id UUID');
  await queryInterface.sequelize.query(
    'ALTER TABLE errors ADD COLUMN IF NOT EXISTS ip VARCHAR(45)'
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE errors ADD COLUMN IF NOT EXISTS user_agent TEXT'
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE errors ADD COLUMN IF NOT EXISTS is_operational BOOLEAN DEFAULT false'
  );
}

export async function down({ context: queryInterface }) {
  for (const column of [
    'status_code',
    'method',
    'path',
    'user_id',
    'ip',
    'user_agent',
    'is_operational',
  ]) {
    await queryInterface.sequelize.query(`ALTER TABLE errors DROP COLUMN IF EXISTS ${column}`);
  }
}
