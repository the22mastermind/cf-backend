/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import statusCodes from '../utils/statusCodes';
import responseHandler from './responseHandler';
import twilioClient from '../config/twilioConfig';

const { errorResponse } = responseHandler;
const { client } = twilioClient;

const createToken = async (data) => {
  const token = jwt.sign(
    data,
    process.env.JWT_SECRET,
    {
      expiresIn: `${process.env.TOKEN_EXPIRES_IN}`,
    },
  );
  return token;
};

const returnErrorMessages = (errors, res, next) => {
  if (errors) {
    const { details } = errors;
    const errorMessages = details.map(error => error.message.replace(/['"]/g, '')).join(', ');
    return errorResponse(res, statusCodes.badRequest, errorMessages);
  }
  return next();
};

const generateOTP = async () => {
  const otp = Math.floor(100000 + (Math.random() * 900000));
  return otp;
};

const sendOTP = async (phone, text) => {
  await client.messages.create({
    body: text,
    from: process.env.TW_FROM_NUMBER,
    to: phone,
  });
};

const hashPassword = async (data) => {
  const hashedPassword = await bcrypt.hash(data, 10);
  return hashedPassword;
};

const isPasswordValid = async (password, savedPassword) => {
  const isValid = await bcrypt.compare(password, savedPassword);
  return isValid;
};

export default {
  createToken,
  returnErrorMessages,
  generateOTP,
  sendOTP,
  hashPassword,
  isPasswordValid,
};
