export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS suspension_reason TEXT'
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP WITH TIME ZONE'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query('ALTER TABLE users DROP COLUMN IF EXISTS suspension_reason');
  await queryInterface.sequelize.query('ALTER TABLE users DROP COLUMN IF EXISTS suspended_at');
}
