import dotenv from 'dotenv';
import userRoles from '../utils/userRoles';

dotenv.config();

const { ADMIN } = userRoles;

const data = {
  firstName: 'admin',
  lastName: 'admin',
  email: process.env.ADMIN_EMAIL,
  phone: process.env.ADMIN_PHONE,
  role: ADMIN,
  profileComplete: true,
  isVerified: true,
  address: 'Kacyiru, KG 547, 20',
  subscription: '',
  subscriptionExpires: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default data;
