'use strict';
const { surveySchema, questionSchema, responseSchema } = require('./hapiSchemas/schemas');
const survey = require('./survey');
const Logger = require('../../utilities/logger');

class ExpressHandler {
  constructor() {
    this.survey = survey;
    this.createSurveyRequesthandler = this.createSurveyRequesthandler.bind(this);
    this.createSurveyQuestionRequesthandler = this.createSurveyQuestionRequesthandler.bind(this);
    this.submitSurveyRequesthandler = this.submitSurveyRequesthandler.bind(this);
    this.getSurveyRequesthandler = this.getSurveyRequesthandler.bind(this);
    this.getSurveyResulthandler = this.getSurveyResulthandler.bind(this);
  }

  async getSurveyResulthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'getSurveyResulthandler-expressHandler', 'getSurveyResulthandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      let surveyId = req.swagger.params.surveyId.value;
      let handlerRes = await this.survey.getSurveyResult(surveyId, correlationId);
      res.set({ 'content-type': 'application/json' });
      res.status(200).send(handlerRes);
    } catch (err) {
      if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      } else if (err.message) {
        res.status(400).send({ message: err.message }); // JOI validation error
      } else {
        res.status(500).send({ message: 'Unexpected error' });
      }
    }
  }

  async submitSurveyRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'submitSurveyRequesthandler-expressHandler', 'submitSurveyRequesthandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      const reqBody = await responseSchema.validateAsync(req.body);
      let surveyId = req.swagger.params.surveyId.value;
      let createdBy = reqBody.createdBy;
      let data = reqBody.questions.map(element => {
        let {questionId, answer} = element;
        return {
          surveyId, createdBy, questionId, answer,
        };
      });
      let handlerRes = await this.survey.submitResponse(data, correlationId);
      res.set({ 'content-type': 'application/json' });
      res.status(200).send(handlerRes);
    } catch (err) {
      if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      } else if (err.message) {
        res.status(400).send({ message: err.message }); // JOI validation error
      } else {
        res.status(500).send({ message: 'Unexpected error' });
      }
    }
  }

  async createSurveyRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'createSurveyRequesthandler-expressHandler', 'createSurveyRequesthandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      const reqBody = await surveySchema.validateAsync(req.body);
      let handlerRes = await this.survey.createSurvey(reqBody, correlationId);
      res.cookie('access_token', handlerRes.token, { maxAge: 360000 });
      res.set({ 'content-type': 'application/json' });
      res.status(200).send(handlerRes);
    } catch (err) {
      if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      } else if (err.message) {
        res.status(400).send({ message: err.message }); // JOI validation error
      } else {
        res.status(500).send({ message: 'Unexpected error' });
      }
    }
  }

  async createSurveyQuestionRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'createSurveyQuestionRequesthandler-expressHandler', 'createSurveyQuestionRequesthandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      const reqBody = await questionSchema.validateAsync(req.body);
      let surveyId = reqBody.surveyId;
      let createdBy = reqBody.createdBy;
      let data = reqBody.questions.map(element => {
        let {question, type, option, canBeSkipped} = element;
        return {
          surveyId, createdBy, question, type, option, canBeSkipped,
        };
      });
      let handlerRes = await this.survey.addQuestions(data, correlationId);
      res.set({ 'content-type': 'application/json' });
      res.status(200).send(handlerRes);
    } catch (err) {
      if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      } else if (err.message) {
        res.status(400).send({ message: err.message }); // JOI validation error
      } else {
        res.status(500).send({ message: 'Unexpected error' });
      }
    }
  }

  async getSurveyRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'getSurveyRequesthandler-expressHandler', 'getSurveyRequesthandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      let handlerRes = await this.survey.getSurvey(req.query.id, correlationId);
      res.set({ 'content-type': 'application/json' });
      res.status(200).send(handlerRes);
    } catch (err) {
      if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      } else if (err.message) {
        res.status(400).send({ message: err.message }); // JOI validation error
      } else {
        res.status(500).send({ message: 'Unexpected error' });
      }
    }
  }
}

module.exports = new ExpressHandler();
