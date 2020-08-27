import models from '../models';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import adminService from '../services/admin';
import service from '../services/category';
import validations from '../helpers/validations';
import miscellaneousHelpers from '../helpers/miscellaneous';

const { product, review } = models;
const { errorResponse } = responseHandler;
const { findAllById } = adminService;
const { getAll, getByCondition, getColumnSum } = service;
const { userValidator } = validations;
const { returnErrorMessages } = miscellaneousHelpers;

const userValidation = async (req, res, next) => {
  const { error } = userValidator(req.body);
  returnErrorMessages(error, res, next);
};

const findProductById = async (req, res, next) => {
  const { id } = req.params;
  const productData = await findAllById(product, id);
  if (!productData) {
    return errorResponse(res, statusCodes.notFound, messages.productNotFound);
  }
  req.productData = productData.dataValues;
  return next();
};

const findReviews = async (req, res, next) => {
  const reviewsData = await getAll(review);
  const reviewsTotal = await getColumnSum(review, 'vote');
  req.reviewsData = reviewsData;
  req.reviewsTotal = reviewsTotal;
  return next();
};

const reviewExists = async (req, res, next) => {
  const condition = req.userData.id;
  const reviewData = await getByCondition(review, condition);
  if (reviewData) {
    return errorResponse(res, statusCodes.conflict, messages.reviewConflict);
  }
  return next();
};

export default {
  findProductById,
  userValidation,
  findReviews,
  reviewExists,
};