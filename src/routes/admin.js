import express from 'express';
import admin from '../controllers/admin';
import authMiddleware from '../middlewares/authentication';
import adminMiddleware from '../middlewares/admin';

const {
  addVendor,
  viewSingleVendor,
  createCategory,
  deleteCategory,
  addProduct,
  updateOrderStatus,
  fetchAllOrders,
  updateSubscriptionStatus,
} = admin;
const {
  userExists,
  checkTokenAndUser,
} = authMiddleware;
const {
  adminValidation,
  vendorExists,
  isAdmin,
  findVendorById,
  paramsValidation,
  categoryExists,
  findCategoryById,
  validateOrderStatus,
  checkOrder,
  validateSubscription,
  findUserById,
  findSubscription,
} = adminMiddleware;
const adminRoutes = express.Router();

adminRoutes.post('/vendor', adminValidation, userExists, vendorExists, checkTokenAndUser, isAdmin, addVendor);
adminRoutes.get('/vendor/:id', paramsValidation, findVendorById, checkTokenAndUser, isAdmin, viewSingleVendor);
adminRoutes.post('/category', adminValidation, checkTokenAndUser, isAdmin, categoryExists, createCategory);
adminRoutes.delete('/category/:id', paramsValidation, checkTokenAndUser, isAdmin, findCategoryById, deleteCategory);
adminRoutes.post('/category/:id/product', paramsValidation, adminValidation, checkTokenAndUser, isAdmin, findCategoryById, addProduct);
adminRoutes.patch('/orders/:id', paramsValidation, validateOrderStatus, checkTokenAndUser, isAdmin, checkOrder, updateOrderStatus);
adminRoutes.get('/orders', checkTokenAndUser, isAdmin, fetchAllOrders);
adminRoutes.patch('/subscriptions/users/:id', paramsValidation, validateSubscription, findUserById, findSubscription, checkTokenAndUser, isAdmin, updateSubscriptionStatus);

export default adminRoutes;
