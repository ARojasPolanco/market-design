export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255)'
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE users DROP COLUMN IF EXISTS password_reset_token'
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE users DROP COLUMN IF EXISTS password_reset_expires'
  );
}
