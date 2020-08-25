import _ from 'lodash';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import categoryService from '../services/category';
import models from '../models';

const { successResponse, errorResponse } = responseHandler;
const { categoriesFound, categoriesNotFound } = messages;
const { getAll } = categoryService;
const { category } = models;

export default class Category {
  static getAllCategories = async (req, res) => {
    const { rows } = await getAll(category);
    if (_.isEmpty(rows)) {
      return errorResponse(res, statusCodes.notFound, categoriesNotFound, null, rows);
    }
    return successResponse(res, statusCodes.success, categoriesFound, null, rows);
  };
};
