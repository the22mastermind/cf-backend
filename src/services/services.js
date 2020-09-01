const findByCondition = async (model, condition) => {
  const data = await model.findOne({ where: condition });
  return data;
};

const deleteItem = async (model, condition) => {
  const deletedItem = await model.destroy({ where: { id: condition } });
  return deletedItem;
};

const findById = async (model, condition) => {
  const item = await model.findOne({ where: { id: condition } });
  return item;
};

const saveObj = async (model, data) => {
  const savedObj = await model.create(data);
  return savedObj.dataValues;
};

const findAllById = async (model, condition) => {
  const item = await model.findOne({ where: { id: condition }, include: [{ all: true }] });
  return item;
};

const getAll = async (model) => {
  const { count, rows } = await model.findAndCountAll();
  return { count, rows };
};

const getProductsByCategory = async (model, condition) => {
  const data = await model.findAll({ where: { categoryId: condition } });
  return data;
};

const getColumnSum = async (model, column) => {
  const total = await model.sum(column);
  return total;
};

const updateProfile = async (model, data, condition) => {
  const profile = await model.update(data, { where: condition, returning: true, plain: true });
  return profile[1];
};

const getAllIncludeAll = async (model) => {
  const data = await model.findAll({ include: [{ all: true }] });
  return data;
};

export default {
  deleteItem,
  findById,
  saveObj,
  findAllById,
  findByCondition,
  getAll,
  getProductsByCategory,
  getColumnSum,
  updateProfile,
  getAllIncludeAll,
};
