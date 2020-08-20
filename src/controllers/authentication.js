import _ from 'lodash';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import miscellaneousHelpers from '../helpers/miscellaneous';
import userRoles from '../utils/userRoles';
import authService from '../services/authentication';

const { successResponse } = responseHandler;
const { validSignup } = messages;
const { createToken, generateOTP, sendOTP } = miscellaneousHelpers;
const { saveData } = authService;

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
};
