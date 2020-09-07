export default (sequelize, DataTypes) => {
  const orderContent = sequelize.define('orderContent', {
    productId: { type: DataTypes.INTEGER, allowNull: false },
    productName: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    cost: { type: DataTypes.INTEGER, allowNull: false },
  }, {});
  orderContent.associate = (models) => {
    orderContent.belongsTo(models.order, {
      foreignKey: 'orderId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return orderContent;
};
