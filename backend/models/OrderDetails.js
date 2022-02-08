const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;
const { ObjectId, String } = Schema.Types;

const orderDetailsSchema = new Schema({

    order: { type: ObjectId, ref: 'Order'},

    firstName: {
        type: String,
        required: true
    },

    surname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    productsPrice: {
        type: Number,
        required: true
    },

    totalPrice:{
        type: Number,
        required: true
    },

    delivery: { type: ObjectId, ref: 'Delivery'},

    made_on: { type: Date, default: () => {
            const date = new Date();

            //MOCKING VALUE (EET)
            date.setHours(date.getHours() + 2);
            return date;
        }
    }
});

module.exports = new Model('Order-Details', orderDetailsSchema);