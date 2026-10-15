export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query('ALTER TABLE users DROP COLUMN IF EXISTS last_login_at');
}
