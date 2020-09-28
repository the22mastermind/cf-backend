import express from 'express';
import user from '../controllers/user';
import authMiddleware from '../middlewares/authentication';
import adminMiddleware from '../middlewares/admin';
import userMiddleware from '../middlewares/user';

const {
  getSingleProduct,
  addReview,
  getAllProducts,
  placeOrder,
  getOrders,
  getPlans,
  fetchSubscription,
  userSubscribe,
  fetchAllVendors,
} = user;
const {
  checkTokenAndUser,
} = authMiddleware;
const {
  paramsValidation,
} = adminMiddleware;
const {
  findProductById,
  userValidation,
  findReviews,
  reviewExists,
  checkPlan,
  checkSubscription,
  subscribeValidator,
  placeOrderValidator,
} = userMiddleware;
const userRoutes = express.Router();

userRoutes.get('/product/:id', paramsValidation, checkTokenAndUser, findProductById, getSingleProduct);
userRoutes.post('/product/:id/reviews', paramsValidation, userValidation, checkTokenAndUser, findProductById, reviewExists, findReviews, addReview);
userRoutes.get('/products', checkTokenAndUser, getAllProducts);
userRoutes.post('/orders', placeOrderValidator, checkTokenAndUser, placeOrder);
userRoutes.get('/orders', checkTokenAndUser, getOrders);
userRoutes.get('/plans', checkTokenAndUser, getPlans);
userRoutes.get('/subscription', checkTokenAndUser, fetchSubscription);
userRoutes.post('/plans/:id/subscription', paramsValidation, subscribeValidator, checkTokenAndUser, checkPlan, checkSubscription, userSubscribe);
userRoutes.get('/vendors', checkTokenAndUser, fetchAllVendors);

export default userRoutes;
