import express from 'express';
import authentication from '../controllers/authentication';
import authMiddleware from '../middlewares/authentication';

const {
  userSignUp,
  userUpdateProfile,
  userLogin,
  passwordResetRequest,
  passwordResetConfirm,
} = authentication;
const {
  handleValidation,
  userExists,
  profileUpdate,
  checkTokenAndUser,
  loginChecker,
  phoneValidator,
  passwordValidator,
  findUser,
} = authMiddleware;
const authenticationRoutes = express.Router();

authenticationRoutes.post('/signup', handleValidation, userExists, userSignUp);
authenticationRoutes.patch('/profile', handleValidation, profileUpdate, checkTokenAndUser, userUpdateProfile);
authenticationRoutes.post('/login', handleValidation, loginChecker, userLogin);
authenticationRoutes.post('/resetpassword', phoneValidator, findUser, passwordResetRequest);
authenticationRoutes.patch('/resetpassword/confirm', passwordValidator, profileUpdate, checkTokenAndUser, passwordResetConfirm);

export default authenticationRoutes;
