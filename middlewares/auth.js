
'use strict';
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'private');
const jwt = require('jsonwebtoken');
module.exports.authMiddleware = function(req, res, next) {
  try {
    if (req.swagger){
      let operationId = req.swagger.operation.operationId.toLowerCase();
      let publicApis = ['signup', 'login'];
      if (!publicApis.includes(operationId)){
        var cert = fs.readFileSync(filePath);
        var decoded = jwt.verify(req.headers.authorization, cert, { algorithms: ['RS256'] });
        req.body.createdBy = decoded.userId;
        console.log(decoded);
        next();
      } else {
        next();
      }
    } else {
      next();
    }

  } catch (err) {
    res.status(400).send({message: 'Invalid token'});
  }
};
