import Joi from 'joi';
import messages from '../utils/messages';

const handleValidations = (pattern, message, updating) => {
  const validator = updating ? Joi.string().regex(pattern).trim()
    .messages(message) : Joi.string().regex(pattern).trim().required()
    .messages(message);
  return validator;
};

const signupValidation = (data) => {
  const updating = false;
  const schema = Joi.object({
    firstName: handleValidations(/^([a-zA-Z]{3,30})+$/, { 'string.pattern.base': messages.invalidSignupFirstName }, updating),
    lastName: handleValidations(/^([a-zA-Z]{3,30})+$/, { 'string.pattern.base': messages.invalidSignupLastName }, updating),
    email: handleValidations(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, { 'string.pattern.base': messages.invalidSignupEmail }, updating),
    phone: handleValidations(/^[+]+([0-9]{12})$/, { 'string.pattern.base': messages.invalidSignupPhone }, updating),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

const updateProfileValidation = (data) => {
  const updating = true;
  const schema = Joi.object({
    password: handleValidations(/^(?=.*[!@#$%^&*?])[0-9a-zA-Z!@#$%^&*?]{6,15}$/, { 'string.pattern.base': messages.invalidPassword }, updating),
    address: handleValidations(/^[0-9a-zA-Z, ]{5,30}$/, { 'string.pattern.base': messages.invalidAddress }, updating),
    valid: handleValidations(/^([true])+/, { 'string.pattern.base': messages.invalidOTP }, updating),
    profileComplete: handleValidations(/^([true])+/, { 'string.pattern.base': messages.invalidProfileComplete }, updating),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

export default {
  signupValidation,
  updateProfileValidation,
};
