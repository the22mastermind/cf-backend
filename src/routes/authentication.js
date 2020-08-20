import express from 'express';
import authentication from '../controllers/authentication';
import authMiddleware from '../middlewares/authentication';

const { userSignUp, userUpdateProfile, userLogin } = authentication;
const {
  handleValidation,
  userExists,
  profileUpdate,
  checkTokenAndUser,
  loginChecker,
} = authMiddleware;
const authenticationRoutes = express.Router();

authenticationRoutes.post('/signup', handleValidation, userExists, userSignUp);
authenticationRoutes.patch('/profile', handleValidation, profileUpdate, checkTokenAndUser, userUpdateProfile);
authenticationRoutes.post('/login', handleValidation, loginChecker, userLogin);

export default authenticationRoutes;
