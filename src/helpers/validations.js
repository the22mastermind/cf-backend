import Joi from 'joi';
import messages from '../utils/messages';

const handleValidations = (pattern, message) => Joi.string().regex(pattern).trim().required()
  .messages(message);

const signupValidation = (data) => {
  const schema = Joi.object({
    firstName: handleValidations(/^([a-zA-Z]{3,30})+$/, { 'string.pattern.base': messages.invalidSignupFirstName }),
    lastName: handleValidations(/^([a-zA-Z]{3,30})+$/, { 'string.pattern.base': messages.invalidSignupLastName }),
    email: handleValidations(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, { 'string.pattern.base': messages.invalidSignupEmail }),
    phone: handleValidations(/^[+]+([0-9]{12})$/, { 'string.pattern.base': messages.invalidSignupPhone }),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

export default {
  signupValidation,
};
