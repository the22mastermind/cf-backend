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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'isVerified');
    await queryInterface.removeColumn('users', 'address');
  },
};
