const messages = {
  routeNotFound: 'Route not found',
  emptySignupFirstName: 'firstName is not allowed to be empty',
  invalidSignupFirstName: 'First name must be between 3-30 characters without spaces or special characters',
  invalidSignupLastName: 'Last name must be between 3-30 characters without spaces or special characters',
  invalidSignupEmail: 'Please provide a valid email. eg. example@domain.com',
  invalidSignupPhone: 'Please provide a valid phone number. eg. +250787771001',
  adminSignup: 'role is not allowed',
  validSignup: 'Signup successful',
  signupConflict: 'Account creation failed! Email or phone number already registered',
  otpMessage: 'is your ChowFood verification code',
  userNotFound: 'Oops, user not found or not recognized. Please make sure you are logged in and try again',
  invalidPassword: 'Password must be between 6-15 characters, containing numbers and special characters. Spaces not allowed',
  invalidAddress: 'Please provide a valid address with neighborhood name, street number, and house number. eg. Kacyiru, KG 574 St, 20',
  invalidUpdateBody: 'Please provide at least one value to update',
  validProfileUpdate: 'Profile updated successfully',
  profileUpdateCompleted: 'Profile set up completed successfully',
  absentToken: 'Cannot process your request! Please make sure you are logged in and try again',
  invalidToken: 'Invalid token! Please make sure you are logged in and try again',
  userNotVerified: 'Account not verified! Please verify your account first',
  invalidOTP: 'Please provide a valid OTP',
  invalidProfileComplete: 'Cannot process your request',
  emptyLoginCreds: 'identifier is not allowed to be empty, password is not allowed to be empty',
  invalidLoginCreds: 'Please provide a valid email. eg. example@domain.com or phone number. eg. +250787771001, Password must be between 6-15 characters, containing numbers and special characters. Spaces not allowed',
  validLoginCreds: 'Login successful',
  loginUserNotFound: 'User not found. Please make sure you are registered and your account is verified',
  invalidLoginEmailPhone: 'Please provide a valid email. eg. example@domain.com or phone number. eg. +250787771001',
  loginUserNotVerified: 'You are almost there. Just verify your account first',
  invalidCredentials: 'Invalid identifier or password. Please try again',
  adminVendorAddEmpty: 'firstName is required, lastName is required, email is required, phone is required, address is required, name is required',
  adminVendorAddSuccess: 'Vendor created successfully',
  adminVendorAddDuplicate: 'Cannot create vendor account. TIN already registered',
  adminVendorAddEmptyName: 'name is not allowed to be empty',
  adminOnlyResource: 'You are not allowed to perform this action. In fact, if you try again, our bots will come for you',
  adminVendorFetchSuccess: 'Vendor retrieved successfully',
  adminVendorFetchNotFound: 'Vendor not found',
  adminVendorFetchBadId: 'Id must be a number',
  adminAddCategory: 'Category created successfully',
  adminAddCategoryDuplicate: 'Category name exists already',
  adminAddCategoryEmptyName: 'name is not allowed to be empty',
  adminAddCategoryInvalidName: 'Category name cannot contain numbers or symbols',
  adminAddCategoryInvalidDesc: 'Category description must contain 3-300 characters',
};

export default messages;
