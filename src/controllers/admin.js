import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import userRoles from '../utils/userRoles';
import userStatus from '../utils/userStatus';
import service from '../services/services';
import models from '../models';

const { successResponse } = responseHandler;
const {
  adminVendorAddSuccess,
  adminVendorFetchSuccess,
  adminAddCategory,
  adminDeleteCategory,
  productAddSuccess,
} = messages;
const {
  deleteItem,
  saveObj,
} = service;
const {
  category,
  product,
  vendor,
  user,
} = models;

export default class Admin {
  static addVendor = async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      name,
      tin,
      website,
    } = req.body;
    const userInfo = {
      firstName,
      lastName,
      email,
      phone,
      role: userRoles.VENDOR,
      profileComplete: false,
      isVerified: false,
      address,
    };
    const { id } = await saveObj(user, userInfo);
    const vendorInfo = {
      name,
      userId: id,
      tin,
      website,
      status: userStatus.ACTIVE,
    };
    const vendorData = await saveObj(vendor, vendorInfo);
    return successResponse(res, statusCodes.created, adminVendorAddSuccess, null, vendorData);
  };

  static viewSingleVendor = async (req, res) => {
    const data = req.vendorData;
    return successResponse(res, statusCodes.success, adminVendorFetchSuccess, null, data);
  };

  static createCategory = async (req, res) => {
    const {
      name,
      description,
    } = req.body;
    const categoryInfo = {
      name,
      description,
    };
    const categoryData = await saveObj(category, categoryInfo);
    return successResponse(res, statusCodes.created, adminAddCategory, null, categoryData);
  };

  static deleteCategory = async (req, res) => {
    const { id } = req.params;
    const categoryData = await deleteItem(category, id);
    return successResponse(res, statusCodes.success, adminDeleteCategory, null, categoryData);
  };

  static addProduct = async (req, res) => {
    const {
      name,
      description,
      quantity,
      cost,
      currency,
      image,
    } = req.body;
    const data = {
      name,
      description,
      quantity,
      cost: parseInt(cost, 10),
      currency,
      image,
      categoryId: req.categoryData.id,
    };
    const savedObj = await saveObj(product, data);
    return successResponse(res, statusCodes.created, productAddSuccess, null, savedObj);
  };
};
