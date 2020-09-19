export default (sequelize, DataTypes) => {
  const plan = sequelize.define('plan', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    options: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  }, {});
  plan.associate = (models) => {
    plan.hasMany(models.subscription, {
      foreignKey: 'planId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return plan;
};
