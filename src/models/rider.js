export default (sequelize, DataTypes) => {
  const rider = sequelize.define('rider', {
    name: { type: DataTypes.STRING, allowNull: false },
  });
  rider.associate = (models) => {
    rider.belongsTo(models.user, {
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
    });
  };
  return rider;
};
