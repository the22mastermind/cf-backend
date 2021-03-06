import _ from 'lodash';
import moment from 'moment';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import service from '../services/services';
import models from '../models';
import miscellaneousHandlers from '../helpers/miscellaneous';
import notifyHandler from '../helpers/notify';
import orderStatus from '../utils/orderStatus';
import subscriptionStatus from '../utils/subscriptionStatus';

const { successResponse, errorResponse } = responseHandler;
const {
  productFound,
  reviewAdded,
  productsFound,
  productsNotFound,
  orderPlaced,
  ordersFound,
  ordersNotFound,
  plansFound,
  plansNotFound,
  subscriptionNotFound,
  subscriptionFound,
  userSubscribe,
  vendorsFound,
  vendorsNotFound,
  userFcmTokenSynced,
  orderFound,
} = messages;
const {
  saveObj,
  getAllIncludeAll,
  saveRows,
  getMyOrders,
  getAll,
  getSubsByCondition,
  getAllVendors,
  updateModel,
} = service;
const {
  review,
  product,
  category,
  user,
  order,
  orderContent,
  plan,
  subscription,
  vendor,
} = models;
const { computeAverage, orderItemsParser } = miscellaneousHandlers;
const { notifyAdmin } = notifyHandler;

export default class User {
  static getSingleProduct = async (req, res) => {
    const data = req.productData;
    return successResponse(res, statusCodes.success, productFound, null, data);
  };

  static addReview = async (req, res) => {
    const { vote, comment } = req.body;
    let newAverage = null;
    if (_.isEmpty(req.productData.reviews)) {
      newAverage = parseFloat(vote);
    } else {
      const newTotal = req.reviewsTotal + parseFloat(vote);
      const newCount = req.reviewsData.count + 1;
      newAverage = await computeAverage(newTotal, newCount);
    }
    const data = {
      vote: parseFloat(vote),
      comment,
      average: newAverage,
      productId: req.productData.id,
      userId: req.userData.id,
    };
    const savedObj = await saveObj(review, data);
    return successResponse(res, statusCodes.created, reviewAdded, null, savedObj);
  };

  static getAllProducts = async (req, res) => {
    const products = await getAllIncludeAll(product, category, review, user);
    if (_.isEmpty(products)) {
      return errorResponse(res, statusCodes.notFound, productsNotFound, null, null);
    }
    return successResponse(res, statusCodes.success, productsFound, null, products);
  };

  static placeOrder = async (req, res) => {
    const orderData = {
      txId: moment().format('x'),
      userId: req.userData.id,
      status: orderStatus.PLACED,
      total: parseInt(req.body.total, 10),
      currency: req.body.currency,
      paymentMode: req.body.paymentMode,
      address: req.body.address,
    };
    const savedOrder = await saveObj(order, orderData);
    const orderId = savedOrder.id;
    const { contents } = req.body;
    const contentsData = await orderItemsParser(contents, orderId);
    await saveRows(orderContent, contentsData);
    const tokens = [];
    tokens.push(process.env.FCM_TOKEN);
    const notificationData = {
      title: 'New Order Alert!',
      body: `Order total: ${orderData.total} from: ${req.userData.firstName} ${req.userData.lastName}`,
    };
    await notifyAdmin(tokens, notificationData);
    return successResponse(res, statusCodes.created, orderPlaced, null, savedOrder);
  };

  static getOrders = async (req, res) => {
    const userId = req.userData.id;
    const orders = await getMyOrders(order, userId, orderContent, user);
    if (_.isEmpty(orders)) {
      return errorResponse(res, statusCodes.notFound, ordersNotFound, null, null);
    }
    return successResponse(res, statusCodes.success, ordersFound, null, orders);
  };

  static getPlans = async (req, res) => {
    const { rows } = await getAll(plan);
    if (_.isEmpty(rows)) {
      return errorResponse(res, statusCodes.notFound, plansNotFound, null, null);
    }
    return successResponse(res, statusCodes.success, plansFound, null, rows);
  };

  static fetchSubscription = async (req, res) => {
    const condition = { userId: req.userData.id };
    const data = await getSubsByCondition(subscription, plan, condition, user);
    if (_.isEmpty(data)) {
      return errorResponse(res, statusCodes.notFound, subscriptionNotFound, null, null);
    }
    return successResponse(res, statusCodes.success, subscriptionFound, null, data);
  };

  static userSubscribe = async (req, res) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const planId = req.params.id;
    const data = {
      days,
      vegan: req.body.vegan,
      allergies: req.body.allergies,
      people: parseInt(req.body.people, 10),
      status: subscriptionStatus.PENDING,
      expiresOn: moment().add(1, 'month').format(moment.HTML5_FMT.DATETIME_LOCAL_MS),
      userId: req.userData.id,
      planId,
    };
    const savedData = await saveObj(subscription, data);
    return successResponse(res, statusCodes.created, userSubscribe, null, savedData);
  };

  static fetchAllVendors = async (req, res) => {
    const vendors = await getAllVendors(vendor, user);
    if (_.isEmpty(vendors)) {
      return errorResponse(res, statusCodes.notFound, vendorsNotFound, null, null);
    }
    return successResponse(res, statusCodes.success, vendorsFound, null, vendors);
  };

  static syncFcmToken = async (req, res) => {
    const { userFcmToken } = req.body;
    const data = { userFcmToken };
    const condition = { id: req.userData.id };
    const updatedData = await updateModel(user, data, condition);
    return successResponse(res, statusCodes.success, userFcmTokenSynced, null, updatedData);
  };

  static getSingleOrder = async (req, res) => {
    const data = req.orderData;
    return successResponse(res, statusCodes.success, orderFound, null, data);
  };
};
