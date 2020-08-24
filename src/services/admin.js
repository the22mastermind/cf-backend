import models from '../models';

const { vendor } = models;

const saveVendor = async (data) => {
  const savedVendor = await vendor.create(data, {
    fields: [
      'name',
      'userId',
      'tin',
      'website',
      'status',
    ],
  });
  return savedVendor.dataValues;
};

export default {
  saveVendor,
};
