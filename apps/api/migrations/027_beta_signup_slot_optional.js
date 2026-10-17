export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE beta_signups ALTER COLUMN slot_key DROP NOT NULL'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE beta_signups ALTER COLUMN slot_key SET NOT NULL'
  );
}
