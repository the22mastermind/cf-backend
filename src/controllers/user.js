import _ from 'lodash';
import moment from 'moment';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import service from '../services/services';
import models from '../models';
import miscellaneousHandlers from '../helpers/miscellaneous';
import orderStatus from '../utils/orderStatus';

const { successResponse, errorResponse } = responseHandler;
const {
  productFound,
  reviewAdded,
  productsFound,
  productsNotFound,
  orderPlaced,
  ordersFound,
  ordersNotFound,
} = messages;
const {
  saveObj,
  getAllIncludeAll,
  saveRows,
  getMyOrders,
} = service;
const {
  review,
  product,
  category,
  user,
  order,
  orderContent,
} = models;
const { computeAverage, orderItemsParser } = miscellaneousHandlers;

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
    return successResponse(res, statusCodes.created, orderPlaced, null, null);
  };

  static getOrders = async (req, res) => {
    const userId = req.userData.id;
    const orders = await getMyOrders(order, userId, orderContent, user);
    if (_.isEmpty(orders)) {
      return errorResponse(res, statusCodes.notFound, ordersNotFound, null, null);
    }
    return successResponse(res, statusCodes.success, ordersFound, null, orders);
  };
};
