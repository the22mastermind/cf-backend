import userRoles from '../utils/userRoles';

const {
  ADMIN,
  CONSUMER,
  RIDER,
  VENDOR,
} = userRoles;

export default (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      unique: false,
    },
    role: {
      type: DataTypes.ENUM(
        ADMIN,
        CONSUMER,
        RIDER,
        VENDOR,
      ),
      validate: {
        notEmpty: true,
      },
    },
    profileComplete: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: true,
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
    },
    address: {
      type: DataTypes.STRING,
    },
    subscription: {
      type: DataTypes.STRING,
    },
    subscriptionExpires: {
      type: DataTypes.STRING,
    },
  });
  user.associate = (models) => {
    user.hasOne(models.vendor, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    user.hasOne(models.review, {
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  };
  return user;
};
