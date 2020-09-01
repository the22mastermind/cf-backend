import express from 'express';
import user from '../controllers/user';
import authMiddleware from '../middlewares/authentication';
import adminMiddleware from '../middlewares/admin';
import userMiddleware from '../middlewares/user';

const {
  getSingleProduct,
  addReview,
  getAllProducts,
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
} = userMiddleware;
const userRoutes = express.Router();

userRoutes.get('/product/:id', paramsValidation, checkTokenAndUser, findProductById, getSingleProduct);
userRoutes.post('/product/:id/reviews', paramsValidation, userValidation, checkTokenAndUser, findProductById, reviewExists, findReviews, addReview);
userRoutes.get('/products', checkTokenAndUser, getAllProducts);

export default userRoutes;
