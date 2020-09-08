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

const updateModel = async (model, data, condition) => {
  const profile = await model.update(data, { where: condition, returning: true, plain: true });
  return profile[1];
};

const getAllIncludeAll = async (model, category, review, user) => {
  const data = await model.findAll({
    include: [
      { model: category, attributes: ['id', 'name', 'description'] },
      {
        model: review,
        attributes: ['id', 'productId', 'userId', 'average', 'vote', 'comment', 'createdAt'],
        include: [
          {
            model: user,
            attributes: ['firstName', 'lastName'],
          },
        ],
      },
    ],
  });
  return data;
};

const saveRows = async (model, data) => {
  const savedRows = await model.bulkCreate(data);
  return savedRows;
};

const getMyOrders = async (model, condition, orderContent, user) => {
  const data = await model.findAll({
    where: { userId: condition },
    order: [
      ['id', 'DESC'],
    ],
    include: [
      { model: orderContent },
      {
        model: user,
        attributes: ['id', 'firstName', 'lastName', 'phone', 'address'],
      },
    ],
  });
  return data;
};

const getAllOrders = async (model, orderContent, user) => {
  const data = await model.findAll({
    order: [
      ['id', 'DESC'],
    ],
    include: [
      { model: orderContent },
      {
        model: user,
        attributes: ['id', 'firstName', 'lastName', 'phone', 'address'],
      },
    ],
  });
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
  updateModel,
  getAllIncludeAll,
  saveRows,
  getMyOrders,
  getAllOrders,
};
