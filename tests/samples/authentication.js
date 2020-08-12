import userRoles from '../../src/utils/userRoles';

const authSample = {
  emptySignupFirstName: {
    firstName: '',
    lastName: 'doe',
    email: 'johndoe@gmail.com',
    phone: '+250787771001',
  },
  invalidSignupFirstName: {
    firstName: '%',
    lastName: 'doe',
    email: 'johndoe@gmail.com',
    phone: '+250787771001',
  },
  invalidSignupLastName: {
    firstName: 'John',
    lastName: '$',
    email: 'johndoe@gmail.com',
    phone: '+250787771001',
  },
  invalidSignupEmail: {
    firstName: 'John',
    lastName: 'doe',
    email: 'johndoe',
    phone: '+250787771001',
  },
  invalidSignupPhone: {
    firstName: 'John',
    lastName: 'doe',
    email: 'johndoe@gmail.com',
    phone: '0787771001',
  },
  validSignup: {
    firstName: 'John',
    lastName: 'doe',
    email: 'johndoe@gmail.com',
    phone: '+250787771001',
  },
  adminSignup: {
    firstName: 'John',
    lastName: 'doe',
    email: 'john@gmail.com',
    phone: '+250787771000',
    role: userRoles.ADMIN,
  },
};

export default authSample;
