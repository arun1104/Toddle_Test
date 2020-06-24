'use strict';
const Logger = require('../utilities/logger');
const MongoClient = require('mongodb').MongoClient;
const Mongoose = require('mongoose');
require('./mongooseSchemas');

class DBLayer {
  constructor() {
    this.MongoClient = MongoClient;
    this.Mongoose = Mongoose;
    this.getDocs = this.getDocs.bind(this);
    this.getMongoClientPromise = this.getMongoClientPromise.bind(this);
    this.createDoc = this.createDoc.bind(this);
    this.insertDocs = this.insertDocs.bind(this);
    this.updateDoc = this.updateDoc.bind(this);
    this.getValuesAggregationMongoDB = this.getValuesAggregationMongoDB.bind(this);
  }

  async getValuesAggregationMongoDB(options) {
    const logger = new Logger(options.correlationId, 'getValuesAggregationMongoDB-dbLayer', 'getValuesAggregationMongoDB');
    return new Promise((resolve, reject) => {
      try {
        let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
        logger.info('Connection string', connectionString);
        this.MongoClient.connect(connectionString, async function(err, client) {
          if (err) {
            logger.error(err);
            reject(new Error('DB error'));
          }
          let collectionName = options.collection;
          logger.info('collection', collectionName);
          const db = client.db(process.env.dbName);
          const collection = db.collection(collectionName);

          let uniqueQuestionIds = await collection.aggregate([
            {
              $match: {
                surveyId: options.surveyId,
              },
            },
            {
              $group: {
                _id: '$questionId'},
            },
          ]).toArray();
          logger.info('individualRatingCount', uniqueQuestionIds);
          let result = [];
          for (let index = 0; index < uniqueQuestionIds.length; index++) {
            let element = uniqueQuestionIds[index];
            let temp = {questionId: element['_id']};
            let answerCount = await collection.aggregate([
              {
                $match: {
                  surveyId: options.surveyId, questionId: element['_id'],
                },
              },
              {
                $group: {
                  _id: '$answer',
                  count: {
                    $sum: 1,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  response: '$_id',
                  count: 1,
                },
              },
            ]).toArray();
            temp.result = answerCount;
            result.push(temp);
          }
          resolve({ result});
        });

      } catch (err) {
        console.log('Db conn err', err);
        reject(new Error('DB error'));
      }
    });

  }

  async insertDocs(options, correlationId, modelName){
    const logger = new Logger(correlationId, 'insertDocs-mongodbLayer', 'insertDocs');
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.Mongoose.model(modelName);
      let result = await model.insertMany(options.data);
      return result;
    } catch (err) {
      logger.error(err);
      let error = new Error('DB error');
      error.status = 500;
      throw error;
    }
  }

  async getMongoClientPromise(options) {
    const logger = new Logger(options.correlationId, 'getMongoClientPromise-mongodbLayer', 'getMongoClientPromise');
    logger.info('Entry', options);
    return new Promise((resolve, reject) => {
      try {
        let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
        logger.info('Connection string', connectionString);
        this.MongoClient.connect(connectionString, async function(err, client) {
          if (err) {
            logger.error(err);
            reject(new Error('DB error'));
          }
          let collectionName = options.collection;
          logger.info('collection', collectionName);
          const db = client.db(process.env.dbName);
          const collection = db.collection(collectionName);
          let docs = await collection.find(options.query).sort({ updatedAt: -1 }).skip(options.index).limit(options.count).toArray();
          docs = JSON.parse(JSON.stringify(docs));
          resolve(docs);
        });
      } catch (err) {
        logger.error(err);
        let error = new Error('DB error');
        error.status = 500;
        reject(error);
      }
    });
  }
  async getDocs(params, correlationId, collection) {
    const logger = new Logger(correlationId, 'getDocs', 'getDocs');
    logger.info('Entry', params);
    try {
      let options = params;
      options.correlationId = correlationId;
      options.collection = collection;
      let docs = await this.getMongoClientPromise(options);
      return docs;
    } catch (err) {
      logger.error(err);
      let error = new Error('DB error');
      error.status = 500;
      throw error;
    }

  }

  async createDoc(options, correlationId, modelName) {
    const logger = new Logger(correlationId, 'createDoc-mongodbLayer', 'createDoc');
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let Model = this.Mongoose.model(modelName);
      let newDoc = new Model(options.data);
      let result = JSON.parse(JSON.stringify(newDoc));
      await newDoc.save();
      return result;
    } catch (err) {
      logger.error(err);
      let error = new Error('DB error');
      error.status = 500;
      throw error;
    }
  }

  async updateDoc(options, correlationId, modelName) {
    const logger = new Logger(correlationId, 'updateDoc-mongodbLayer', 'updateDoc');
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.Mongoose.model(modelName);
      let result = await model.findOneAndUpdate(options.query, options.data, { new: true });
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (err) {
      logger.error(err);
      let error = new Error('DB error');
      error.status = 500;
      throw error;
    }
  }
}

module.exports = new DBLayer();
