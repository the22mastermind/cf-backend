import _ from 'lodash';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import service from '../services/services';
import models from '../models';
import notifyHandler from '../helpers/notify';
import notificationMessageHandler from '../helpers/notificationMessage';

const { successResponse, errorResponse } = responseHandler;
const {
  ordersFound,
  ordersNotFound,
  riderUpdateOrder,
  riderOrdersNotFound,
} = messages;
const { riderGetOrders, findById, updateModel } = service;
const {
  user,
  order,
  orderContent,
} = models;
const { orderStatusUpdateNotification } = notifyHandler;
const { notificationMessageBuilder } = notificationMessageHandler;

export default class User {
  static getOpenOrders = async (req, res) => {
    const condition = { status: 'placed' };
    const orders = await riderGetOrders(order, orderContent, user, condition);
    if (_.isEmpty(orders)) {
      return errorResponse(res, statusCodes.notFound, ordersNotFound, null, null);
    }
    return successResponse(res, statusCodes.success, ordersFound, null, orders);
  };

  static riderUpdateOrder = async (req, res) => {
    const { status } = req.body;
    const riderId = req.riderData.id;
    const data = { riderId, status };
    const condition = { id: req.orderData.id };
    const myOrder = await updateModel(order, data, condition);
    const { userId } = req.orderData;
    const clientData = await findById(user, userId);
    const { userFcmToken } = clientData.dataValues;
    const payload = {
      orderId: req.orderData.id,
      riderName: req.riderData.name,
    };
    const notificationData = await notificationMessageBuilder(status, payload);
    await orderStatusUpdateNotification(userFcmToken, notificationData);
    return successResponse(res, statusCodes.success, riderUpdateOrder, null, myOrder);
  };

  static getAssignedOrders = async (req, res) => {
    const condition = { riderId: req.riderData.id };
    const orders = await riderGetOrders(order, orderContent, user, condition);
    if (_.isEmpty(orders)) {
      return errorResponse(res, statusCodes.notFound, riderOrdersNotFound, null, null);
    }
    return successResponse(res, statusCodes.success, ordersFound, null, orders);
  };
};
