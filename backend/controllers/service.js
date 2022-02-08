const models = require("../models");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

module.exports = {

    post: async (req, res, next) => {

        const {
            userId,
            firstName,
            surname,
            phoneNumber,
            carLicensePlate,
            appointment,
            tag
        } = req.body;

        try {

            const date = new Date(appointment);

            // MOCKING VALUE TO GET ACTUAL HOURS
            date.setHours(date.getHours() + 2);

            const tagByName = await models.ServiceTag.findOne({
                name: tag
            });

            if (!tagByName) {
                res.sendStatus(500);
                return;
            }

            const userById = await models.User.findById(userId);

            if (!userById) {
                res.sendStatus(500);
                return;
            }

            const services = await models.Service.find({
                tag: ObjectId(tagByName._id)
            });

            const min = new Date();
            min.setHours(min.getHours() + 2);
            let currentDate = new Date(date);

            if (currentDate.getTime() < min.getTime()){
                res.status(500).send({
                    message: "Date can't be in the past"
                });
                return;
            }

            const hours = currentDate.getHours() - 2;
            const mins = currentDate.getMinutes();

            if ((hours < 9 || hours > 19) || hours === 19 && mins > 0){
                res.status(500).send({
                    message: "Hour must be between 9 and 19"
                });
                return;
            }

            const day = currentDate.getDay();
            const isWeekend = (day === 6) || (day === 0);

            if (isWeekend){
                res.status(500).send({
                    message: "Please, selected a weekday"
                });
                return;
            }

            const isDateBusy = services.some(service => {
               const currentServiceDate = new Date(service.appointment);

               let currentDate = new Date(date);

               if (currentDate.getFullYear() === currentServiceDate.getFullYear() &&
                   currentDate.getMonth() === currentServiceDate.getMonth() &&
                   currentDate.getDate() === currentServiceDate.getDate()){

                   if (currentDate.getTime() > currentServiceDate.getTime()){
                       currentDate.setMinutes(currentDate.getMinutes() - 30);
                       return currentDate.getTime() <= currentServiceDate.getTime();
                   }

                   else {
                       currentDate.setMinutes(currentDate.getMinutes() + 30);
                       return currentDate.getTime() >= currentServiceDate.getTime();
                   }
               }


            });

            if (isDateBusy){
                res.status(500).send({
                    message: "This time is already busy"
                });
                return;
            }

            const createdService =  await models.Service.create({
                user: ObjectId(userId),
                firstName,
                surname,
                phoneNumber,
                carLicensePlate,
                appointment: new Date(date),
                tag: ObjectId(tagByName._id)
            });

            res.send(createdService);
        }

        catch (e) {
            next(e);
        }
    },
};