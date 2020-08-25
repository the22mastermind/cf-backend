const getAll = async (model) => {
  const { count, rows } = await model.findAndCountAll();
  return { count, rows };
};

export default {
  getAll,
};
