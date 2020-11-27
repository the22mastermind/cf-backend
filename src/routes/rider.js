import express from 'express';
import rider from '../controllers/rider';
import authMiddleware from '../middlewares/authentication';
import adminMiddleware from '../middlewares/admin';
import userMiddleware from '../middlewares/user';

const {
  getOpenOrders,
  riderUpdateOrder,
  getAssignedOrders,
} = rider;
const {
  checkTokenAndUser,
  isRider,
} = authMiddleware;
const {
  paramsValidation,
  validateOrderStatus,
} = adminMiddleware;
const { checkOrderStatus } = userMiddleware;
const riderRoutes = express.Router();

riderRoutes.get('/orders/open', checkTokenAndUser, isRider, getOpenOrders);
riderRoutes.patch('/orders/:id', paramsValidation, validateOrderStatus, checkTokenAndUser, isRider, checkOrderStatus, riderUpdateOrder);
riderRoutes.get('/orders', checkTokenAndUser, isRider, getAssignedOrders);

export default riderRoutes;
