import models from '../models';

const { vendor, category } = models;

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

const saveCategory = async (data) => {
  const savedCategory = await category.create(data, {
    fields: [
      'name',
      'description',
    ],
  });
  return savedCategory.dataValues;
};

const fetchCategory = async (condition) => {
  const categoryData = await category.findOne({ where: { name: condition } });
  return categoryData;
};

export default {
  saveVendor,
  fetchVendor,
  saveCategory,
  fetchCategory,
};
