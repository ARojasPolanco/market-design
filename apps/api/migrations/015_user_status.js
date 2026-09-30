export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    "CREATE TYPE user_status AS ENUM ('active', 'suspended')"
  );
  await queryInterface.sequelize.query(
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS status user_status NOT NULL DEFAULT 'active'"
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.sequelize.query("ALTER TABLE users DROP COLUMN IF EXISTS status");
  await queryInterface.sequelize.query("DROP TYPE IF EXISTS user_status");
}
