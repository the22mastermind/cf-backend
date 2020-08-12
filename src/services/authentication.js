import models from '../models';

const { user } = models;

const saveData = async (data) => {
  const {
    firstName, lastName, email, phone, role, profileComplete,
  } = data;
  const savedData = await user.create({
    firstName,
    lastName,
    email,
    phone,
    role,
    profileComplete,
  });
  return savedData.dataValues;
};

export default {
  saveData,
};
