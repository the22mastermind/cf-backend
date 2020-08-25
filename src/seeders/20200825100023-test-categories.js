module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Drinks',
        description: 'Mineral water, Juice, Milk, and others.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Supermarket',
        description: 'Anything from your favorite supermaket.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Market',
        description: 'Fresh vegetables, fruits, and other fresh products from local markets.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
