import express from 'express';
import category from '../controllers/category';
import authMiddleware from '../middlewares/authentication';

const {
  getAllCategories,
} = category;
const {
  checkTokenAndUser,
} = authMiddleware;
const categoryRoutes = express.Router();

categoryRoutes.get('/', checkTokenAndUser, getAllCategories);

export default categoryRoutes;
