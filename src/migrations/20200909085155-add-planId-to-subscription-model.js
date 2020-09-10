module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('subscriptions', 'planId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: 'plans',
          key: 'id',
        },
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('subscriptions', 'planId');
  },
};
