import express from 'express';
import rider from '../controllers/rider';
import authMiddleware from '../middlewares/authentication';

const { getOpenOrders } = rider;
const {
  checkTokenAndUser,
  isRider,
} = authMiddleware;
const riderRoutes = express.Router();

riderRoutes.get('/orders/open', checkTokenAndUser, isRider, getOpenOrders);

export default riderRoutes;
