export default (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    vote: { type: DataTypes.DECIMAL, allowNull: false },
    comment: DataTypes.STRING,
    average: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.0,
    },
  });
  review.associate = (models) => {
    review.belongsTo(models.product, {
      foreignKey: 'productId',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    review.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };
  return review;
};
