export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS beta_signups (
      beta_signups_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      fullname VARCHAR(120) NOT NULL,
      email VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(30),
      slot_key VARCHAR(20) NOT NULL,
      utm_source VARCHAR(120),
      utm_medium VARCHAR(120),
      utm_campaign VARCHAR(120),
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    )
  `);

  await queryInterface.sequelize.query(
    'CREATE UNIQUE INDEX IF NOT EXISTS beta_signups_email_unique ON beta_signups (email)'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query('DROP TABLE IF EXISTS beta_signups');
}
