import { DataTypes } from 'sequelize';

export async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(`
    CREATE TYPE purchase_status AS ENUM ('pending', 'completed', 'refunded');
  `);

  await queryInterface.createTable('purchases', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'purchases_id',
    },
    buyer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'users_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    design_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'designs',
        key: 'designs_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    commission: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    seller_earnings: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mp_payment_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    mp_preference_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: 'purchase_status',
      defaultValue: 'pending',
      allowNull: false,
    },
    download_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_download_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    download_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    download_token_expires: {
      type: DataTypes.DATE,
      allowNull: true,
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

  await queryInterface.createTable('ratings', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'ratings_id',
    },
    buyer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'users_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    design_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'designs',
        key: 'designs_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    purchase_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'purchases',
        key: 'purchases_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
  await queryInterface.addIndex('purchases', ['buyer_id']);
  await queryInterface.addIndex('purchases', ['design_id']);
  await queryInterface.addIndex('purchases', ['mp_payment_id']);
  await queryInterface.addIndex('purchases', ['status']);
  await queryInterface.addIndex('ratings', ['buyer_id']);
  await queryInterface.addIndex('ratings', ['design_id']);
  await queryInterface.addIndex('ratings', ['purchase_id']);
  await queryInterface.addIndex('ratings', ['score']);

  // Unique constraint: one rating per purchase
  await queryInterface.addConstraint('ratings', {
    fields: ['purchase_id'],
    type: 'unique',
    name: 'unique_rating_per_purchase',
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('ratings');
  await queryInterface.dropTable('purchases');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS purchase_status;');
}
