import models from '../models';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import adminService from '../services/admin';

const { product } = models;
const { errorResponse } = responseHandler;
const { findAllById } = adminService;

const findProductById = async (req, res, next) => {
  const { id } = req.params;
  const productData = await findAllById(product, id);
  if (!productData) {
    return errorResponse(res, statusCodes.notFound, messages.productNotFound);
  }
  req.productData = productData.dataValues;
  return next();
};

export default {
  findProductById,
};
