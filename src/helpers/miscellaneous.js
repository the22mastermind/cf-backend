import jwt from 'jsonwebtoken';
import statusCodes from '../utils/statusCodes';
import responseHandler from './responseHandler';

const { errorResponse } = responseHandler;

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

export default {
  createToken,
  returnErrorMessages,
};
