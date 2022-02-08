const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String, Number, Boolean, ObjectId } = Schema.Types;

const roleSchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: true
    }

});

module.exports = new Model('Role', roleSchema);