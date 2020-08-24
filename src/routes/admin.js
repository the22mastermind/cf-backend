import express from 'express';
import admin from '../controllers/admin';
import authMiddleware from '../middlewares/authentication';
import adminMiddleware from '../middlewares/admin';

const { addVendor } = admin;
const {
  userExists,
  checkTokenAndUser,
} = authMiddleware;
const {
  adminValidation,
  vendorExists,
  isAdmin,
} = adminMiddleware;
const adminRoutes = express.Router();

adminRoutes.post('/vendor', adminValidation, userExists, vendorExists, checkTokenAndUser, isAdmin, addVendor);

export default adminRoutes;
