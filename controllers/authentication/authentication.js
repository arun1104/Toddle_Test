'use strict';
const dbLayer = require('../../utilities/mongodbLayer');
const Logger = require('../../utilities/logger');
const constants = require('../../utilities/constants');
const jwt = require('jsonwebtoken');
let fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'private');

class Authentication {
  constructor() {
    this.dbLayer = dbLayer;
    this.authenticateUser = this.authenticateUser.bind(this);
    this.signUpUser = this.signUpUser.bind(this);
    this.createJwtToken = this.createJwtToken.bind(this);
  }

  createJwtToken(userInfo, grps) {
    const privateKey = fs.readFileSync(filePath);
    let jwtToken = jwt.sign({
      iat: Math.floor(Date.now() / 1000) - 30,
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      role: grps,
      user_name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
    }, privateKey, { algorithm: 'RS256' });
    return jwtToken;
  }

  async authenticateUser(reqBody, correlationId) {
    const logger = new Logger(correlationId, 'authenticateUser-authenticate', 'authenticateUser');
    logger.info('Entry');
    try {
      let options = {};
      options.index = 0;
      options.count = 1;
      options.query = { userId: reqBody.userId };
      let res = await this.dbLayer.getDocs(options, correlationId, constants['USER_CREDENTIALS']);
      if (res.length > 0) {
        if (res[0].password === reqBody.password) {
          let userRes = await this.dbLayer.getDocs(options, correlationId, constants['USER_COLLECTION']);
          if (userRes.length > 0){
            let userInfo = userRes[0];
            let token = this.createJwtToken(userInfo, { gropus: ['basic_user'] });
            return { message: 'successfull', token };
          } else {
            logger.error('Bad request');
            const errObj = new Error('Bad request');
            errObj.status = 400;
            throw errObj;
          }

        } else {
          logger.error('Bad request');
          const errObj = new Error('Bad request');
          errObj.status = 400;
          throw errObj;
        }
      } else {
        logger.error('Bad request');
        const errObj = new Error('Bad request');
        errObj.status = 400;
        throw errObj;
      }
    } catch (err) {
      logger.error(err);
      if (!err.status) {
        const errObj = new Error('Unexpected error');
        errObj.status = 500;
        throw errObj;
      } else
        throw err;
    }
  }

  async signUpUser(data, correlationId) {
    const logger = new Logger(correlationId, 'signUpUser-authenticte', 'signUpUser');
    logger.info('Entry');
    try {
      let options = {};
      options.index = 0;
      options.count = 1;
      options.query = { userId: data.userId };
      let docs = await this.dbLayer.getDocs(options, correlationId, constants['USER_CREDENTIALS']);
      if (docs.length > 0) {
        logger.error('Bad request');
        const errObj = new Error('Bad request');
        errObj.status = 400;
        throw errObj;
      }
      await this.dbLayer.createDoc({ data }, correlationId, constants['USER_CREDENTIALS']);
      delete data['password'];
      let user = await this.dbLayer.createDoc({ data }, correlationId, constants['USER_COLLECTION']);
      logger.info('Exit');
      return { message: 'User created successfully', userId: user.userId};
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
module.exports = new Authentication();
