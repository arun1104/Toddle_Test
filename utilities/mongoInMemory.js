'use strict';
let { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async function() {
  const mongod = new MongoMemoryServer();
  const port = await mongod.getPort();
  const dbName = await mongod.getDbName();
  process.env.mongoUrl = `mongodb://127.0.0.1:${port}`;
  process.env.dbName = dbName;
};
