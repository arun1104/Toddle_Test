'use strict';
let express = require('express');
const path = require('path');
let fs = require('fs');
const multer = require('multer');
const uploadParser = multer();
const sslKeyPath = path.join(__dirname, 'ssl/key.pem');
const sslCertPath = path.join(__dirname, 'ssl/cert.pem');
const privateKey = fs.readFileSync(sslKeyPath, 'utf8');
const certificate = fs.readFileSync(sslCertPath, 'utf8');
var credentials = { key: privateKey, cert: certificate };
const https = require('https');
const correlator = require('express-correlation-id');
let app = express();
var bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let cors = require('cors');
let morgan = require('morgan');
let swaggerTools = require('swagger-tools');
let yaml = require('js-yaml');
let routes = require('./routes.js');
let fileHandler = require('./controllers/files/files');
const {authMiddleware} = require('./middlewares/auth');
let startMongo = require('./utilities/mongoInMemory');
startMongo();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(correlator());
app.use(morgan('[:date[clf]] :method :url :status :res[content-length] - :response-time ms'));

app.use(cors({
  origin: ['*'],
  methods: ['PUT', 'DELETE', 'GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const ymlPath = path.join(__dirname, '.', 'swagger.yaml');
const swaggerDoc = yaml.safeLoad(fs.readFileSync(ymlPath, 'utf8'));
const options = {
  controllers: routes,
  useStubs: process.env.NODE_ENV === 'dev', // Conditionally turn on stubs (mock mode)
};

app.post('/v1/files', uploadParser.any(), async function(req, res) {
  try {
    let result = await fileHandler.uploadFile(req);
    res.status(200).send(result);
    console.log();
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.get('/v1/files', async function(req, res) {
  try {
    if (req.query.id) {
      await fileHandler.downloadFile(req, res);
    } else {
      res.status(400).send({ message: 'Bad request' });
    }

  } catch (err) {
    res.status(500).send({ message: 'Internal server error' });
  }
});
// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // authentication middleware
  app.use(authMiddleware);

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
  // Start the server
  const port = (process.env.PORT) ? process.env.PORT : 3000;
  let server = https.createServer(credentials, app);
  server.listen(port, function() {
    console.log('server is running on port 3000');
  });
});
