export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE notifications ADD COLUMN IF NOT EXISTS conversation_id UUID'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE notifications DROP COLUMN IF EXISTS conversation_id'
  );
}
