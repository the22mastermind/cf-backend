import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import responseHandler from '../helpers/responseHandler';
import userRoles from '../utils/userRoles';
import userStatus from '../utils/userStatus';
import authService from '../services/authentication';
import adminService from '../services/admin';

const { successResponse } = responseHandler;
const { adminVendorAddSuccess, adminVendorFetchSuccess } = messages;
const { saveData } = authService;
const { saveVendor } = adminService;

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
    const { id } = await saveData(userInfo);
    const vendorInfo = {
      name,
      userId: id,
      tin,
      website,
      status: userStatus.ACTIVE,
    };
    const vendorData = await saveVendor(vendorInfo);
    return successResponse(res, statusCodes.created, adminVendorAddSuccess, null, vendorData);
  };

  static viewSingleVendor = async (req, res) => {
    const data = req.vendorData;
    return successResponse(res, statusCodes.success, adminVendorFetchSuccess, null, data);
  };
};
