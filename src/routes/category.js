import express from 'express';
import category from '../controllers/category';
import authMiddleware from '../middlewares/authentication';
import adminMiddleware from '../middlewares/admin';

const {
  getAllCategories,
  getProducts,
} = category;
const {
  checkTokenAndUser,
} = authMiddleware;
const {
  paramsValidation,
  findCategoryById,
} = adminMiddleware;
const categoryRoutes = express.Router();

categoryRoutes.get('/', checkTokenAndUser, getAllCategories);
categoryRoutes.get('/:id/products', paramsValidation, checkTokenAndUser, findCategoryById, getProducts);

export default categoryRoutes;
