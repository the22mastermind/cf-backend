import subscriptionStatus from '../utils/subscriptionStatus';

const {
  ACTIVE,
  EXPIRED,
  CANCELED,
  PENDING,
} = subscriptionStatus;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('subscriptions', 'userId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
        },
      });
    await queryInterface.addColumn('subscriptions', 'status',
      {
        type: Sequelize.ENUM(
          ACTIVE,
          EXPIRED,
          CANCELED,
          PENDING,
        ),
      });
    await queryInterface.addColumn('subscriptions', 'expiresOn',
      {
        type: Sequelize.DATE,
        allowNull: false,
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('subscriptions', 'userId');
    await queryInterface.removeColumn('subscriptions', 'status');
    await queryInterface.removeColumn('subscriptions', 'expiresOn');
  },
};
