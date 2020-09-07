import orderStatus from '../utils/orderStatus';

const {
  PLACED,
  PROCESSING,
  ONTHEWAY,
  COMPLETED,
  CANCELED,
} = orderStatus;

export default (sequelize, DataTypes) => {
  const order = sequelize.define('order', {
    txId: { type: DataTypes.STRING, allowNull: false },
    total: { type: DataTypes.INTEGER, allowNull: false },
    paymentMode: { type: DataTypes.STRING, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        PLACED,
        PROCESSING,
        ONTHEWAY,
        COMPLETED,
        CANCELED,
      ),
    },
  }, {});
  order.associate = (models) => {
    order.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    order.hasMany(models.orderContent, {
      foreignKey: 'orderId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return order;
};
