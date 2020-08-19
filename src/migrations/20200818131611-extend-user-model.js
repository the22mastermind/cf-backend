module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'isVerified',
      {
        type: Sequelize.BOOLEAN,
      });
    await queryInterface.addColumn('users', 'address',
      {
        type: Sequelize.STRING,
      });
    await queryInterface.addColumn('users', 'subscription',
      {
        type: Sequelize.STRING,
      });
    await queryInterface.addColumn('users', 'subscriptionExpires',
      {
        type: Sequelize.STRING,
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'isVerified');
    await queryInterface.removeColumn('users', 'address');
    await queryInterface.removeColumn('users', 'subscription');
    await queryInterface.removeColumn('users', 'subscriptionExpires');
  },
};
