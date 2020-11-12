export default (sequelize, DataTypes) => {
  const rider = sequelize.define('rider', {
    name: { type: DataTypes.STRING, allowNull: false },
  });
  rider.associate = (models) => {
    rider.belongsTo(models.user, {
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
    });
    rider.hasMany(models.order, {
      foreignKey: 'riderId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return rider;
};
