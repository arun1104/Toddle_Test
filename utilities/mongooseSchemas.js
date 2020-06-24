'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: { type: String, required: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
}, { strict: false, timestamps: true });

userSchema.index({ userId: 1 }, { unique: true });
mongoose.model('users', userSchema, 'users');

const userCredentialsSchema = new Schema({
  userId: { type: String, required: true, lowercase: true, trim: true, index: { unique: true } },
  password: { type: String, required: true },
}, { strict: false, timestamps: true });

mongoose.model('user_credentials', userCredentialsSchema, 'user_credentials');

const surveySchema = new Schema({
  createdBy: { type: String, required: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  subject: { type: String },
  topic: { type: String },
}, { strict: false, timestamps: true });

mongoose.model('survey_metadata', surveySchema, 'survey_metadata');

const questionsSchema = new Schema({
  createdBy: { type: String, required: true, lowercase: true, trim: true },
  question: { type: String, required: true },
  type: { type: String, required: true },
  options: [{ type: String }],
  canBeSkipped: { type: Boolean, default: false },
}, { strict: false, timestamps: true });

mongoose.model('survey_questions', questionsSchema, 'survey_questions');
