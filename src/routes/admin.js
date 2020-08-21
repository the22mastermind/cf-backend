import express from 'express';
import admin from '../controllers/admin';
import authMiddleware from '../middlewares/authentication';
import adminMiddleware from '../middlewares/admin';

const { addVendor, viewSingleVendor } = admin;
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
} = adminMiddleware;
const adminRoutes = express.Router();

adminRoutes.post('/vendor', adminValidation, userExists, vendorExists, checkTokenAndUser, isAdmin, addVendor);
adminRoutes.get('/vendor/:id', paramsValidation, findVendorById, checkTokenAndUser, isAdmin, viewSingleVendor);

export default adminRoutes;
