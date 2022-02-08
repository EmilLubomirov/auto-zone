const models = require("../models");
const mongoose = require('mongoose');

module.exports = {

    get: async (req, res, next) =>{

        const name = req.query.name;

        try {

            let delivery;

            if (!name){
                delivery = await models.Delivery.find();
            }

            else {
                delivery = await models.Delivery.findOne({
                    name
                });
            }

            if (!delivery){
                delivery = [];
            }

            res.send(delivery);
        }
        catch (e) {
            next(e);
        }
    }
};