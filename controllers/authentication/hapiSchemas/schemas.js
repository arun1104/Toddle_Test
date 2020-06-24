'use strict';
const Joi = require('@hapi/joi');

const loginSchema = Joi.object({
  userId: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .required(),
  password: Joi.string()
    .trim()
    .min(8)
    .max(50)
    .required(),
});

const signUpSchema = Joi.object({
  userId: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .required(),
  password: Joi.string()
    .trim()
    .min(8)
    .max(50)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  phone: Joi.string()
    .min(10)
    .max(16)
    .required(),
  name: Joi.string()
    .min(10)
    .max(30)
    .required(),
});
module.exports = { loginSchema, signUpSchema };
