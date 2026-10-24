export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS conversations (
      conversations_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type VARCHAR(20) NOT NULL DEFAULT 'buyer_seller',
      buyer_id UUID NOT NULL REFERENCES users(users_id) ON DELETE CASCADE,
      seller_id UUID REFERENCES users(users_id) ON DELETE SET NULL,
      design_id UUID,
      last_message_at TIMESTAMP WITH TIME ZONE,
      status VARCHAR(20) NOT NULL DEFAULT 'open',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    )
  `);

  await queryInterface.sequelize.query(
    'CREATE INDEX IF NOT EXISTS conversations_buyer_idx ON conversations (buyer_id)'
  );
  await queryInterface.sequelize.query(
    'CREATE INDEX IF NOT EXISTS conversations_seller_idx ON conversations (seller_id)'
  );
  await queryInterface.sequelize.query(
    'CREATE INDEX IF NOT EXISTS conversations_last_message_idx ON conversations (last_message_at)'
  );

  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS messages (
      messages_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL REFERENCES conversations(conversations_id) ON DELETE CASCADE,
      sender_id UUID NOT NULL REFERENCES users(users_id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      is_system BOOLEAN NOT NULL DEFAULT false,
      read_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    )
  `);

  await queryInterface.sequelize.query(
    'CREATE INDEX IF NOT EXISTS messages_conversation_created_idx ON messages (conversation_id, created_at)'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS messages');
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS conversations');
}
