module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('riders', 'userId',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
        },
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('riders', 'userId');
  },
};
