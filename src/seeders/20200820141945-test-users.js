import moment from 'moment';
import userRoles from '../utils/userRoles';
import miscellaneousHelpers from '../helpers/miscellaneous';

const { hashPassword } = miscellaneousHelpers;
const { CONSUMER, ADMIN } = userRoles;

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
    {
      firstName: 'Jonas',
      lastName: 'Brothers',
      email: 'jonasbro@gmail.com',
      phone: '+250783331001',
      password: await hashPassword('jonasbro@1bro'),
      role: CONSUMER,
      profileComplete: true,
      isVerified: true,
      address: 'Kacyiru, KG 7 Ave, 2',
      subscription: 'Premium',
      subscriptionExpires: moment().add(1, 'months').format('MM-DD-YYYY'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Hello',
      lastName: 'World',
      email: 'helloword@gmail.com',
      phone: '+250783331002',
      password: await hashPassword('hellowordl@0'),
      role: CONSUMER,
      profileComplete: true,
      isVerified: false,
      address: 'Kacyiru, KG 7 Ave, 2',
      subscription: 'Premium',
      subscriptionExpires: moment().add(2, 'months').format('MM-DD-YYYY'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin@gmail.com',
      phone: '+250783333333',
      password: await hashPassword('hellowordl@0'),
      role: ADMIN,
      profileComplete: true,
      isVerified: true,
      address: 'Kacyiru, KG 7 Ave, 2',
      subscription: '',
      subscriptionExpires: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {}),
};
