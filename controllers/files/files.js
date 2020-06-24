const Logger = require('../../utilities/logger');
const mongoose = require("mongoose");
require("./dbSchema");

class Files {
    constructor() {
        this.mongoose = mongoose;
        this.uploadFile = this.uploadFile.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
    }

    async uploadFile(req, res) {
        let correlationId = req.correlationId();
        const logger = new Logger(correlationId, 'uploadFile-Files', 'uploadFile');
        logger.info('Entry');
        let url = process.env.mongoUrl + '/' + process.env.DbName;
        logger.info('connection string', url);
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        let payload = { "mimetype": req.files[0].mimetype, file: req.files[0].buffer, name: req.files[0].originalname };
        let model = this.mongoose.model('File');
        let uploadedDoc = new model(payload);
        await uploadedDoc.save();
        return { id: uploadedDoc._id };
    }

    async downloadFile(req, res) {
        let correlationId = req.correlationId();
        const logger = new Logger(correlationId, 'downloadFile-Files', 'downloadFile');
        logger.info('Entry');
        let url = process.env.mongoUrl + '/' + process.env.DbName;
        logger.info('connection string', url);
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        let model = this.mongoose.model('File');
        let doc = await model.find({ _id: req.query.id });
        res.setHeader('Content-disposition', 'attachment; filename=' + doc[0].name);
        res.setHeader('Content-type', doc[0].mimetype);
        res.status(200).send(doc[0].file);
    }
}

module.exports = new Files();