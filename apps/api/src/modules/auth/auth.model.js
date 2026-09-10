import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database/database.js';
import { hashPassword } from '../../config/plugins/encrypted-password.js';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'users_id',
    },
    fullname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('buyer', 'seller', 'admin'),
      defaultValue: 'buyer',
      allowNull: false,
    },
    storeName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'store_name',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'avatar_url',
    },
    rank: {
      type: DataTypes.ENUM('bronce', 'plata', 'oro', 'platino', 'diamante'),
      defaultValue: 'bronce',
      allowNull: false,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'email_verified',
    },
    emailVerificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'email_verification_token',
    },
    mpAccessToken: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'mp_access_token',
    },
    mpRefreshToken: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'mp_refresh_token',
    },
    mpConnected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'mp_connected',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified',
    },
    isTopSeller: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_top_seller',
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_deleted',
    },
    changedPasswordAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'changed_password_at',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await hashPassword(user.password);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await hashPassword(user.password);
        }
      },
    },
  }
);

export default User;
