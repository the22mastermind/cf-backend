const messages = {
  routeNotFound: 'Route not found',
  emptySignupFirstName: 'firstName is not allowed to be empty',
  invalidSignupFirstName: 'First name must be between 3-30 characters without spaces or special characters',
  invalidSignupLastName: 'Last name must be between 3-30 characters without spaces or special characters',
  invalidSignupEmail: 'Please provide a valid email. eg. example@domain.com',
  invalidSignupPhone: 'Please provide a valid phone number. eg. +250787771001',
  adminSignup: 'role is not allowed',
  validSignup: 'Signup successful',
  signupConflict: 'Signup failed! Email or phone number already registered',
  otpMessage: 'is your ChowFood verification code',
  userNotFound: 'Oops, user not found or not recognized. Please make sure you are logged in and try again',
  invalidPassword: 'Password must be between 6-15 characters, containing numbers and special characters. Spaces not allowed',
  invalidAddress: 'Please provide a valid address with neighborhood name, street number, and house number. eg. Kacyiru, KG 574 St, 20',
  invalidUpdateBody: 'Please provide at least one value to update',
  validProfileUpdate: 'Profile updated successfully',
};

export default messages;
