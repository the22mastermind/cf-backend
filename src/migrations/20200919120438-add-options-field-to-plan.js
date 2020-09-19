module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('plans', 'options',
      {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('plans', 'options');
  },
};
