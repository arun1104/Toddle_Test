const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    file: { type: Buffer, trim: true },
    mimetype: { type: String, trim: true },
    name: { type: String, trim: true }
}, { strict: false, timestamps: true });

mongoose.model("File", fileSchema);