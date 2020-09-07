module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orderContents', 'orderId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: 'orders',
          key: 'id',
        },
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orderContents', 'orderId');
  },
};
