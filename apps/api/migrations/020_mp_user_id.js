export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS mp_user_id VARCHAR(50)'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query('ALTER TABLE users DROP COLUMN IF EXISTS mp_user_id');
}
