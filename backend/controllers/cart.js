const models = require("../models");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

module.exports = {

    get: async (req, res, next) =>{

        const userId = req.query.user;

        try {
            let userCart = await models.Cart.findOne({
                user: ObjectId(userId)
            }).populate('products.product');

            if (!userCart){
                userCart = [];
            }

            res.send(userCart);
        }
        catch (e) {
            next(e);
        }

    },

    post: {

        addToCart: async (req, res, next) => {

        const { productId, userId } = req.body;


        try {

            if (!(productId && userId)){
                res.sendStatus(500);
                return;
            }

            const userById = await models.User.findById(userId);

            if (!userById){
                res.sendStatus(500);
                return;
            }

            const productById = await models.Product.findById(productId);

            if (!productById || productById.quantity === 0){
                res.sendStatus(500);
                return;
            }


            let cartByUser = await models.Cart.findOne({
                user: ObjectId(userId)
            }).populate('products.product');

            if (!cartByUser){

                cartByUser = await models.Cart.create({
                    user: userId,
                    products: [{
                        quantity: 1,
                        product: ObjectId(productId)
                    }]
                });
            }

            else {

                const doesProductExist = cartByUser.products.find((p =>{
                    return JSON.stringify(p.product._id) === JSON.stringify(productId);
                }));

                if (!doesProductExist){
                    cartByUser.products.push({
                        quantity: 1,
                        product: ObjectId(productId)
                    });
                }

            else {
                    cartByUser.products.map(p =>{
                        const { _id, quantity } = p.product;

                        if (JSON.stringify(_id) === JSON.stringify(productId) &&
                            p.quantity < quantity){
                            p.quantity++;
                        }
                    });
                }

                await cartByUser.save();
            }

            res.send(cartByUser);
        }

        catch (e) {
            next(e);
        }
    },

    },

    put:
        {
            updateQuantity: async (req, res, next) =>{
                const { userId, productId, quantity } = req.body;

                try {
                    const userCart = await models.Cart.findOne({
                        user: ObjectId(userId)
                    });

                    userCart.products = userCart.products.map(product =>{
                        if (JSON.stringify(product.product) === JSON.stringify(productId)){
                            product.quantity = quantity;
                        }
                        return product;
                    });

                    await userCart.save();
                    res.send(userCart);
                }

                catch (e) {
                    next(e);
                }
        }
    },

    delete: async (req, res, next) =>{

        const { userId, productId } = req.body;

        try {
            const userCart = await models.Cart.findOne({
                user: ObjectId(userId)
            }).populate('products.product');

            userCart.products = userCart.products.filter(product =>{
                return JSON.stringify(product.product._id) !== JSON.stringify(productId);
            });

            await userCart.products.length === 0 ?
                userCart.remove() :
                userCart.save();

            res.send(userCart || []);
        }

        catch (e) {
            next(e);
        }
    }
};