module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vendors', 'tags',
      {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vendors', 'tags');
  },
};
