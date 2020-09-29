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
    quantity: handleValidations(/^[0-9]{1,5}[ ]+(ml|kg|items)$/, { 'string.pattern.base': messages.productQuantityInvalid }, true),
    cost: handleValidations(/^([0-9]{3,6})$/, { 'string.pattern.base': messages.productCostInvalid }, false),
    currency: handleValidations(/^(RWF|CFA|USD)$/, { 'string.pattern.base': messages.productCurrencyInvalid }, false),
    image: handleValidations(/^[a-z0-9._%+-:/]{10,}$/, { 'string.pattern.base': messages.productImageInvalid }, true),
  }) : Joi.object({
    name: handleValidations(/^([a-zA-Z ]{3,30})+$/, { 'string.pattern.base': messages.adminAddCategoryInvalidName }, false),
    description: handleValidations(/^([a-zA-Z,.\n ]{3,300})+$/, { 'string.pattern.base': messages.adminAddCategoryInvalidDesc }, true),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });
};

const userValidator = (data) => {
  const schema = Joi.object({
    vote: handleValidations(/^((0)|(0.5)|(1.0)|(1.5)|(2.0)|(2.5)|(3.0)|(3.5)|(4.0)|(4.5)|(5.0))$/, { 'string.pattern.base': messages.reviewAddInvalidVote }, false),
    comment: handleValidations(/^([a-zA-Z,.\n ]{0,300})$/, { 'string.pattern.base': messages.reviewAddInvalidComment }, false),
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

const orderStatusValidator = (data) => {
  const schema = Joi.object({
    status: handleValidations(/^(processing|ontheway|completed|canceled)$/, { 'string.pattern.base': messages.orderUpdateStatusInvalid }, false),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

const subscriptionValidator = (data) => {
  const schema = Joi.object({
    status: handleValidations(/^(active|pending|expired|canceled)$/, { 'string.pattern.base': messages.subscriptionUpdateStatusInvalid }, false),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

const createMessages = (type, message) => ({
  [`${type}.base`]: message,
  [`${type}.empty`]: message,
  [`${type}.format`]: message,
  [`${type}.min`]: message,
  [`${type}.max`]: message,
  [`${type}.pattern.base`]: message,
  'any.required': message,
  'any.only': message,
  'any.ref': message,
});

const createArrayMessages = (type, message) => ({
  [`${type}.min`]: message,
  'any.required': message,
  'object.unknown': message,
});

const validateSubscribe = (data) => {
  const schema = Joi.object({
    vegan: Joi.boolean().required().messages(createMessages('boolean', `${messages.veganInvalid}`)),
    allergies: Joi.array().items(Joi.string().trim()).messages(createMessages('array', `${messages.allergiesInvalid}`)),
    people: Joi.number().min(1).max(5).required()
      .messages(createMessages('number', `${messages.peopleInvalid}`)),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

const validatePlaceOrder = (data) => {
  const schema = Joi.object({
    total: Joi.number().min(1000).max(1000000).required()
      .messages(createMessages('number', `${messages.orderInvalidTotal}`)),
    currency: Joi.string().regex(/^(RWF|CFA|USD)$/).required().messages(createMessages('array', `${messages.orderInvalidCurrency}`)),
    paymentMode: Joi.string().regex(/^(MOMO|CASH|CARD)$/).required().messages(createMessages('array', `${messages.orderInvalidPayment}`)),
    address: Joi.string().regex(/^[0-9a-zA-Z, ]{5,30}$/).required().messages(createMessages('array', `${messages.invalidAddress}`)),
    contents: Joi.array().items({
      productId: Joi.number().required(),
      productName: Joi.string().required(),
      quantity: Joi.number().min(1).max(100).required(),
      cost: Joi.number().min(1000).max(1000000).required(),
    }).min(1).required()
      .messages(createArrayMessages('array', `${messages.orderInvalidContents}`)),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

const validateAddPlan = (data) => {
  const schema = Joi.object({
    name: Joi.string().regex(/^([A-Z]{3,30})+$/).required().messages(createMessages('string', `${messages.invalidPlanName}`)),
    description: Joi.string().regex(/^([a-zA-Z,.\n ]{20,300})$/).required().messages(createMessages('string', `${messages.invalidPlanDesc}`)),
    price: Joi.number().min(10000).max(1000000).required()
      .messages(createMessages('number', `${messages.invalidPlanPrice}`)),
    currency: Joi.string().regex(/^(RWF|CFA|USD)$/).required().messages(createMessages('string', `${messages.orderInvalidCurrency}`)),
    options: Joi.array().items(Joi.string().trim()).required().messages(createMessages('array', `${messages.invalidPlanOptions}`)),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

const validatePhone = (data) => {
  const schema = Joi.object({
    phone: Joi.string().regex(/^[+]+([0-9]{12})$/).required().messages(createMessages('string', `${messages.invalidSignupPhone}`)),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

const validatePassword = (data) => {
  const schema = Joi.object({
    password: Joi.string().regex(/^(?=.*[!@#$%^&*?])[0-9a-zA-Z!@#$%^&*?]{6,15}$/).required().messages(createMessages('string', `${messages.invalidPassword}`)),
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
  userValidator,
  orderStatusValidator,
  subscriptionValidator,
  validateSubscribe,
  validatePlaceOrder,
  validateAddPlan,
  validatePhone,
  validatePassword,
};
