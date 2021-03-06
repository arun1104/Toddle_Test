'use strict';
const Joi = require('@hapi/joi');

const questionSchema = Joi.object({
  createdBy: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required(),
  surveyId: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required(),
  questions: Joi.array().items(Joi.object({
    question: Joi.string()
      .trim()
      .min(3)
      .max(200)
      .required(),
    type: Joi.string()
      .trim()
      .min(3)
      .max(10)
      .default('boolean'),
    options: Joi.string()
      .trim()
      .min(1)
      .max(10)
      .default(['yes', 'no']),
  }))});

const responseSchema = Joi.object({
  createdBy: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required(),
  questions: Joi.array().items(Joi.object({
    questionId: Joi.string()
      .trim()
      .min(3)
      .max(200)
      .required(),
    answer: Joi.string()
      .trim()
      .min(1)
      .max(10),
  }))});

const surveySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required(),
  createdBy: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required(),
  category: Joi.string()
    .trim()
    .min(3)
    .max(20),
  subject: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required(),
  topic: Joi.string()
    .trim()
    .min(3)
    .max(20),
  questions: Joi.array().items(Joi.string().max(30)),
});

module.exports = { surveySchema, questionSchema, responseSchema };
