import moment from 'moment';
import userRoles from '../utils/userRoles';
import miscellaneousHelpers from '../helpers/miscellaneous';

const { hashPassword } = miscellaneousHelpers;
const { CONSUMER } = userRoles;

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [
    {
      firstName: 'Johnny',
      lastName: 'Doe',
      email: 'johnnydoe@gmail.com',
      phone: '+250783331000',
      password: await hashPassword('johnny@1doe'),
      role: CONSUMER,
      profileComplete: true,
      isVerified: false,
      address: 'Kacyiru, KG 7 Ave, 1',
      subscription: 'Premium',
      subscriptionExpires: moment().add(3, 'months').format('MM-DD-YYYY'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {}),
};
