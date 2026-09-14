import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  await queryInterface.addColumn('designs', 'preview_urls', {
    type: DataTypes.JSONB,
    allowNull: true,
  });

  await queryInterface.addColumn('designs', 'preview_keys', {
    type: DataTypes.JSONB,
    allowNull: true,
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('designs', 'preview_urls');
  await queryInterface.removeColumn('designs', 'preview_keys');
}
