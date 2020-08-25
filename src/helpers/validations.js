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

const adminValidator = (data, type) => {
  const schema = type === 'vendor' ? Joi.object({
    firstName: handleValidations(/^([a-zA-Z]{3,30})+$/, { 'string.pattern.base': messages.invalidSignupFirstName }, false),
    lastName: handleValidations(/^([a-zA-Z]{3,30})+$/, { 'string.pattern.base': messages.invalidSignupLastName }, false),
    email: handleValidations(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, { 'string.pattern.base': messages.invalidSignupEmail }, false),
    phone: handleValidations(/^[+]+([0-9]{12})$/, { 'string.pattern.base': messages.invalidSignupPhone }, false),
    address: handleValidations(/^[0-9a-zA-Z, ]{5,30}$/, { 'string.pattern.base': messages.invalidAddress }, false),
    name: handleValidations(/^[0-9a-zA-Z, ]{5,30}$/, { 'string.pattern.base': messages.invalidAddress }, false),
    tin: handleValidations(/^[0-9, ]{5,30}$/, { 'string.pattern.base': messages.invalidAddress }, true),
    website: handleValidations(/^[A-Z0-9._%+-]+[A-Z0-9.-]+\.[A-Z]{2,10}$/i, { 'string.pattern.base': messages.invalidAddress }, true),
  }) : type === 'product' ? Joi.object({
    name: handleValidations(/^([a-zA-Z ]{3,60})$/, { 'string.pattern.base': messages.productNameInvalid }, false),
    description: handleValidations(/^([a-zA-Z,.;:\n ]{0,300})$/, { 'string.pattern.base': messages.productDescInvalid }, true),
    quantity: handleValidations(/^[0-9]{1,5}[ ]+(ml|kg)$/i, { 'string.pattern.base': messages.productQuantityInvalid }, true),
    cost: handleValidations(/^([0-9]{3,6})$/, { 'string.pattern.base': messages.productCostInvalid }, false),
    currency: handleValidations(/^(RWF|CFA|USD)$/, { 'string.pattern.base': messages.productCurrencyInvalid }, false),
    image: handleValidations(/^[a-z0-9._%+-:/]{10,}$/, { 'string.pattern.base': messages.productImageInvalid }, true),
  }) : Joi.object({
    name: handleValidations(/^([a-zA-Z ]{3,30})+$/, { 'string.pattern.base': messages.adminAddCategoryInvalidName }, false),
    description: handleValidations(/^([a-zA-Z,.\n ]{3,300})+$/, { 'string.pattern.base': messages.adminAddCategoryInvalidDesc }, true),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

const idValidator = (data) => {
  const schema = Joi.object({
    id: handleValidations(/^[0-9]{1,}$/, { 'string.pattern.base': messages.adminVendorFetchBadId }, false),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

export default {
  payloadValidator,
  adminValidator,
  idValidator,
};
