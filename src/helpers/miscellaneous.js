import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import moment from 'moment';
import _ from 'lodash';
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

const computeAverage = async (total, count) => {
  const average = (total / count).toFixed(2);
  return average;
};

const orderItemsParser = async (items, orderId) => {
  const contents = [];
  items.forEach((item) => {
    const row = { ...item, orderId };
    contents.push(row);
  });
  return contents;
};

const computeTodaysProfit = (data) => {
  const startToday = parseInt(moment().startOf('day').format('x'), 10);
  const endToday = parseInt(moment().endOf('day').format('x'), 10);
  const todaysOrders = data.filter((order) => (_.inRange(parseInt(moment(order.createdAt, moment.ISO_8601).format('x'), 10), startToday, endToday) && order.status === 'completed'));
  const initialValue = 0;
  const sum = todaysOrders.reduce((a, b) => a + b.total, initialValue);
  return sum;
};

export default {
  createToken,
  returnErrorMessages,
  generateOTP,
  sendOTP,
  hashPassword,
  isPasswordValid,
  computeAverage,
  orderItemsParser,
  computeTodaysProfit,
};
