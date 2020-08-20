import dotenv from 'dotenv';
import userRoles from '../../src/utils/userRoles';

dotenv.config();

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
    phone: process.env.OTP_TO_NUMBER,
  },
  adminSignup: {
    firstName: 'John',
    lastName: 'doe',
    email: 'john@gmail.com',
    phone: '+250787771000',
    role: userRoles.ADMIN,
  },
  emptyUpdateBody: {},
  invalidUpdateBody: {
    password: 'helloworld',
    address: '100',
  },
  validUpdateBody: {
    password: 'hello@1love',
    address: 'Kacyiru, KG 574 St, 33',
  },
  emptyLoginCredentials: {
    identifier: '',
    password: '',
  },
  validLoginEmail: {
    identifier: 'johndoe@gmail.com',
    password: 'hello@1love',
  },
  validLoginPhone: {
    identifier: process.env.OTP_TO_NUMBER,
    password: 'hello@1love',
  },
  inValidLoginCreds: {
    identifier: '0787771001',
    password: 'hello world',
  },
  validLoginUnexistantUser: {
    identifier: 'janedoe@gmail.com',
    password: 'hellolove@1',
  },
  invalidCredentials: {
    identifier: 'jonasbro@gmail.com',
    password: 'hellolove@1',
  },
  loginUnverifiedUser: {
    identifier: 'helloword@gmail.com',
    password: 'hellowordl@0',
  },
  loginUserNotFound: {
    identifier: 'notfound@gmail.com',
    password: 'hellowordl@9',
  },
};

export default authSample;
