module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'riderId',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        references: {
          model: 'riders',
          key: 'id',
        },
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'riderId');
  },
};
