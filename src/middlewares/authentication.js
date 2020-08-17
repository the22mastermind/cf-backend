import models from '../models';
import validations from '../helpers/validations';
import miscellaneousHelpers from '../helpers/miscellaneous';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';

const { user } = models;
const { signupValidation } = validations;
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

export default {
  handleSignupValidation,
  userExists,
};
