export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS custom_orders (
      custom_orders_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      buyer_id UUID NOT NULL REFERENCES users(users_id) ON DELETE CASCADE,
      seller_id UUID NOT NULL REFERENCES users(users_id) ON DELETE CASCADE,
      base_design_id UUID,
      conversation_id UUID REFERENCES conversations(conversations_id) ON DELETE SET NULL,
      title VARCHAR(200),
      description TEXT,
      price DECIMAL(10,2),
      status VARCHAR(20) NOT NULL DEFAULT 'requested',
      mp_preference_id VARCHAR(255),
      mp_payment_id VARCHAR(100),
      mp_fee DECIMAL(10,2),
      file_key VARCHAR(500),
      original_file_name VARCHAR(255),
      download_token VARCHAR(255),
      download_token_expires TIMESTAMP WITH TIME ZONE,
      delivered_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    )
  `);

  await queryInterface.sequelize.query(
    'CREATE INDEX IF NOT EXISTS custom_orders_buyer_idx ON custom_orders (buyer_id)'
  );
  await queryInterface.sequelize.query(
    'CREATE INDEX IF NOT EXISTS custom_orders_seller_idx ON custom_orders (seller_id)'
  );
  await queryInterface.sequelize.query(
    'CREATE INDEX IF NOT EXISTS custom_orders_conversation_idx ON custom_orders (conversation_id)'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS custom_orders');
}
