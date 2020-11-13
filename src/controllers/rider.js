import _ from 'lodash';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import service from '../services/services';
import models from '../models';
import notifyHandler from '../helpers/notify';

const { successResponse, errorResponse } = responseHandler;
const { ordersFound, ordersNotFound, riderTakeOrder } = messages;
const { riderGetOrders, findById, updateModel } = service;
const {
  user,
  order,
  orderContent,
} = models;
const { orderStatusUpdateNotification } = notifyHandler;

export default class User {
  static getOpenOrders = async (req, res) => {
    const condition = { status: 'placed' };
    const orders = await riderGetOrders(order, orderContent, user, condition);
    if (_.isEmpty(orders)) {
      return errorResponse(res, statusCodes.notFound, ordersNotFound, null, null);
    }
    return successResponse(res, statusCodes.success, ordersFound, null, orders);
  };

  static takeOrder = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const orderData = await findById(order, id);
    const riderId = req.riderData.id;
    const data = { riderId, status };
    const condition = { id: orderData.dataValues.id };
    const myOrder = await updateModel(order, data, condition);
    const { userId } = orderData.dataValues;
    const clientData = await findById(user, userId);
    const { userFcmToken } = clientData.dataValues;
    const notificationData = {
      title: `Your order #${orderData.dataValues.id} has been accepted!`,
      body: `Hi, I'm ${req.riderData.name}. I will be delivering your order today.`,
    };
    await orderStatusUpdateNotification(userFcmToken, notificationData);
    return successResponse(res, statusCodes.success, riderTakeOrder, null, myOrder);
  };
};
