import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.changeColumn('designs', 'category', {
    type: DataTypes.ENUM('sublimado', 'estampado', 'papeleria', 'infantil', 'deportivo', 'religioso', 'otro'),
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.changeColumn('designs', 'category', {
    type: DataTypes.ENUM('sublimado', 'estampado', 'papeleria', 'infantil', 'deportivo', 'religioso', 'otro'),
    allowNull: false,
  });
}
