import dotenv from 'dotenv';
import models from '../models';
import miscellaneousHelpers from '../helpers/miscellaneous';
import adminData from './adminData';

dotenv.config();

const { user } = models;
const { hashPassword } = miscellaneousHelpers;

const createAdmin = async (data) => {
  const password = await hashPassword(process.env.ADMIN_PASSWORD);
  const saveData = { ...data, password };
  const { dataValues } = await user.create(saveData, {
    fields: [
      'firstName',
      'lastName',
      'email',
      'phone',
      'password',
      'role',
      'profileComplete',
      'isVerified',
      'address',
      'subscription',
      'subscriptionExpires',
      'createdAt',
      'updatedAt',
    ],
  });
  return dataValues;
};

createAdmin(adminData);

export default createAdmin;
