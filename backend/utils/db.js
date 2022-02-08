const models = require("../models");
const mongoose = require("mongoose");

const getCollectionDocumentsCount = (name) =>{
    return mongoose.connection.db.collection(name).countDocuments();
};

const insertUserRoles = () =>{

    const { Role } = models;

    return getCollectionDocumentsCount('roles').then(count => {
        if (count === 0){
                Role.insertMany([
                    { name: 'ADMIN'},
                    { name: 'USER'}
                ]);
            }
        }
    );
};

const insertProductTags = () =>{

    const { ProductTag } = models;

    return getCollectionDocumentsCount('product-tags').then(count => {
            if (count === 0){
                ProductTag.insertMany([
                    { name: 'Batteries'},
                    { name: 'Tires'},
                    { name: 'Rims'},
                    { name: 'Motor oil'},
                    { name: 'Spark plugs'},
                    { name: 'Air filters'}
                ]);
            }
        }
    );
};

const insertServiceTags = () =>{

    const { ServiceTag } = models;

    return getCollectionDocumentsCount('service-tags').then(count => {
            if (count === 0){
                ServiceTag.insertMany([
                    { name: 'MOT'},
                    { name: 'Car Wash'},
                    { name: 'Car Service'}
                ]);
            }
        }
    );
};

const insertDeliveries = () =>{

    const { Delivery } = models;

    return getCollectionDocumentsCount('deliveries').then(count => {
            if (count === 0){
                Delivery.insertMany([
                    { name: 'Standard', price: 5.00},
                    { name: 'Free', price: 0.00}
                ]);
            }
        }
    );
};



module.exports = {
    getCollectionDocumentsCount,
    insertUserRoles,
    insertProductTags,
    insertServiceTags,
    insertDeliveries
};