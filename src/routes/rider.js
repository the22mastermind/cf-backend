import express from 'express';
import rider from '../controllers/rider';
import authMiddleware from '../middlewares/authentication';
import adminMiddleware from '../middlewares/admin';

const { getOpenOrders, takeOrder } = rider;
const {
  checkTokenAndUser,
  isRider,
} = authMiddleware;
const {
  paramsValidation,
  validateOrderStatus,
} = adminMiddleware;
const riderRoutes = express.Router();

riderRoutes.get('/orders/open', checkTokenAndUser, isRider, getOpenOrders);
riderRoutes.patch('/orders/:id', paramsValidation, validateOrderStatus, checkTokenAndUser, isRider, takeOrder);

export default riderRoutes;
