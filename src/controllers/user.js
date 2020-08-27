import _ from 'lodash';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import adminService from '../services/admin';
import models from '../models';
import miscellaneousHandlers from '../helpers/miscellaneous';

const { successResponse } = responseHandler;
const {
  productFound,
  reviewAdded,
} = messages;
const { saveObj } = adminService;
const { review } = models;
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
};
