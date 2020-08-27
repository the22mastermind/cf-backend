import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';

const { successResponse } = responseHandler;
const {
  productFound,
} = messages;

export default class User {
  static getSingleProduct = async (req, res) => {
    const data = req.productData;
    return successResponse(res, statusCodes.success, productFound, null, data);
  };
};
