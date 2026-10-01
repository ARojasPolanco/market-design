const ACHIEVEMENTS = [
  {
    id: 'pionero',
    name: 'Pionero',
    description: 'Formás parte de la primera tanda de vendedores del lanzamiento.',
    criterion: 'Vendedor de la primera tanda / lanzamiento',
    type: 'manual',
    category: 'special',
    color: '#8B5CF6',
    sort_order: 1,
  },
  {
    id: 'racha_activa',
    name: 'Racha Activa',
    description: 'Vendés de forma constante, sin cortes, en los últimos 14 días.',
    criterion: 'Ventas constantes en los últimos 14 días',
    type: 'auto',
    category: 'activity',
    color: '#F59E0B',
    sort_order: 2,
  },
  {
    id: 'elegido',
    name: 'Elegido por Market Design',
    description: 'Fuiste seleccionado por curaduría del equipo como vendedor destacado.',
    criterion: 'Curaduría manual del equipo',
    type: 'manual',
    category: 'special',
    color: '#6366F1',
    sort_order: 3,
  },
  {
    id: 'cero_disputas',
    name: 'Cero Disputas',
    description: 'Acumulaste 20 ventas sin ningún reclamo ni denuncia.',
    criterion: '20 ventas sin reclamos ni denuncias',
    type: 'auto',
    category: 'trust',
    color: '#10B981',
    sort_order: 4,
  },
  {
    id: 'tutor',
    name: 'Tutor',
    description: 'Ayudás a otros vendedores a crecer en la plataforma.',
    criterion: 'Vendedor que ayuda a otros',
    type: 'manual',
    category: 'special',
    color: '#7C3AED',
    sort_order: 5,
  },
  {
    id: 'siempre_presente',
    name: 'Siempre Presente',
    description: 'Respondés activamente a tus compradores.',
    criterion: 'Responde activamente a sus compradores',
    type: 'manual',
    category: 'trust',
    color: '#0EA5E9',
    sort_order: 6,
  },
  {
    id: 'voz_comunidad',
    name: 'Voz de la Comunidad',
    description: 'Aportás ideas y feedback valioso para la plataforma.',
    criterion: 'Aporta ideas y feedback a la plataforma',
    type: 'manual',
    category: 'special',
    color: '#A855F7',
    sort_order: 7,
  },
  {
    id: 'siempre_creando',
    name: 'Siempre Creando',
    description: 'Subís diseños nuevos de forma sostenida mes a mes.',
    criterion: 'Al menos 1 diseño aprobado por mes durante 3 meses seguidos',
    type: 'auto',
    category: 'activity',
    color: '#FBBF24',
    sort_order: 8,
  },
  {
    id: 'cero_rechazos',
    name: 'Cero Rechazos',
    description: 'Tenés varios diseños publicados y ninguno fue rechazado.',
    criterion: '5+ diseños y ninguno rechazado',
    type: 'auto',
    category: 'activity',
    color: '#EA580C',
    sort_order: 9,
  },
  {
    id: 'leyenda',
    name: 'Leyenda',
    description: 'Conseguiste los otros 9 logros. Sos una leyenda de Market Design.',
    criterion: 'Tiene los otros 9 logros',
    type: 'auto',
    category: 'legend',
    color: '#FFD700',
    sort_order: 10,
  },
];

export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    "CREATE TYPE achievement_type AS ENUM ('manual', 'auto')"
  );

  await queryInterface.createTable('achievements', {
    id: { type: 'VARCHAR(50)', primaryKey: true, allowNull: false },
    name: { type: 'VARCHAR(100)', allowNull: false },
    description: { type: 'TEXT', allowNull: false },
    criterion: { type: 'VARCHAR(200)', allowNull: true },
    type: { type: 'achievement_type', allowNull: false, defaultValue: 'manual' },
    category: { type: 'VARCHAR(50)', allowNull: true },
    color: { type: 'VARCHAR(20)', allowNull: true },
    sort_order: { type: 'INTEGER', allowNull: false, defaultValue: 0 },
  });

  await queryInterface.createTable('seller_achievements', {
    seller_achievements_id: {
      type: 'UUID',
      primaryKey: true,
      allowNull: false,
      defaultValue: queryInterface.sequelize.literal('gen_random_uuid()'),
    },
    user_id: {
      type: 'UUID',
      allowNull: false,
      references: { model: 'users', key: 'users_id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    achievement_id: {
      type: 'VARCHAR(50)',
      allowNull: false,
      references: { model: 'achievements', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    earned_at: {
      type: 'TIMESTAMP WITH TIME ZONE',
      allowNull: false,
      defaultValue: queryInterface.sequelize.literal('now()'),
    },
    granted_by: {
      type: 'UUID',
      allowNull: true,
      references: { model: 'users', key: 'users_id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  });

  await queryInterface.addIndex('seller_achievements', ['user_id', 'achievement_id'], {
    unique: true,
    name: 'seller_achievements_user_achievement_unique',
  });

  await queryInterface.bulkInsert('achievements', ACHIEVEMENTS);
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('seller_achievements');
  await queryInterface.dropTable('achievements');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS achievement_type');
}
