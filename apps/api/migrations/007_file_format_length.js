export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE designs ALTER COLUMN file_format TYPE VARCHAR(50)'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'ALTER TABLE designs ALTER COLUMN file_format TYPE VARCHAR(20)'
  );
}
