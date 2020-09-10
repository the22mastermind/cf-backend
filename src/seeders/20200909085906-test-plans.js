module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('plans', [
      {
        name: 'BASIC',
        description: 'Some good description of this basic plan, including all options available',
        price: 300000,
        currency: 'RWF',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'PREMIUM',
        description: 'Some good description of this premium plan, including all options available & extra perks',
        price: 1000000,
        currency: 'RWF',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('plans', null, {});
  },
};
