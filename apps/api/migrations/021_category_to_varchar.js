export async function up({ context: queryInterface }) {
  // The admin assigns the real category from an editable list (can include
  // accents / custom values), so the column must be free text, not an ENUM.
  await queryInterface.sequelize.query(
    'ALTER TABLE designs ALTER COLUMN category TYPE VARCHAR(100) USING category::text'
  );
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS design_category');
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    "CREATE TYPE design_category AS ENUM ('sublimado', 'estampado', 'papeleria', 'infantil', 'deportivo', 'religioso', 'otro')"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ALTER COLUMN category TYPE design_category USING (CASE WHEN category IN ('sublimado', 'estampado', 'papeleria', 'infantil', 'deportivo', 'religioso', 'otro') THEN category ELSE NULL END)::design_category"
  );
}
