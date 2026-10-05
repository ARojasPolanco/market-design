import 'dotenv/config';
import sequelize from '../src/config/database/database.js';
import { mpService } from '../src/config/mercadopago/mercadopago.js';

// One-off: fills purchases.mp_fee for completed purchases that have an
// mp_payment_id but no mp_fee yet, by fetching the payment from Mercado Pago.
// Usage: DB_URI=<neon uri> node scripts/backfill-mp-fee.js [purchaseId]

const purchaseId = process.argv[2];

try {
  await sequelize.authenticate();

  const [rows] = await sequelize.query(
    `SELECT purchases_id, mp_payment_id, design_id, seller_earnings
     FROM purchases
     WHERE mp_payment_id IS NOT NULL
     ${purchaseId ? 'AND purchases_id = :purchaseId' : 'AND mp_fee IS NULL'}
     ORDER BY created_at DESC`,
    { replacements: purchaseId ? { purchaseId } : {} }
  );

  if (rows.length === 0) {
    console.log('No hay compras pendientes de backfill (mp_payment_id sin mp_fee).');
    process.exit(0);
  }

  console.log(`Compras a procesar: ${rows.length}`);

  for (const row of rows) {
    const [sellerRows] = await sequelize.query(
      `SELECT u.mp_access_token
       FROM designs d JOIN users u ON u.users_id = d.seller_id
       WHERE d.designs_id = :designId`,
      { replacements: { designId: row.design_id } }
    );

    const sellerToken = sellerRows[0]?.mp_access_token || undefined;

    try {
      const payment = await mpService.getPayment(row.mp_payment_id, sellerToken);
      // Only MP's cost: exclude our marketplace fee (application_fee).
      const mpFee = Array.isArray(payment.fee_details)
        ? payment.fee_details
            .filter((fee) => fee.type !== 'application_fee' && fee.type !== 'marketplace_fee')
            .reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
        : null;

      if (mpFee === null) {
        console.log(`${row.purchases_id} | pago ${row.mp_payment_id} | sin fee_details`);
        continue;
      }

      await sequelize.query('UPDATE purchases SET mp_fee = :fee WHERE purchases_id = :id', {
        replacements: { fee: mpFee, id: row.purchases_id },
      });

      const net = Math.round((Number(row.seller_earnings || 0) - mpFee) * 100) / 100;
      console.log(
        `${row.purchases_id} | pago ${row.mp_payment_id} | mpFee ${mpFee} | ganancia neta ${net}`
      );
    } catch (err) {
      console.error(`Error con ${row.purchases_id}:`, err.message);
    }
  }

  process.exit(0);
} catch (error) {
  console.error('Error de conexion:', error.message);
  process.exit(1);
}
