import _ from 'lodash';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import service from '../services/services';
import models from '../models';

const { successResponse, errorResponse } = responseHandler;
const {
  categoriesFound,
  categoriesNotFound,
  productsFound,
  productsNotFound,
} = messages;
const { getAll, getProductsByCategory } = service;
const { category, product } = models;

export default class Category {
  static getAllCategories = async (req, res) => {
    const { rows } = await getAll(category);
    if (_.isEmpty(rows)) {
      return errorResponse(res, statusCodes.notFound, categoriesNotFound, null, rows);
    }
    return successResponse(res, statusCodes.success, categoriesFound, null, rows);
  };

  static getProducts = async (req, res) => {
    const { id } = req.params;
    const data = await getProductsByCategory(product, id);
    if (_.isEmpty(data)) {
      return errorResponse(res, statusCodes.notFound, productsNotFound, null, data);
    }
    return successResponse(res, statusCodes.success, productsFound, null, data);
  };
};
