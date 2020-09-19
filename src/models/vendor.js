import userStatus from '../utils/userStatus';

const {
  ACTIVE,
  DEACTIVE,
} = userStatus;

export default (sequelize, DataTypes) => {
  const vendor = sequelize.define('vendor', {
    name: { type: DataTypes.STRING, allowNull: false },
    tin: { type: DataTypes.STRING, unique: true },
    website: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM(
        ACTIVE,
        DEACTIVE,
      ),
    },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  });
  vendor.associate = (models) => {
    vendor.belongsTo(models.user, {
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
    });
  };
  return vendor;
};
