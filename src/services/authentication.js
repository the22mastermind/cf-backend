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

const updateProfile = async (data, condition) => {
  const profile = await user.update(data, { where: condition, returning: true, plain: true });
  return profile[1];
};

export default {
  saveData,
  updateProfile,
};
