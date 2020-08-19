import express from 'express';
import authentication from '../controllers/authentication';
import authMiddleware from '../middlewares/authentication';

const { userSignUp, userUpdateProfile } = authentication;
const {
  handleSignupValidation,
  userExists,
  profileUpdate,
  checkTokenAndUser,
  handleUpdateProfileValidation,
} = authMiddleware;
const authenticationRoutes = express.Router();

authenticationRoutes.post('/signup', handleSignupValidation, userExists, userSignUp);
authenticationRoutes.patch('/profile', handleUpdateProfileValidation, profileUpdate, checkTokenAndUser, userUpdateProfile);

export default authenticationRoutes;
