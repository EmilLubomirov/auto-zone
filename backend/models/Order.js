const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;
const { ObjectId, String } = Schema.Types;

const orderSchema = new Schema({

    user: { type: ObjectId, ref: 'User'},

    products: [{
        quantity: {type: Number},
        title: { type: String },
        _id: false
    }]
});

module.exports = new Model('Order', orderSchema);