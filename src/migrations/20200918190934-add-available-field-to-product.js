module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'available',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'available');
  },
};
