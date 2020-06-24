const {
    newUserSchema,
    userUpdateSchema
} = require('./hapiSchemas/schemas');
const users = require('./users');
const Logger = require('../../utilities/logger');

class ExpressHandler {
    constructor() {
        this.users = users;
        this.createRequesthandler = this.createRequesthandler.bind(this);
        this.getRequesthandler = this.getRequesthandler.bind(this);
        this.updateRequesthandler = this.updateRequesthandler.bind(this);
        this.deleteRequesthandler = this.deleteRequesthandler.bind(this);
    }

    async deleteRequesthandler(req, res) {
        const correlationId = req.correlationId();
        const logger = new Logger(correlationId, 'deleteRequesthandler-expressHandler', 'deleteRequesthandler');
        logger.info('Entry');
        try {
            const correlationId = req.correlationId();
            let handlerRes = await this.users.deleteUser(req.query, correlationId);
            res.set({ "content-type": 'application/json' });
            res.status(200).send(handlerRes);
        } catch (err) {
            if (err.status && err.message) {
                res.status(err.status).send({ message: err.message });
            } else if (err.message) {
                res.status(400).send({ message: err.message }); //JOI validation error
            } else {
                res.status(500).send({ message: "Unexpected error" });
            }

        }
    }

    async updateRequesthandler(req, res) {
        const correlationId = req.correlationId();
        const logger = new Logger(correlationId, 'createRequesthandler-expressHandler', 'createRequesthandler');
        logger.info('Entry');
        try {
            const reqBody = await userUpdateSchema.validateAsync(req.body);
            const correlationId = req.correlationId();
            let handlerRes = await this.users.updateUser(req.query, reqBody, correlationId);
            res.set({ "content-type": 'application/json' });
            res.status(200).send(handlerRes);
        } catch (err) {
            if (err.status && err.message) {
                res.status(err.status).send({ message: err.message });
            } else if (err.message) {
                res.status(400).send({ message: err.message }); //JOI validation error
            } else {
                res.status(500).send({ message: "Unexpected error" });
            }

        }
    }

    async createRequesthandler(req, res) {
        const correlationId = req.correlationId();
        const logger = new Logger(correlationId, 'createRequesthandler-expressHandler', 'createRequesthandler');
        logger.info('Entry');
        try {
            const reqBody = await newUserSchema.validateAsync(req.body);
            const correlationId = req.correlationId();
            let handlerRes = await this.users.createUser(reqBody, correlationId);
            res.set({ "content-type": 'application/json' });
            res.status(201).send(handlerRes);
        } catch (err) {
            if (err.status && err.message) {
                res.status(err.status).send({ message: err.message });
            } else if (err.message) {
                res.status(400).send({ message: err.message }); //JOI validation error
            } else {
                res.status(500).send({ message: "Unexpected error" });
            }

        }
    }

    async getRequesthandler(req, res) {
        const correlationId = req.correlationId();
        const logger = new Logger(correlationId, 'createRequesthandler-expressHandler', 'createRequesthandler');
        logger.info('Entry');
        try {
            const correlationId = req.correlationId();
            let options = normaliseUserQueryParams(req.query);
            let handlerRes = await this.users.getUsers(options, correlationId);
            res.set({ "content-type": 'application/json' });
            res.status(200).send(handlerRes);
        } catch (err) {
            if (err.status && err.message) {
                res.status(err.status).send({ message: err.message });
            } else if (err.message) {
                res.status(400).send({ message: err.message }); //JOI validation error
            } else {
                res.status(500).send({ message: "Unexpected error" });
            }

        }
    }
}

function normaliseUserQueryParams(reqQuery) {
    let options = {};
    options.count = parseInt(reqQuery.count) || 10;
    options.index = parseInt(reqQuery.index) || 0;
    if (!reqQuery.userId) {
        options.query = {};
    } else {
        options.query = {};
        options.query.userId = reqQuery.userId;
    }
    return options;
}
module.exports = new ExpressHandler();