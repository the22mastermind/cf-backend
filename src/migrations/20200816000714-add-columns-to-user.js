import userRoles from '../utils/userRoles';

const {
  ADMIN,
  CONSUMER,
  RIDER,
  VENDOR,
} = userRoles;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'password',
      {
        type: Sequelize.STRING,
      });
    await queryInterface.addColumn('users', 'role',
      {
        type: Sequelize.ENUM(
          ADMIN,
          CONSUMER,
          RIDER,
          VENDOR,
        ),
      });
    await queryInterface.addColumn('users', 'profileComplete',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'password');
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'profileComplete');
  },
};
