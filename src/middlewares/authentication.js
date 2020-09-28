import jwt from 'jsonwebtoken';
import models from '../models';
import validations from '../helpers/validations';
import miscellaneousHelpers from '../helpers/miscellaneous';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import service from '../services/services';

const { user } = models;
const { payloadValidator, validatePhone, validatePassword } = validations;
const { returnErrorMessages, hashPassword, isPasswordValid } = miscellaneousHelpers;
const { errorResponse } = responseHandler;
const {
  findByCondition,
} = service;

const handleValidation = async (req, res, next) => {
  const type = req.path.split('/').pop();
  const { error } = payloadValidator(req.body, type);
  returnErrorMessages(error, res, next);
};

const userExists = async (req, res, next) => {
  const { email, phone } = req.body;
  let userData = await findByCondition(user, { email });
  if (!userData) {
    userData = await findByCondition(user, { phone });
  }
  if (!userData) {
    return next();
  }
  return errorResponse(res, statusCodes.conflict, messages.signupConflict);
};

const profileUpdate = async (req, res, next) => {
  const {
    valid,
    address,
    profileComplete,
  } = req.body;
  let { password } = req.body;
  if (valid && JSON.parse(valid)) {
    req.updateData = { isVerified: true };
    return next();
  }
  if (password) {
    password = await hashPassword(password);
    req.updateData = { password };
    return next();
  }
  if (address) {
    req.updateData = { address };
    return next();
  }
  if (profileComplete) {
    req.updateData = { profileComplete: true };
    return next();
  }
  return errorResponse(res, statusCodes.badRequest, messages.invalidUpdateBody);
};

const checkTokenAndUser = async (req, res, next) => {
  let token = req.get('authorization');
  if (!token) {
    return errorResponse(res, statusCodes.badRequest, messages.absentToken);
  }
  token = token.split(' ').pop();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;
    const userData = await findByCondition(user, { email });
    req.userData = userData.dataValues;
    return next();
  } catch (error) {
    return errorResponse(res, statusCodes.badRequest, messages.invalidToken);
  }
};

const loginChecker = async (req, res, next) => {
  const { identifier, password } = req.body;
  let userProfile = await findByCondition(user, { email: identifier });
  if (!userProfile) {
    userProfile = await findByCondition(user, { phone: identifier });
  }
  if (!userProfile) {
    return errorResponse(res, statusCodes.notFound, messages.loginUserNotFound);
  }
  if (!userProfile.dataValues.isVerified) {
    return errorResponse(res, statusCodes.unauthorized, messages.loginUserNotVerified);
  }
  const hashedPassword = userProfile.dataValues.password;
  const doesPasswordsMatch = await isPasswordValid(password, hashedPassword);
  if (!doesPasswordsMatch) {
    return errorResponse(res, statusCodes.unauthorized, messages.invalidCredentials);
  }
  req.userData = userProfile.dataValues;
  return next();
};

const phoneValidator = async (req, res, next) => {
  const { error } = validatePhone(req.body);
  returnErrorMessages(error, res, next);
};

const passwordValidator = async (req, res, next) => {
  const { error } = validatePassword(req.body);
  returnErrorMessages(error, res, next);
};

const findUser = async (req, res, next) => {
  const { phone } = req.body;
  const userProfile = await findByCondition(user, { phone });
  if (!userProfile) {
    return errorResponse(res, statusCodes.notFound, messages.loginUserNotFound);
  }
  req.userData = userProfile.dataValues;
  return next();
};

export default {
  handleValidation,
  userExists,
  profileUpdate,
  checkTokenAndUser,
  loginChecker,
  phoneValidator,
  passwordValidator,
  findUser,
};
