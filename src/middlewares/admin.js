import models from '../models';
import validations from '../helpers/validations';
import statusCodes from '../utils/statusCodes';
import userRoles from '../utils/userRoles';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import miscellaneousHelpers from '../helpers/miscellaneous';
import service from '../services/services';

const {
  vendor,
  category,
  order,
  user,
  subscription,
} = models;
const {
  adminValidator,
  idValidator,
  orderStatusValidator,
  subscriptionValidator,
} = validations;
const { errorResponse } = responseHandler;
const { returnErrorMessages } = miscellaneousHelpers;
const { ADMIN } = userRoles;
const { findById, findByCondition } = service;

const adminValidation = async (req, res, next) => {
  const type = req.path.split('/').pop();
  const { error } = adminValidator(req.body, type);
  returnErrorMessages(error, res, next);
};

const vendorExists = async (req, res, next) => {
  const { tin } = req.body;
  if (tin) {
    const vendorData = await findByCondition(vendor, { tin });
    if (!vendorData) {
      return next();
    }
    return errorResponse(res, statusCodes.conflict, messages.adminVendorAddDuplicate);
  }
  return next();
};

const isAdmin = async (req, res, next) => {
  const { role } = req.userData;
  if (role !== ADMIN) {
    return errorResponse(res, statusCodes.forbidden, messages.adminOnlyResource);
  }
  return next();
};

const paramsValidation = async (req, res, next) => {
  const { error } = idValidator(req.params);
  returnErrorMessages(error, res, next);
};

const findVendorById = async (req, res, next) => {
  const { id } = req.params;
  const vendorData = await findById(vendor, id);
  if (!vendorData) {
    return errorResponse(res, statusCodes.notFound, messages.adminVendorFetchNotFound);
  }
  req.vendorData = vendorData.dataValues;
  return next();
};

const categoryExists = async (req, res, next) => {
  const { name } = req.body;
  const categoryData = await findByCondition(category, { name });
  if (categoryData) {
    return errorResponse(res, statusCodes.conflict, messages.adminAddCategoryDuplicate);
  }
  return next();
};

const findCategoryById = async (req, res, next) => {
  const { id } = req.params;
  const categoryData = await findById(category, id);
  if (!categoryData) {
    return errorResponse(res, statusCodes.notFound, messages.categoryNotFound);
  }
  req.categoryData = categoryData.dataValues;
  return next();
};

const validateOrderStatus = async (req, res, next) => {
  const { error } = orderStatusValidator(req.body);
  returnErrorMessages(error, res, next);
};

const checkOrder = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const orderData = await findById(order, id);
  if (!orderData) {
    return errorResponse(res, statusCodes.notFound, messages.orderNotFound);
  }
  if (orderData.dataValues.status === status) {
    return errorResponse(res, statusCodes.conflict, messages.orderUpdateStatusConflict);
  }
  return next();
};

const validateSubscription = async (req, res, next) => {
  const { error } = subscriptionValidator(req.body);
  returnErrorMessages(error, res, next);
};

const findUserById = async (req, res, next) => {
  const { id } = req.params;
  const userInfo = await findById(user, id);
  if (!userInfo) {
    return errorResponse(res, statusCodes.notFound, messages.userNotExist);
  }
  req.userInfo = userInfo.dataValues;
  return next();
};

const findSubscription = async (req, res, next) => {
  const userId = req.userInfo.id;
  const { status } = req.body;
  const subscriptionData = await findByCondition(subscription, { userId });
  if (!subscriptionData) {
    return errorResponse(res, statusCodes.notFound, messages.subscriptionUpdateStatusNotFound);
  }
  if (subscriptionData.dataValues.status === status) {
    return errorResponse(res, statusCodes.conflict, messages.subscriptionUpdateStatusConflict);
  }
  req.subscriptionData = subscriptionData.dataValues;
  return next();
};

export default {
  vendorExists,
  adminValidation,
  isAdmin,
  findVendorById,
  paramsValidation,
  categoryExists,
  findCategoryById,
  validateOrderStatus,
  checkOrder,
  validateSubscription,
  findUserById,
  findSubscription,
};
