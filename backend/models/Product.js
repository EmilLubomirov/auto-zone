const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String, Number, ObjectId } = Schema.Types;

const productSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        min: 1,
        required: true,
        validate: {
            validator: function(val) {
                return !val.toString().includes(".");
            },
            message: "Quantity should be integer"
        },
    },

    price: {
        type: Number,
        min: 0,
        required: true
    },

    tag: { type: ObjectId, ref: 'ProductTag'},
});

module.exports = new Model('Product', productSchema);