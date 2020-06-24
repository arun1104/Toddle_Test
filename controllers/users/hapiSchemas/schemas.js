const Joi = require('@hapi/joi');

const newUserSchema = Joi.object({
    userId: Joi.string()
        .trim()
        .min(3)
        .max(20)
        .required(),
    firstName: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required(),
    lastName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    phone: Joi.string()
        .trim()
        .min(10)
        .max(16)
        .required(),
    state: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required(),
    country: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required(),
    currentStatus: Joi.string()
        .trim()
        .min(2)
        .max(16)
        .required(),
});

const userUpdateSchema = Joi.object({
    lastName: Joi.string()
        .trim()
        .min(1)
        .max(50),
    email: Joi.string()
        .email(),
    phone: Joi.string()
        .trim()
        .min(10)
        .max(16),
    currentStatus: Joi.string()
        .trim()
        .min(2)
        .max(16),
});

const newEmployeeSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(8)
        .max(50)
        .required(),
    lastName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    phone: Joi.string()
        .trim()
        .min(10)
        .max(16)
        .required(),
    company: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required(),
    location: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required(),
    designation: Joi.string()
        .trim()
        .min(10)
        .max(16)
        .required(),
    dateOfJoining: Joi.string()
        .trim()
        .min(5)
        .max(20)
        .required(),
});

const updateEmployeeSchema = Joi.object({
    lastName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    phone: Joi.string()
        .trim()
        .min(10)
        .max(16)
        .required(),
    company: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required(),
    location: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required(),
    designation: Joi.string()
        .trim()
        .min(10)
        .max(16)
        .required(),
    dateOfJoining: Joi.string()
        .trim()
        .min(5)
        .max(20)
        .required(),
});

module.exports = { newUserSchema, userUpdateSchema, newEmployeeSchema, updateEmployeeSchema }