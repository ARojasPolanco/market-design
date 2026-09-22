export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ADD COLUMN pause_reason TEXT"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ADD COLUMN paused_at TIMESTAMP WITH TIME ZONE"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ADD COLUMN paused_by UUID REFERENCES users(users_id)"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE designs ADD COLUMN ticket_id VARCHAR(20)"
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS pause_reason");
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS paused_at");
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS paused_by");
  await queryInterface.sequelize.query("ALTER TABLE designs DROP COLUMN IF EXISTS ticket_id");
}
