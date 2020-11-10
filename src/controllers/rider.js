import _ from 'lodash';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import service from '../services/services';
import models from '../models';

const { successResponse, errorResponse } = responseHandler;
const { ordersFound, ordersNotFound } = messages;
const { riderGetOrders } = service;
const {
  user,
  order,
  orderContent,
} = models;

export default class User {
  static getOpenOrders = async (req, res) => {
    const condition = { status: 'placed' };
    const orders = await riderGetOrders(order, orderContent, user, condition);
    if (_.isEmpty(orders)) {
      return errorResponse(res, statusCodes.notFound, ordersNotFound, null, null);
    }
    return successResponse(res, statusCodes.success, ordersFound, null, orders);
  };
};
