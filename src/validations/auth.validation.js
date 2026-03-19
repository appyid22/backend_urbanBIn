const Joi = require('joi');

const login_schema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required()
});

module.exports = {
  login_schema
};
