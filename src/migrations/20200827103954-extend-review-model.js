module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('reviews', 'productId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: 'products',
          key: 'id',
        },
      });
    await queryInterface.addColumn('reviews', 'userId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
        },
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('reviews', 'productId');
    await queryInterface.removeColumn('reviews', 'userId');
  },
};
