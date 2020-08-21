import userStatus from '../utils/userStatus';

const {
  ACTIVE,
  DEACTIVE,
} = userStatus;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vendors', 'userId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
        },
      });
    await queryInterface.addColumn('vendors', 'tin',
      {
        type: Sequelize.STRING,
      });
    await queryInterface.addColumn('vendors', 'website',
      {
        type: Sequelize.STRING,
      });
    await queryInterface.addColumn('vendors', 'status',
      {
        type: Sequelize.ENUM(
          ACTIVE,
          DEACTIVE,
        ),
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vendors', 'userId');
    await queryInterface.removeColumn('vendors', 'tin');
    await queryInterface.removeColumn('vendors', 'website');
    await queryInterface.removeColumn('vendors', 'status');
  },
};
