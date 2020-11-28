import _ from 'lodash';
import models from '../models';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import service from '../services/services';
import validations from '../helpers/validations';
import miscellaneousHelpers from '../helpers/miscellaneous';
import subscriptionStatus from '../utils/subscriptionStatus';

const {
  product,
  review,
  plan,
  subscription,
  order,
  orderContent,
  user,
} = models;
const { errorResponse } = responseHandler;
const {
  getAll,
  findByCondition,
  getColumnSum,
  findAllById,
  riderGetOrders,
} = service;
const {
  userValidator,
  validateSubscribe,
  validatePlaceOrder,
  validateFcmToken,
} = validations;
const { returnErrorMessages } = miscellaneousHelpers;

const userValidation = async (req, res, next) => {
  const { error } = userValidator(req.body);
  returnErrorMessages(error, res, next);
};

const findProductById = async (req, res, next) => {
  const { id } = req.params;
  const productData = await findAllById(product, id);
  if (!productData) {
    return errorResponse(res, statusCodes.notFound, messages.productNotFound);
  }
  req.productData = productData.dataValues;
  return next();
};

const findReviews = async (req, res, next) => {
  const reviewsData = await getAll(review);
  const reviewsTotal = await getColumnSum(review, 'vote');
  req.reviewsData = reviewsData;
  req.reviewsTotal = reviewsTotal;
  return next();
};

const reviewExists = async (req, res, next) => {
  const condition = req.userData.id;
  const reviewData = await findByCondition(review, { userId: condition });
  if (reviewData) {
    return errorResponse(res, statusCodes.conflict, messages.reviewConflict);
  }
  return next();
};

const checkPlan = async (req, res, next) => {
  const condition = req.params.id;
  const planData = await findByCondition(plan, { id: condition });
  if (!planData) {
    return errorResponse(res, statusCodes.notFound, messages.planNotFound);
  }
  return next();
};

const checkSubscription = async (req, res, next) => {
  const condition = req.userData.id;
  const subscriptionData = await findByCondition(subscription, { userId: condition });
  if (subscriptionData && (subscriptionData.dataValues.status === subscriptionStatus.PENDING)) {
    return errorResponse(res, statusCodes.conflict, messages.userSubscribePending);
  }
  if (subscriptionData && (subscriptionData.dataValues.status === subscriptionStatus.ACTIVE)) {
    return errorResponse(res, statusCodes.conflict, messages.userSubscribeConflict);
  }
  return next();
};

const subscribeValidator = async (req, res, next) => {
  const { error } = validateSubscribe(req.body);
  returnErrorMessages(error, res, next);
};

const placeOrderValidator = async (req, res, next) => {
  const { error } = validatePlaceOrder(req.body);
  returnErrorMessages(error, res, next);
};

const fcmTokenValidator = async (req, res, next) => {
  const { error } = validateFcmToken(req.body);
  returnErrorMessages(error, res, next);
};

const fetchOrderById = async (req, res, next) => {
  const { id } = req.params;
  const condition = { id };
  const orderData = await riderGetOrders(order, orderContent, user, condition);
  if (_.isEmpty(orderData)) {
    return errorResponse(res, statusCodes.notFound, messages.orderNotFound);
  }
  req.orderData = orderData;
  return next();
};

export default {
  findProductById,
  userValidation,
  findReviews,
  reviewExists,
  checkPlan,
  checkSubscription,
  subscribeValidator,
  placeOrderValidator,
  fcmTokenValidator,
  fetchOrderById,
};
