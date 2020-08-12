import express from 'express';
import authentication from '../controllers/authentication';
import authMiddleware from '../middlewares/authentication';

const { userSignUp } = authentication;
const { handleSignupValidation, userExists } = authMiddleware;
const authenticationRoutes = express.Router();

authenticationRoutes.post('/signup', handleSignupValidation, userExists, userSignUp);

export default authenticationRoutes;
