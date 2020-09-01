import _ from 'lodash';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import service from '../services/services';
import models from '../models';
import miscellaneousHandlers from '../helpers/miscellaneous';

const { successResponse, errorResponse } = responseHandler;
const {
  productFound,
  reviewAdded,
  productsFound,
  productsNotFound,
} = messages;
const { saveObj, getAllIncludeAll } = service;
const { review, product } = models;
const { computeAverage } = miscellaneousHandlers;

export default class User {
  static getSingleProduct = async (req, res) => {
    const data = req.productData;
    return successResponse(res, statusCodes.success, productFound, null, data);
  };

  static addReview = async (req, res) => {
    const { vote, comment } = req.body;
    let newAverage = null;
    if (_.isEmpty(req.productData.reviews)) {
      newAverage = parseFloat(vote);
    } else {
      const newTotal = req.reviewsTotal + parseFloat(vote);
      const newCount = req.reviewsData.count + 1;
      newAverage = await computeAverage(newTotal, newCount);
    }
    const data = {
      vote: parseFloat(vote),
      comment,
      average: newAverage,
      productId: req.productData.id,
      userId: req.userData.id,
    };
    const savedObj = await saveObj(review, data);
    return successResponse(res, statusCodes.created, reviewAdded, null, savedObj);
  };

  static getAllProducts = async (req, res) => {
    const products = await getAllIncludeAll(product);
    if (_.isEmpty(products)) {
      return errorResponse(res, statusCodes.notFound, productsNotFound, null, null);
    }
    return successResponse(res, statusCodes.success, productsFound, null, products);
  };
};
