const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().trim().max(100).required(),
  password: Joi.string().min(3).max(100).required(),
}).unknown(false);

function buildValidator(schema, property = 'body') {
  return (req, res, next) => {
    const options = {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    };

    const { value, error } = schema.validate(req[property], options);

    if (error) {
      error.isJoi = true;
      return next(error);
    }

    req[property] = value;
    return next();
  };
}

const validateLogin = buildValidator(loginSchema, 'body');

module.exports = {
  validateLogin,
};

