import orderStatus from '../utils/orderStatus';

const {
  PLACED,
  PROCESSING,
  ONTHEWAY,
  COMPLETED,
  CANCELED,
} = orderStatus;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'userId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
        },
      });
    await queryInterface.addColumn('orders', 'status',
      {
        type: Sequelize.ENUM(
          PLACED,
          PROCESSING,
          ONTHEWAY,
          COMPLETED,
          CANCELED,
        ),
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'userId');
    await queryInterface.removeColumn('orders', 'status');
  },
};
