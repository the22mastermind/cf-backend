import jwt from 'jsonwebtoken';
import models from '../models';
import validations from '../helpers/validations';
import miscellaneousHelpers from '../helpers/miscellaneous';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';

const { user } = models;
const { signupValidation, updateProfileValidation } = validations;
const { returnErrorMessages } = miscellaneousHelpers;
const { errorResponse } = responseHandler;

const handleSignupValidation = async (req, res, next) => {
  const { error } = signupValidation(req.body);
  returnErrorMessages(error, res, next);
};

const userExists = async (req, res, next) => {
  const { email, phone } = req.body;
  let userData = await user.findOne({ where: { email } });
  if (!userData) {
    userData = await user.findOne({ where: { phone } });
  }
  if (!userData) {
    return next();
  }
  return errorResponse(res, statusCodes.conflict, messages.signupConflict);
};

const profileUpdate = async (req, res, next) => {
  const {
    valid,
    password,
    address,
    profileComplete,
  } = req.body;
  if (valid && JSON.parse(valid)) {
    req.updateData = { isVerified: true };
    return next();
  }
  if (password) {
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
    const userData = await user.findOne({ where: { email } });
    if (!req.updateData.isVerified && !userData.dataValues.isVerified) {
      return errorResponse(res, statusCodes.unauthorized, messages.userNotVerified);
    }
    req.userData = userData.dataValues;
    return next();
  } catch (error) {
    return errorResponse(res, statusCodes.badRequest, messages.invalidToken);
  }
};

const handleUpdateProfileValidation = async (req, res, next) => {
  const { error } = updateProfileValidation(req.body);
  returnErrorMessages(error, res, next);
};

export default {
  handleSignupValidation,
  userExists,
  profileUpdate,
  checkTokenAndUser,
  handleUpdateProfileValidation,
};
