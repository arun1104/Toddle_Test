'use strict';
var assert = require('assert');
const axios = require('axios');
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var mocha = require('mocha');
let describe;
let it;
if (mocha.describe) {
  describe = mocha.describe;
  it = mocha.it;
} else {
  describe = global.describe;
  it = global.it;
}
let serverUrl = 'https://localhost:3000/v1';
let url = (process.env.apiUrl) ? process.env.apiUrl : serverUrl;
describe('sign up user positive suit', function() {
  it('should return 200 for valid req', async function() {
    try {
      let body = {
        userId: 'arunr8', // The req will fail if same user already exists
        password: '12345678',
        email: 'as@b.com',
        phone: '959584748484',
        name: 'aman cnanje',
      };
      const resp = await axios.post(
        'https://arcane-falls-01320.herokuapp.com/v1/signup',
        body,
      );
      assert.equal(resp.status, 200);
    } catch (err){
      assert.fail(err);
    }

  });
});
