module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      days: { type: Sequelize.ARRAY(Sequelize.STRING), allowNull: false },
      vegan: { type: Sequelize.BOOLEAN, allowNull: false },
      allergies: { type: Sequelize.ARRAY(Sequelize.STRING), allowNull: true },
      people: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('subscriptions');
  },
};
