export async function up({ context: queryInterface }) {
  // Change technique column from ENUM to VARCHAR to accept custom techniques
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ALTER COLUMN technique TYPE VARCHAR(50)"
  );
  // Drop the old ENUM type
  await queryInterface.sequelize.query(
    "DROP TYPE IF EXISTS design_technique"
  );
}

export async function down({ context: queryInterface }) {
  // Recreate ENUM type
  await queryInterface.sequelize.query(
    "CREATE TYPE design_technique AS ENUM ('sublimado', 'estampado', 'vinilo', 'dtf', 'otro')"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ALTER COLUMN technique TYPE design_technique USING technique::design_technique"
  );
}
