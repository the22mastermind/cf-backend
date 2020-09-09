module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('subscriptions', [
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        vegan: false,
        allergies: ['Soy', 'Wheat'],
        people: 1,
        status: 'pending',
        expiresOn: new Date('2025-12-17T03:24:00'),
        userId: 5,
        planId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        vegan: false,
        allergies: ['Wheat'],
        people: 3,
        status: 'pending',
        expiresOn: new Date('2022-12-17T03:24:00'),
        userId: 2,
        planId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('subscriptions', null, {});
  },
};
