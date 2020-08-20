import _ from 'lodash';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import miscellaneousHelpers from '../helpers/miscellaneous';
import userRoles from '../utils/userRoles';
import authService from '../services/authentication';

const { successResponse } = responseHandler;
const {
  validSignup,
  validProfileUpdate,
  profileUpdateCompleted,
  validLoginCreds,
} = messages;
const { createToken, generateOTP, sendOTP } = miscellaneousHelpers;
const { saveData, updateProfile } = authService;

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
    const savedData = await saveData(newUser);
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
      await updateProfile(req.updateData, condition);
      return successResponse(res, statusCodes.success, validProfileUpdate, null, null);
    }
    if (req.updateData.profileComplete) {
      await updateProfile(req.updateData, condition);
      return successResponse(res, statusCodes.success, profileUpdateCompleted, null, null);
    }
    const { dataValues } = await updateProfile(req.updateData, condition);
    const data = _.omit(dataValues, 'password');
    return successResponse(res, statusCodes.success, validProfileUpdate, null, data);
  };

  static userLogin = async (req, res) => {
    const userProfile = _.omit(req.userData, 'password');
    const token = await createToken(userProfile);
    return successResponse(res, statusCodes.success, validLoginCreds, token, userProfile);
  };
};
