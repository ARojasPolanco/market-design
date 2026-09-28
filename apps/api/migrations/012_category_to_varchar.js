export async function up({ context: queryInterface }) {
  // Change category column from ENUM to VARCHAR to accept custom categories
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ALTER COLUMN category TYPE VARCHAR(50)"
  );
  // Drop the old ENUM type if it exists
  try {
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS design_category");
  } catch (e) {
    // Type might not exist
  }
}

export async function down({ context: queryInterface }) {
  // Recreate ENUM type
  await queryInterface.sequelize.query(
    "CREATE TYPE design_category AS ENUM ('sublimado', 'estampado', 'papeleria', 'infantil', 'deportivo', 'religioso', 'otro')"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ALTER COLUMN category TYPE design_category USING category::design_category"
  );
}