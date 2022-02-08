const models = require("../models");

module.exports = {

    get: (req, res, next) => {

        models.ServiceTag.find()
            .then((services) => res.send(services))
            .catch(next)
    },

    post: {
        add: async (req, res, next) => {

            const {
                userId,
                serviceName,
            } = req.body;

            const user = await models.User.findById(userId).populate("roles");

            if (!user || !JSON.stringify(user.roles).includes("ADMIN")){
                return;
            }

            try {

                const tagByName = await models.ServiceTag.findOne({
                    name: serviceName
                });

                if (tagByName) {
                    res.status(409).send("Service already exists!");
                    return;
                }

                const createdTag = await models.ServiceTag.create({
                    name: serviceName
                });

                res.send(createdTag);
            } catch (e) {
                next(e);
            }
        }
    }
};