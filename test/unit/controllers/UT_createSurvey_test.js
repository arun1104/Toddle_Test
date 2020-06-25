'use strict';
var assert = require('assert');
var mocha = require('mocha');
var sinon = require('sinon');
let describe;
let it;
if (mocha.describe) {
  describe = mocha.describe;
  it = mocha.it;
} else {
  describe = global.describe;
  it = global.it;
}
let dbLayer = require('../../../utilities/mongodbLayer');

describe('create survey positive suit', async function() {
  it('should return valid values', async function() {
    dbLayer.Mongoose = {};
    dbLayer.Mongoose.connect = sinon.stub();
    dbLayer.Mongoose.model = sinon.stub();
    dbLayer.Mongoose.connect.resolves();
    dbLayer.Mongoose.model.returns(function() {
      this.save = sinon.stub();
      this.save.resolves();
      this.surveyId = '123';
    });
    try {
      let reqObj = { userId: '123' };
      let result = await dbLayer.createDoc({ data: reqObj }, '7i68gduygwduvwd', 'survey');
      assert.equal(result.surveyId, '123');
    } catch (err) {
      assert.fail('Exception in getReviewsDBLayer Positive suit');
    }
  });
});
