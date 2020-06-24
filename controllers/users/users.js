const dbLayer = require('../../utilities/mongodbLayer');
const Logger = require('../../utilities/logger');

class Users {
    constructor() {
        this.dbLayer = dbLayer;
        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }

    async createUser(data, correlationId) {
        const logger = new Logger(correlationId, 'createUser-users', 'createUser');
        logger.info('Entry');
        try {
            let options = { query: { userId: data.userId }, index: 0, count: 1 };
            let docs = await this.dbLayer.getDocs(options, correlationId, 'USER_COLLECTION');
            if (docs.length == 0) {
                let res = await this.dbLayer.createDoc({ data }, correlationId, 'User');
                logger.info('Exit');
                return res;
            } else
                throw { status: 400, message: "Bad request" }
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async updateUser(query, data, correlationId) {
        const logger = new Logger(correlationId, 'updateUser-users', 'updateUser');
        logger.info('Entry');
        try {
            let res = await this.dbLayer.updateDoc({ query, data }, correlationId, 'User');
            if (res != null) {
                logger.info('Exit');
                return res;
            } else {
                throw { status: 400, message: "Bad request" }
            }

        } catch (err) {
            logger.error(err);
            if (!err.status)
                throw { status: 500, message: "Unexpected error" }
            else
                throw err;
        }
    }

    async deleteUser(query, correlationId) {
        const logger = new Logger(correlationId, 'deleteUser-users', 'deleteUser');
        logger.info('Entry');
        try {
            let res = await this.dbLayer.deleteDoc({ query }, correlationId, 'User');
            logger.info('Exit');
            return res;
        } catch (err) {
            logger.error(err);
            throw { status: 500, message: "Unexpected error" }
        }
    }

    async getUsers(options, correlationId) {
        const logger = new Logger(correlationId, 'getUsers-users', 'getUsers');
        logger.info('Entry', options);
        try {
            let res = await this.dbLayer.getDocs(options, correlationId, 'USER_COLLECTION');
            logger.info('Exit');
            return res;
        } catch (err) {
            logger.error(err);
            throw { status: 500, message: "Unexpected error" }
        }
    }

}
module.exports = new Users();