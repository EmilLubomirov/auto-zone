const models = require("../models");

module.exports = {

    get: (req, res, next) => {

        models.ProductTag.find()
            .then((tags) => res.send(tags))
            .catch(next)
    },
};