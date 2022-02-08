const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;
const { ObjectId } = Schema.Types;

const cartSchema = new Schema({

    products: [{
        quantity: {type: Number},
        product: { type: ObjectId, ref: 'Product'},
        _id: false
    }],

    user: { type: ObjectId, ref: 'User'},

    createdAt: { type: Date, expires: '14d', default: Date.now }

}, {timestamps: true});

module.exports = new Model('Cart', cartSchema);