import subscriptionStatus from '../utils/subscriptionStatus';

const {
  ACTIVE,
  EXPIRED,
  CANCELED,
  PENDING,
} = subscriptionStatus;

export default (sequelize, DataTypes) => {
  const subscription = sequelize.define('subscription', {
    days: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    vegan: { type: DataTypes.BOOLEAN, allowNull: false },
    allergies: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    people: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        ACTIVE,
        EXPIRED,
        CANCELED,
        PENDING,
      ),
    },
    expiresOn: { type: DataTypes.DATE, allowNull: false },
  }, {});
  subscription.associate = (models) => {
    subscription.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    subscription.belongsTo(models.plan, {
      foreignKey: 'planId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return subscription;
};
