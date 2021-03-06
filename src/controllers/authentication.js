import _ from 'lodash';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import miscellaneousHelpers from '../helpers/miscellaneous';
import userRoles from '../utils/userRoles';
import service from '../services/services';
import models from '../models';

const { successResponse, errorResponse } = responseHandler;
const {
  validSignup,
  validProfileUpdate,
  profileUpdateCompleted,
  validLoginCreds,
  passwordReset,
} = messages;
const { createToken, generateOTP, sendOTP } = miscellaneousHelpers;
const { saveObj, updateModel } = service;
const { user } = models;

export default class Authentication {
  static userSignUp = async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phone,
    } = req.body;
    const newUser = {
      firstName,
      lastName,
      email,
      phone,
      role: userRoles.CONSUMER,
      profileComplete: false,
    };
    const savedData = await saveObj(user, newUser);
    const data = _.pick(savedData, 'id', 'firstName', 'phone');
    const token = await createToken(newUser);
    const otp = await generateOTP();
    const otpMessage = `${otp} ${messages.otpMessage}`;
    await sendOTP(phone, otpMessage);
    const userData = { ...data, otp };
    return successResponse(res, statusCodes.created, validSignup, token, userData);
  };

  static userUpdateProfile = async (req, res) => {
    const condition = { id: req.userData.id };
    if (req.updateData.isVerified) {
      await updateModel(user, req.updateData, condition);
      return successResponse(res, statusCodes.success, validProfileUpdate, null, null);
    }
    if (req.updateData.profileComplete) {
      await updateModel(user, req.updateData, condition);
      return successResponse(res, statusCodes.success, profileUpdateCompleted, null, null);
    }
    if (!req.userData.isVerified) {
      return errorResponse(res, statusCodes.unauthorized, messages.userNotVerified);
    }
    const { dataValues } = await updateModel(user, req.updateData, condition);
    const data = _.omit(dataValues, 'password');
    return successResponse(res, statusCodes.success, validProfileUpdate, null, data);
  };

  static userLogin = async (req, res) => {
    const userProfile = _.omit(req.userData, 'password');
    const token = await createToken(userProfile);
    return successResponse(res, statusCodes.success, validLoginCreds, token, userProfile);
  };

  static passwordResetRequest = async (req, res) => {
    const { phone } = req.userData;
    const data = _.omit(req.userData, 'password');
    const token = await createToken(data);
    const otp = await generateOTP();
    const otpMessage = `${otp} ${messages.otpMessage}`;
    await sendOTP(phone, otpMessage);
    const userInfo = { otp, phone };
    return successResponse(res, statusCodes.success, null, token, userInfo);
  };

  static passwordResetConfirm = async (req, res) => {
    const condition = { id: req.userData.id };
    const { dataValues } = await updateModel(user, req.updateData, condition);
    const data = _.omit(dataValues, 'password');
    return successResponse(res, statusCodes.success, passwordReset, null, data);
  };
};
