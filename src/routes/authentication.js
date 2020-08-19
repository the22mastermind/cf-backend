import express from 'express';
import authentication from '../controllers/authentication';
import authMiddleware from '../middlewares/authentication';

const { userSignUp, userUpdateProfile } = authentication;
const {
  handleValidation,
  userExists,
  profileUpdate,
  checkTokenAndUser,
} = authMiddleware;
const authenticationRoutes = express.Router();

authenticationRoutes.post('/signup', handleValidation, userExists, userSignUp);
authenticationRoutes.patch('/profile', handleValidation, profileUpdate, checkTokenAndUser, userUpdateProfile);

export default authenticationRoutes;
