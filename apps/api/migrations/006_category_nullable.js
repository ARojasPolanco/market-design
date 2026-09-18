export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE designs ALTER COLUMN category DROP NOT NULL'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE designs ALTER COLUMN category SET NOT NULL'
  );
}
