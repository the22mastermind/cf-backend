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

const fetchVendor = async (condition) => {
  const vendorData = await vendor.findOne({ where: { id: condition } });
  return vendorData;
};

export default {
  saveVendor,
  fetchVendor,
};
