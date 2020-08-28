const getAll = async (model) => {
  const { count, rows } = await model.findAndCountAll();
  return { count, rows };
};

const getProductsByCategory = async (model, condition) => {
  const data = await model.findAll({ where: { categoryId: condition } });
  return data;
};

const getByCondition = async (model, condition) => {
  const data = await model.findOne({ where: { userId: condition } });
  return data;
};

const getColumnSum = async (model, column) => {
  const total = await model.sum(column);
  return total;
};

export default {
  getAll,
  getProductsByCategory,
  getByCondition,
  getColumnSum,
};
