export default (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
  });
  category.associate = (models) => {
    category.hasMany(models.product, {
      foreignKey: 'categoryId',
      onUpdate: 'CASCADE',
    });
  };
  return category;
};
