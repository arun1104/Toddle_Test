'use strict';
const {
  loginSchema,
  signUpSchema,
} = require('./hapiSchemas/schemas');
const auth = require('./authentication');
const Logger = require('../../utilities/logger');

class ExpressHandler {
  constructor() {
    this.auth = auth;
    this.loginRequesthandler = this.loginRequesthandler.bind(this);
    this.logoutRequesthandler = this.logoutRequesthandler.bind(this);
    this.signupRequesthandler = this.signupRequesthandler.bind(this);
  }

  async loginRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'loginRequesthandler-expressHandler', 'loginRequesthandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      const reqBody = await loginSchema.validateAsync(req.body);
      let handlerRes = await this.auth.authenticateUser(reqBody, correlationId);
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

  async signupRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'deleteRequesthandler-expressHandler', 'deleteRequesthandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      const reqBody = await signUpSchema.validateAsync(req.body);
      let handlerRes = await this.auth.signUpUser(reqBody, correlationId);
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

  async logoutRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'createRequesthandler-expressHandler', 'createRequesthandler');
    logger.info('Entry');
    try {
      res.clearCookie('access_token');
      res.status(200).send({ message: 'successfully logged out' });
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
