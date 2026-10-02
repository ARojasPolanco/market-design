export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE ratings ADD COLUMN IF NOT EXISTS seller_reply TEXT'
  );
  await queryInterface.sequelize.query(
    'ALTER TABLE ratings ADD COLUMN IF NOT EXISTS seller_reply_at TIMESTAMP WITH TIME ZONE'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query('ALTER TABLE ratings DROP COLUMN IF EXISTS seller_reply');
  await queryInterface.sequelize.query('ALTER TABLE ratings DROP COLUMN IF EXISTS seller_reply_at');
}
