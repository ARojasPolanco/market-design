export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      notifications_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(users_id),
      type VARCHAR(50) NOT NULL,
      title VARCHAR(200) NOT NULL,
      message TEXT,
      design_id UUID,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await queryInterface.sequelize.query(
    "CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)"
  );
  await queryInterface.sequelize.query(
    "CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(user_id, is_read)"
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query("DROP TABLE IF EXISTS notifications");
}
