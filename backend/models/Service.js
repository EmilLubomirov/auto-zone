const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String, ObjectId } = Schema.Types;

const serviceSchema = new Schema({

    user: { type: ObjectId, ref: 'User'},

    firstName: {
        type: String,
        required: true
    },

    surname: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    carLicensePlate: {
        type: String,
        required: true
    },

    appointment: {
        type: Date,
        required: true,

        validate: {
            validator: function(val) {

                const min = new Date();
                min.setHours(min.getHours() + 2);

                if (val.getTime() < min.getTime()){
                    return false;
                }

                const hours = val.getHours() - 2;

                if (hours < 9 || hours > 19){
                    return false;
                }

                const day = val.getDay();
                const isWeekend = (day === 6) || (day === 0);

                return !isWeekend;
            },
            message: "Please, enter valid date and time"
        }
    },

    tag: { type: ObjectId, ref: 'ServiceTag' }
});

module.exports = new Model('Service', serviceSchema);