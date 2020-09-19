export default (sequelize, DataTypes) => {
  const product = sequelize.define('product', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    quantity: DataTypes.STRING,
    cost: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    image: DataTypes.STRING,
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });
  product.associate = (models) => {
    product.belongsTo(models.category, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    product.hasMany(models.review, {
      foreignKey: 'productId',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  };
  return product;
};
