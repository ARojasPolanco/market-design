export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS conversation_access_logs (
      conversation_access_logs_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL REFERENCES conversations(conversations_id) ON DELETE CASCADE,
      admin_id UUID NOT NULL REFERENCES users(users_id) ON DELETE CASCADE,
      accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    )
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS blocked_users (
      blocked_users_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(users_id) ON DELETE CASCADE,
      blocked_user_id UUID NOT NULL REFERENCES users(users_id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      UNIQUE (user_id, blocked_user_id)
    )
  `);

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS message_reports (
      message_reports_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      message_id UUID NOT NULL REFERENCES messages(messages_id) ON DELETE CASCADE,
      reporter_id UUID NOT NULL REFERENCES users(users_id) ON DELETE CASCADE,
      reason TEXT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    )
  `);
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS message_reports');
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS blocked_users');
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS conversation_access_logs');
}
