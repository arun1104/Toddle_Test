'use strict';
const dbLayer = require('../../utilities/mongodbLayer');
const Logger = require('../../utilities/logger');
const constants = require('../../utilities/constants');

class Survey {
  constructor() {
    this.dbLayer = dbLayer;
    this.createSurvey = this.createSurvey.bind(this);
    this.updateSurvey = this.updateSurvey.bind(this);
    this.getSurvey = this.getSurvey.bind(this);
  }
  async createSurvey(body, correlationId) {
    const logger = new Logger(correlationId, 'createSurvey-Survey', 'createSurvey');
    logger.info('Entry');
    try {
      body.surveyId = `${makeid(30)}_${body.name}`;
      let survey = await this.dbLayer.createDoc({ data: body }, correlationId, constants['SURVEY_COLLECTION']);
      delete survey['_id'];
      logger.info('Exit');
      return survey;
    } catch (err) {
      logger.error(err);
      if (!err.status){
        let error = new Error('Internal server error');
        error.status = 500;
        throw error;
      } else throw err;
    }
  }

  async updateSurvey(req, res) {
    let query = req.query;
    let data = req.body;
    let correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'updateEmployee-Employees', 'updateEmployee');
    logger.info('Entry');
    try {
      let doc = await this.dbLayer.updateDoc({ query, data }, correlationId, 'Employee');
      if (doc != null) {
        logger.info('Exit');
        res.status(200).send(doc);
      } else {
        res.status(400).send({ message: 'Bad request' });
      }
    } catch (err) {
      logger.error(err);
      res.status(500).send({ message: 'Internal server error' });
    }
  }

  async getSurvey(surveyId, correlationId) {
    const logger = new Logger(correlationId, 'getSurvey-Survey', 'getSurvey');
    logger.info('Entry', surveyId);
    try {
      let options = {query: { surveyId}, index: 0, count: 1};
      options.correlationId = correlationId;
      let docs = await this.dbLayer.getDocs(options, correlationId, constants['SURVEY_COLLECTION']);
      logger.info('Exit');
      return docs;
    } catch (err) {
      logger.error(err);
      if (!err.status){
        let error = new Error('Internal server error');
        error.status = 500;
        throw error;
      } else throw err;
    }
  }
}

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
module.exports = new Survey();