export async function up({ context: queryInterface }) {
  // Add fields for preview replacement flow
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ADD COLUMN IF NOT EXISTS pending_preview_url VARCHAR(500)"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ADD COLUMN IF NOT EXISTS pending_preview_key VARCHAR(500)"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ADD COLUMN IF NOT EXISTS pending_preview_urls JSONB"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ADD COLUMN IF NOT EXISTS pending_preview_keys JSONB"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ADD COLUMN IF NOT EXISTS delete_requested BOOLEAN DEFAULT false"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ADD COLUMN IF NOT EXISTS delete_requested_at TIMESTAMP WITH TIME ZONE"
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS pending_preview_url");
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS pending_preview_key");
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS pending_preview_urls");
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS pending_preview_keys");
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS delete_requested");
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS delete_requested_at");
}
