import Joi from 'joi';
import messages from '../utils/messages';

const handleValidations = (pattern, message, updating) => {
  const validator = updating ? Joi.string().regex(pattern).trim()
    .messages(message) : Joi.string().regex(pattern).trim().required()
    .messages(message);
  return validator;
};

const payloadValidator = (data, type) => {
  const schema = type === 'signup' ? Joi.object({
    firstName: handleValidations(/^([a-zA-Z]{3,30})+$/, { 'string.pattern.base': messages.invalidSignupFirstName }, false),
    lastName: handleValidations(/^([a-zA-Z]{3,30})+$/, { 'string.pattern.base': messages.invalidSignupLastName }, false),
    email: handleValidations(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, { 'string.pattern.base': messages.invalidSignupEmail }, false),
    phone: handleValidations(/^[+]+([0-9]{12})$/, { 'string.pattern.base': messages.invalidSignupPhone }, false),
  }) : type === 'login' ? Joi.object({
    identifier: handleValidations(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}|[+]+([0-9]{12})$/i, { 'string.pattern.base': messages.invalidLoginEmailPhone }, false),
    password: handleValidations(/^(?=.*[!@#$%^&*?])[0-9a-zA-Z!@#$%^&*?]{6,15}$/, { 'string.pattern.base': messages.invalidPassword }, false),
  }) : Joi.object({
    password: handleValidations(/^(?=.*[!@#$%^&*?])[0-9a-zA-Z!@#$%^&*?]{6,15}$/, { 'string.pattern.base': messages.invalidPassword }, true),
    address: handleValidations(/^[0-9a-zA-Z, ]{5,30}$/, { 'string.pattern.base': messages.invalidAddress }, true),
    valid: handleValidations(/^([true])+/, { 'string.pattern.base': messages.invalidOTP }, true),
    profileComplete: handleValidations(/^([true])+/, { 'string.pattern.base': messages.invalidProfileComplete }, true),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

export default {
  payloadValidator,
};
