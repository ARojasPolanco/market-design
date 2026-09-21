export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ADD COLUMN IF NOT EXISTS original_preview_url VARCHAR(500)"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ADD COLUMN IF NOT EXISTS original_preview_key VARCHAR(500)"
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    "ALTER TABLE designs DROP COLUMN IF EXISTS original_preview_url"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs DROP COLUMN IF EXISTS original_preview_key"
  );
}
