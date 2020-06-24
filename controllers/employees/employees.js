const dbLayer = require('../../utilities/mongodbLayer');
const Logger = require('../../utilities/logger');

class Employees {
    constructor() {
        this.dbLayer = dbLayer;
        this.createEmployee = this.createEmployee.bind(this);
        this.updateEmployee = this.updateEmployee.bind(this);
        this.deleteEmployee = this.deleteEmployee.bind(this);
        this.getEmployees = this.getEmployees.bind(this);
    }
    async createEmployee(req, res) {
        let data = req.body;
        const correlationId = req.correlationId();
        const logger = new Logger(correlationId, 'createEmployee-Employees', 'createEmployee');
        logger.info('Entry');
        try {
            let options = { query: { employeeId: data.employeeId }, index: 0, count: 1 };
            let docs = await this.dbLayer.getDocs(options, correlationId, 'EMPLOYEE_COLLECTION');
            if (docs.length == 0) {
                if (data.dateOfJoining) {
                    //For testing, taking date as now
                    //data.dateOfJoining = new Date(data.dateOfJoining);
                    data.dateOfJoining = Date.now();
                }
                let employee = await this.dbLayer.createDoc({ data }, correlationId, 'Employee');
                logger.info('Exit');
                res.status(201).send(employee);
                return res;
            } else
                res.status(400).send({ message: "Bad request" });
        } catch (err) {
            logger.error(err);
            res.status(500).send({ message: "Internal server error" });
        }
    }

    async updateEmployee(req, res) {
        let query = req.query,
            data = req.body;
        let correlationId = req.correlationId();
        const logger = new Logger(correlationId, 'updateEmployee-Employees', 'updateEmployee');
        logger.info('Entry');
        try {
            let doc = await this.dbLayer.updateDoc({ query, data }, correlationId, 'Employee');
            if (doc != null) {
                logger.info('Exit');
                res.status(200).send(doc);
            } else {
                res.status(400).send({ message: "Bad request" });
            }
        } catch (err) {
            logger.error(err)
            res.status(500).send({ message: "Internal server error" });
        }
    }

    async deleteEmployee(req, res) {
        let query = req.query
        let correlationId = req.correlationId();
        const logger = new Logger(correlationId, 'deleteEmployee-Employees', 'deleteEmployee');
        logger.info('Entry');
        try {
            await this.dbLayer.deleteDoc({ query }, correlationId, 'Employee');
            res.status(200).send();
        } catch (err) {
            logger.error(err)
            res.status(500).send({ message: "Internal server error" });
        }
    }

    async getEmployees(req, res) {
        const correlationId = req.correlationId();
        let options = normaliseUserQueryParams(req.query);
        const logger = new Logger(correlationId, 'getEmployees-Employees', 'getEmployees');
        logger.info('Entry', options);
        try {
            let docs = await this.dbLayer.getDocs(options, correlationId, 'EMPLOYEE_COLLECTION');
            logger.info('Exit');
            res.status(200).send(docs);
        } catch (err) {
            logger.error(err);
            res.status(500).send({ message: "Internal server error" });
        }
    }
}

function normaliseUserQueryParams(reqQuery) {
    let options = {};
    options.count = parseInt(reqQuery.count) || 10;
    options.index = parseInt(reqQuery.index) || 0;
    if (!reqQuery.employeeId) {
        options.query = {};
    } else {
        options.query = {};
        options.query.employeeId = reqQuery.employeeId;
    }
    return options;
}
module.exports = new Employees();