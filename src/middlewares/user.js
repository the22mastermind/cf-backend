import _ from 'lodash';
import models from '../models';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import service from '../services/services';
import validations from '../helpers/validations';
import miscellaneousHelpers from '../helpers/miscellaneous';

const { product, review } = models;
const { errorResponse } = responseHandler;
const {
  getAll,
  findByCondition,
  getColumnSum,
  findAllById,
} = service;
const { userValidator } = validations;
const { returnErrorMessages } = miscellaneousHelpers;

const userValidation = async (req, res, next) => {
  const type = req.path.split('/').pop();
  const { error } = userValidator(req.body, type);
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
  const reviewData = await findByCondition(review, { userId: condition });
  if (reviewData) {
    return errorResponse(res, statusCodes.conflict, messages.reviewConflict);
  }
  return next();
};

const hasContents = async (req, res, next) => {
  const { contents } = req.body;
  if (_.isEmpty(contents)) {
    return errorResponse(res, statusCodes.badRequest, messages.orderEmptyContents);
  }
  return next();
};

export default {
  findProductById,
  userValidation,
  findReviews,
  reviewExists,
  hasContents,
};
