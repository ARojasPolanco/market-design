import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  // Moderation logs
  await queryInterface.createTable('moderation_logs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'moderation_logs_id',
    },
    design_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'designs', key: 'designs_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    admin_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'users_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    action: {
      type: DataTypes.ENUM('approved', 'rejected'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Favorites
  await queryInterface.createTable('favorites', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'favorites_id',
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'users_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    design_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'designs', key: 'designs_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Config
  await queryInterface.createTable('config', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Reports
  await queryInterface.createTable('reports', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'reports_id',
    },
    design_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'designs', key: 'designs_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    reporter_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'users_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed', 'dismissed'),
      defaultValue: 'pending',
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Indexes
  await queryInterface.addIndex('moderation_logs', ['design_id']);
  await queryInterface.addIndex('moderation_logs', ['admin_id']);
  await queryInterface.addIndex('favorites', ['user_id']);
  await queryInterface.addIndex('favorites', ['design_id']);
  await queryInterface.addIndex('favorites', ['user_id', 'design_id'], { unique: true });
  await queryInterface.addIndex('reports', ['design_id']);
  await queryInterface.addIndex('reports', ['status']);

  // Seed default config
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

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('reports');
  await queryInterface.dropTable('config');
  await queryInterface.dropTable('favorites');
  await queryInterface.dropTable('moderation_logs');
}
