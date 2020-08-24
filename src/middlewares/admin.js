import models from '../models';
import validations from '../helpers/validations';
import statusCodes from '../utils/statusCodes';
import userRoles from '../utils/userRoles';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import miscellaneousHelpers from '../helpers/miscellaneous';
import adminService from '../services/admin';

const { vendor, category } = models;
const { adminValidator, idValidator } = validations;
const { errorResponse } = responseHandler;
const { returnErrorMessages } = miscellaneousHelpers;
const { ADMIN } = userRoles;
const { fetchVendor, fetchCategory, findById } = adminService;

const adminValidation = async (req, res, next) => {
  const type = req.path.split('/').pop();
  const { error } = adminValidator(req.body, type);
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

const paramsValidation = async (req, res, next) => {
  const { error } = idValidator(req.params);
  returnErrorMessages(error, res, next);
};

const findVendorById = async (req, res, next) => {
  const { id } = req.params;
  const vendorData = await fetchVendor(id);
  if (!vendorData) {
    return errorResponse(res, statusCodes.notFound, messages.adminVendorFetchNotFound);
  }
  req.vendorData = vendorData.dataValues;
  return next();
};

const categoryExists = async (req, res, next) => {
  const { name } = req.body;
  const categoryData = await fetchCategory(name);
  if (categoryData) {
    return errorResponse(res, statusCodes.conflict, messages.adminAddCategoryDuplicate);
  }
  return next();
};

const findCategoryById = async (req, res, next) => {
  const { id } = req.params;
  const categoryData = await findById(category, id);
  if (!categoryData) {
    return errorResponse(res, statusCodes.notFound, messages.categoryNotFound);
  }
  req.categoryData = categoryData.dataValues;
  return next();
};

export default {
  vendorExists,
  adminValidation,
  isAdmin,
  findVendorById,
  paramsValidation,
  categoryExists,
  findCategoryById,
};
