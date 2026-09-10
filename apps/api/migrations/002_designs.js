import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  // Create enum types
  await queryInterface.sequelize.query(`
    CREATE TYPE design_status AS ENUM ('pending', 'approved', 'rejected');
    CREATE TYPE design_category AS ENUM ('sublimado', 'estampado', 'papeleria', 'infantil', 'deportivo', 'religioso', 'otro');
    CREATE TYPE design_technique AS ENUM ('sublimado', 'estampado', 'vinilo', 'dtf', 'otro');
  `);

  await queryInterface.createTable('designs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'designs_id',
    },
    seller_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'users_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: 'design_category',
      allowNull: false,
    },
    category_suggested: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    technique: {
      type: 'design_technique',
      allowNull: false,
    },
    status: {
      type: 'design_status',
      defaultValue: 'pending',
      allowNull: false,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    preview_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    preview_key: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    original_file_key: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    original_file_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    original_file_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    file_format: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    dpi: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sales_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rating_avg: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
    rating_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approved_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'users_id',
      },
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

  // Create indexes
  await queryInterface.addIndex('designs', ['seller_id']);
  await queryInterface.addIndex('designs', ['status']);
  await queryInterface.addIndex('designs', ['category']);
  await queryInterface.addIndex('designs', ['technique']);
  await queryInterface.addIndex('designs', ['price']);
  await queryInterface.addIndex('designs', ['sales_count']);
  await queryInterface.addIndex('designs', ['created_at']);

  // Enable pg_trgm for full-text search
  await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
  await queryInterface.sequelize.query(
    'CREATE INDEX idx_designs_title_trgm ON designs USING gin (title gin_trgm_ops);'
  );
  await queryInterface.sequelize.query(
    'CREATE INDEX idx_designs_description_trgm ON designs USING gin (description gin_trgm_ops);'
  );
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('designs');
  await queryInterface.sequelize.query(`
    DROP TYPE IF EXISTS design_status;
    DROP TYPE IF EXISTS design_category;
    DROP TYPE IF EXISTS design_technique;
  `);
}
