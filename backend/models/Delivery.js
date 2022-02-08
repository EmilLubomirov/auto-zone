const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String } = Schema.Types;

const deliverySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },

    price: {
        type: Number,
        min: 0,
        required: true
    },
});

module.exports = new Model('Delivery', deliverySchema);