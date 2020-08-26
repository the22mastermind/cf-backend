const getAll = async (model) => {
  const { count, rows } = await model.findAndCountAll();
  return { count, rows };
};

const getProductsByCategory = async (model, condition) => {
  const data = await model.findAll({ where: { categoryId: condition } });
  return data;
};

export default {
  getAll,
  getProductsByCategory,
};
