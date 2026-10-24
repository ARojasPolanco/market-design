export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE custom_orders ADD COLUMN IF NOT EXISTS commission DECIMAL(10,2)'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE custom_orders DROP COLUMN IF EXISTS commission'
  );
}
