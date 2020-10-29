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
  adminDeleteCategory: 'Category deleted successfully',
  categoryNotFound: 'Category not found',
  emptyProductCost: 'cost is not allowed to be empty',
  absentCategoryId: 'categoryId is required',
  productAddSuccess: 'Product added successfully',
  productNameInvalid: 'Product name must contain 3-60 characters. Spaces are allowed',
  productDescInvalid: 'Description must contain 3-300 characters. Spaces are allowed',
  productQuantityInvalid: 'Quantity must be like 200 ml or 5 kg',
  productCostInvalid: 'Cost must be a positive number',
  productCurrencyInvalid: 'Currency must be one of RWF, CFA, USD',
  productImageInvalid: 'Please provide a valid url',
  productCategoryIdInvalid: 'categoryId must be a number',
  categoriesNotFound: 'No categories found at the moment',
  categoriesFound: 'Categories retrieved successfully',
  productsFound: 'Products retrieved successfully',
  productsNotFound: 'No products found at the moment',
  productFound: 'Product details retrieved successfully',
  productNotFound: 'Product not found',
  reviewAdded: 'Review submitted successfully',
  reviewConflict: 'You have already submitted a review',
  reviewAddInvalidComment: 'Comment must contain up to 300 characters and cannot be empty',
  reviewAddEmptyComment: 'comment is not allowed to be empty',
  reviewAddInvalidVote: 'Vote must be between 0-5 with a 0.5 interval',
  reviewAddEmptyVote: 'vote is not allowed to be empty',
  orderPlaced: 'Order placed successfully',
  orderNotPlaced: 'Cannot place an order at this time. Try again later',
  orderEmptyContents: 'Your order must contain products',
  ordersFound: 'Orders retrieved successfully',
  ordersNotFound: 'No orders found at the moment',
  orderInvalidTotal: 'Please provide a valid value for the total',
  orderInvalidCurrency: 'Currency must be one of RWF, CFA, USD',
  orderInvalidPayment: 'Payment mode must be one of CARD, MOMO, CASH',
  orderInvalidContents: 'Contents must have at least a productId, productName, quantity, and cost',
  orderNotFound: 'Order not found',
  orderUpdateStatus: 'Order status updated successfully',
  orderUpdateStatusConflict: 'Order status already updated',
  orderUpdateStatusInvalid: 'status must be one of processing, ontheway, completed, or canceled',
  orderUpdateStatusEmpty: 'status is required',
  subscriptionUpdateStatus: 'Subscription status updated successfully',
  subscriptionUpdateStatusConflict: 'Subscription status already set to that value',
  subscriptionUpdateStatusNotFound: 'No subscription found for the user provided',
  subscriptionUpdateStatusInvalid: 'status must be one of active, pending, expired, or canceled',
  userNotExist: 'User not found',
  subscriptionsNotFound: 'No subscriptions found at the moment',
  subscriptionsFound: 'Subscriptions retrieved successfully',
  plansFound: 'Subscription plans retrieved successfully',
  plansNotFound: 'No subscription plans found at the moment',
  subscriptionNotFound: 'No subscription found at the moment',
  subscriptionFound: 'Subscription retrieved successfully',
  veganInvalid: 'Vegan value must be true or false',
  allergiesInvalid: 'Allergies must be like [Soy,Wheat,...]',
  peopleInvalid: 'people must be less than or equal to 5',
  userSubscribe: 'Subscription submitted successfully. We will review it and get back to you shortly',
  userSubscribePending: 'Subscription already submitted and waiting approval',
  userSubscribeConflict: 'You cannot have more than one active subscription at a time',
  planNotFound: 'The subscription plan you selected could not be found at the moment',
  planCreated: 'Subscription plan created successfully',
  planConflict: 'Subscription plan already exists',
  invalidPlanName: 'Subscription plan name must be between 3-30 characters, in capital letters, without spaces or symbols',
  invalidPlanDesc: 'Subscription plan description is required',
  invalidPlanPrice: 'Subscription plan price must be a number between 10K and 1M',
  invalidPlanOptions: 'Subscription plan options must be an array of strings',
  passwordReset: 'Password reset successfully',
  vendorsFound: 'Vendors retrieved successfully',
  vendorsNotFound: 'No vendors found at the moment',
  usersFound: 'Users retrieved successfully',
  usersNotFound: 'No users found at the moment',
  adminAddUserSuccess: 'User added successfully',
  adminAddUserConflict: 'Add user failed. User already exists',
  adminAddUserInvalidRole: 'Role must be rider',
  adminUpdateUserStatus: 'User status updated successfully',
  adminUpdateUserInvalidStatus: 'User status must be active or deactive',
};

export default messages;
