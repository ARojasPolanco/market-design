const DEAD_KEYS = [
  'commission',
  'commission_base',
  'commission_levels',
  'commission_min',
  'commission_level1',
  'accepted_formats',
  'min_dpi',
  'watermark_text',
  'watermark_opacity',
];

export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'DELETE FROM config WHERE key IN (:keys)',
    { replacements: { keys: DEAD_KEYS } }
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.bulkInsert('config', [
    { id: '550e8400-e29b-41d4-a716-446655440001', key: 'commission_base', value: JSON.stringify(20), updated_at: new Date() },
    { id: '550e8400-e29b-41d4-a716-446655440002', key: 'commission_levels', value: JSON.stringify([
      { rank: 'plata', rate: 18, salesNeeded: 50 },
      { rank: 'oro', rate: 15, salesNeeded: 200 },
      { rank: 'platino', rate: 12, salesNeeded: 0 },
      { rank: 'diamante', rate: 10, salesNeeded: 0 },
    ]), updated_at: new Date() },
    { id: '550e8400-e29b-41d4-a716-446655440003', key: 'accepted_formats', value: JSON.stringify(['pdf', 'png', 'zip', 'ai', 'psd', 'eps']), updated_at: new Date() },
    { id: '550e8400-e29b-41d4-a716-446655440004', key: 'min_dpi', value: JSON.stringify(150), updated_at: new Date() },
    { id: '550e8400-e29b-41d4-a716-446655440005', key: 'watermark_text', value: JSON.stringify('MARKET DESIGN'), updated_at: new Date() },
    { id: '550e8400-e29b-41d4-a716-446655440006', key: 'watermark_opacity', value: JSON.stringify(0.2), updated_at: new Date() },
  ]);
}
