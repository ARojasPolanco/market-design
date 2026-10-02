export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE purchases ADD COLUMN IF NOT EXISTS mp_fee DECIMAL(10,2)'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query('ALTER TABLE purchases DROP COLUMN IF EXISTS mp_fee');
}
