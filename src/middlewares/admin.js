import models from '../models';
import validations from '../helpers/validations';
import statusCodes from '../utils/statusCodes';
import userRoles from '../utils/userRoles';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import miscellaneousHelpers from '../helpers/miscellaneous';

const { vendor } = models;
const { adminValidator } = validations;
const { errorResponse } = responseHandler;
const { returnErrorMessages } = miscellaneousHelpers;
const { ADMIN } = userRoles;

const adminValidation = async (req, res, next) => {
  const { error } = adminValidator(req.body);
  returnErrorMessages(error, res, next);
};

const vendorExists = async (req, res, next) => {
  const { tin } = req.body;
  if (tin) {
    const vendorData = await vendor.findOne({ where: { tin } });
    if (!vendorData) {
      return next();
    }
    return errorResponse(res, statusCodes.conflict, messages.adminVendorAddDuplicate);
  }
  return next();
};

const isAdmin = async (req, res, next) => {
  const { role } = req.userData;
  if (role !== ADMIN) {
    return errorResponse(res, statusCodes.forbidden, messages.adminOnlyResource);
  }
  return next();
};

export default {
  vendorExists,
  adminValidation,
  isAdmin,
};
