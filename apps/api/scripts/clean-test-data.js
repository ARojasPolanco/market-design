import 'dotenv/config';
import sequelize from '../src/config/database/database.js';

// Removes data created by the automated test suite from the development
// database (test users use @test.com / @example.com emails). Idempotent.
// Usage: node scripts/clean-test-data.js

const before = async () => {
  const [u] = await sequelize.query('SELECT count(*)::int AS c FROM users');
  const [d] = await sequelize.query('SELECT count(*)::int AS c FROM designs');
  return { users: u[0].c, designs: d[0].c };
};

const deleted = {};

try {
  await sequelize.authenticate();
  console.log(`DB: ${process.env.DB_URI?.replace(/:[^:@/]+@/, ':***@') || '(from env)'}`);
  console.log('Antes:', await before());

  await sequelize.transaction(async (t) => {
    const q = (sql) => sequelize.query(sql, { transaction: t });
    const del = async (sql) => {
      const [rows] = await q(`${sql} RETURNING 1`);
      return rows.length;
    };

    await q(`CREATE TEMP TABLE _tu ON COMMIT DROP AS
      SELECT users_id FROM users WHERE email LIKE '%@test.com' OR email LIKE '%@example.com'`);
    await q(`CREATE TEMP TABLE _td ON COMMIT DROP AS
      SELECT designs_id FROM designs WHERE seller_id IN (SELECT users_id FROM _tu)`);
    await q(`CREATE TEMP TABLE _tp ON COMMIT DROP AS
      SELECT purchases_id FROM purchases
      WHERE buyer_id IN (SELECT users_id FROM _tu) OR design_id IN (SELECT designs_id FROM _td)`);

    deleted.ratings = await del(`DELETE FROM ratings
      WHERE buyer_id IN (SELECT users_id FROM _tu)
         OR design_id IN (SELECT designs_id FROM _td)
         OR purchase_id IN (SELECT purchases_id FROM _tp)`);
    deleted.favorites = await del(`DELETE FROM favorites
      WHERE user_id IN (SELECT users_id FROM _tu) OR design_id IN (SELECT designs_id FROM _td)`);
    deleted.moderationLogs = await del(`DELETE FROM moderation_logs
      WHERE admin_id IN (SELECT users_id FROM _tu) OR design_id IN (SELECT designs_id FROM _td)`);
    deleted.reports = await del(`DELETE FROM reports
      WHERE reporter_id IN (SELECT users_id FROM _tu) OR design_id IN (SELECT designs_id FROM _td)`);
    deleted.notifications = await del(`DELETE FROM notifications
      WHERE user_id IN (SELECT users_id FROM _tu)`);
    deleted.purchases = await del(`DELETE FROM purchases
      WHERE purchases_id IN (SELECT purchases_id FROM _tp)`);

    // Real designs (if any) approved/paused by a test admin must not block user deletion.
    await q(`UPDATE designs SET approved_by = NULL WHERE approved_by IN (SELECT users_id FROM _tu)`);
    await q(`UPDATE designs SET paused_by = NULL WHERE paused_by IN (SELECT users_id FROM _tu)`);

    deleted.designs = await del(`DELETE FROM designs WHERE designs_id IN (SELECT designs_id FROM _td)`);
    deleted.users = await del(`DELETE FROM users WHERE users_id IN (SELECT users_id FROM _tu)`);
  });

  console.log('Borrado:', deleted);
  console.log('Después:', await before());
  process.exit(0);
} catch (error) {
  console.error('Error en la limpieza:', error.message);
  process.exit(1);
}
