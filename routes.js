'use strict';
let authenticationHandler = require('./controllers/authentication/expressHandler');
let surveyHandler = require('./controllers/surveys/expressHandler');

module.exports = {
  login: authenticationHandler.loginRequesthandler,
  signUp: authenticationHandler.signupRequesthandler,
  createSurvey: surveyHandler.createSurveyRequesthandler,
};
