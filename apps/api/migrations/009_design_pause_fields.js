export async function up({ context: queryInterface }) {
  // Add 'paused' to the design_status ENUM
  try {
    await queryInterface.sequelize.query(
      "ALTER TYPE design_status ADD VALUE IF NOT EXISTS 'paused'"
    );
  } catch (e) {
    // Value might already exist
  }

  // Add pause fields if they don't exist
  const columns = await queryInterface.sequelize.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'designs' AND column_name IN ('pause_reason', 'paused_at', 'paused_by', 'ticket_id')"
  );
  const existingColumns = columns[0].map(c => c.column_name);

  if (!existingColumns.includes('pause_reason')) {
    await queryInterface.sequelize.query("ALTER TABLE designs ADD COLUMN pause_reason TEXT");
  }
  if (!existingColumns.includes('paused_at')) {
    await queryInterface.sequelize.query("ALTER TABLE designs ADD COLUMN paused_at TIMESTAMP WITH TIME ZONE");
  }
  if (!existingColumns.includes('paused_by')) {
    await queryInterface.sequelize.query("ALTER TABLE designs ADD COLUMN paused_by UUID REFERENCES users(users_id)");
  }
  if (!existingColumns.includes('ticket_id')) {
    await queryInterface.sequelize.query("ALTER TABLE designs ADD COLUMN ticket_id VARCHAR(20)");
  }
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS pause_reason");
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS paused_at");
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS paused_by");
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS ticket_id");
}
