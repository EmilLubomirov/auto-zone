const models = require("../models");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

module.exports = {

    get: {
        getProducts: async (req, res, next) =>{
            const {
                selectedTags,
                page,
                size,
                minPrice,
                maxPrice
            } = req.query;

            const minPriceNum = minPrice ? parseInt(minPrice) : undefined;
            const maxPriceNum = maxPrice ? parseInt(maxPrice) : undefined;

            try {

                let products;
                let count = 0;

                if (selectedTags && selectedTags.length > 0) {
                    const tags = (await Promise.all(selectedTags.split(',').map(async (tagName) => {
                        return await models.ProductTag.findOne({
                            name: tagName
                        });
                    }))).map(t => {
                        return t._id;
                    });

                    if (page || size){
                        const skip = (parseInt(page) - 1) * parseInt(size);
                        const limit = parseInt(size);

                        let match = { 'tag': {$in: tags}};

                        if (minPriceNum !== undefined && maxPriceNum !== undefined){
                            match = { 'tag': {$in: tags},
                                      'price': {$gte :  minPriceNum, $lte : maxPriceNum}}
                        }

                        products = await models.Product.aggregate([
                            {$match: match},
                            {$sort: {'price': 1}},
                            {$skip: skip},
                            {$limit: limit},
                        ]);

                        count = await models.Product.countDocuments(match);
                    }
                }

                else if (page || size) {
                    const skip = (parseInt(page) - 1) * parseInt(size);
                    const limit = parseInt(size);

                    let match = {};

                    if (minPriceNum !== undefined && maxPriceNum !== undefined){
                       match = {'price': {$gte :  minPriceNum, $lte : maxPriceNum}}
                       count = await models.Product.countDocuments(match);
                    }

                    else {
                        count = await mongoose.connection.db.collection('products').countDocuments();
                    }

                    products = await models.Product.aggregate([
                        {$match: match},
                        {$sort: {'price': 1}},
                        {$skip: skip},
                        {$limit: limit},
                    ]);
                }

                else {
                    products = await models.Product.find();
                    count = await mongoose.connection.db.collection('products').countDocuments();
                }

                res.send({products, count});
            }

            catch (e) {
                next(e);
            }
        },

        getCount: async (req, res, next) => {
            try {
                const count = await mongoose.connection.db.collection('products').countDocuments();
                res.send({ count });
            }

            catch (e) {
                next(e);
            }
        },

        getById: async (req, res, next) =>{
            const { id } = req.params;

            try {
                const product = await models.Product.findById(ObjectId(id));
                res.send(product);
            }

            catch (e) {
                next(e);
            }
        }
    },

    post: {
        create: async (req, res, next) => {

            const {
                title,
                description,
                imageUrl,
                quantity,
                price,
                tag,
                userId
            } = req.body;

            const user = await models.User.findById(userId).populate("roles");

            if (!user || !JSON.stringify(user.roles).includes("ADMIN")){
                return;
            }

            try {

                const tagByName = await models.ProductTag.findOne({
                    name: tag
                });


                if (!tagByName){
                    res.sendStatus(500);
                    return;
                }

                const createdProduct = await models.Product.create({
                    title,
                    description,
                    imageUrl,
                    quantity: parseInt(quantity),
                    price: parseFloat(price),
                    tag: ObjectId(tagByName._id)
                });

                res.send(createdProduct);
            } catch (e) {
                next(e);
            }
        }
    }
};