const models = require("../models");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

module.exports = {

    post: {
        makeOrder: async (req, res, next) =>{

            const {
                userId,
                products,
                firstName,
                surname,
                email,
                phoneNumber,
                address,
                productsPrice,
                deliveryName,
                totalPrice
            } = req.body;

            try {

                const isDataProvided =
                    firstName &&
                    surname &&
                    email &&
                    phoneNumber &&
                    address &&
                    productsPrice &&
                    totalPrice &&
                    deliveryName;

                if (!isDataProvided){
                    res.status(500).send('Data is not full');
                    return;
                }

                const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                let message;

                if (!emailRegex.test(String(email).toLowerCase())){
                   message = "Email is not valid"
                }

                else if (phoneNumber.length < 3){
                    message = "Phone number should be at least 3 symbols"
                }

                if (message){
                    res.status(500).send({
                        message
                    });
                    return;
                }

                const isDataValid = firstName.length > 1 &&
                    surname.length > 1 &&
                    emailRegex.test(String(email).toLowerCase()) &&
                    phoneNumber.length >= 3 &&
                    parseFloat(totalPrice) > 0;

                if (!isDataValid) {
                    res.status(500).send({
                        message: 'Invalid data'
                    });
                    return;
                }

                const deliveryByName = await models.Delivery.findOne({
                    name: deliveryName
                });

                if (!deliveryByName){
                    res.sendStatus(500);
                    return;
                }

               const mappedProducts = products.map(p =>{
                  const changed = {};
                  changed.quantity = p.quantity;
                  changed.title = p.product.title;
                  return changed;
               });

                const userById = await models.User.findById(userId);

                if (!userById){
                    res.sendStatus(500);
                    return;
                }

                let hasError = false;

                // UPDATE DB WITH LEFT PRODUCT QUANTITIES
                await Promise.all(products.map(async (p) => {
                    const updatedQuantity = p.product.quantity - p.quantity;

                    if (updatedQuantity < 0){
                        throw new Error("Updated quantity should be non negative");
                    }

                    else if (updatedQuantity >= 0){
                        await models.Product.findOneAndUpdate({
                            _id: ObjectId(p.product._id)
                        }, {
                            quantity: updatedQuantity
                        });
                    }

                    const productId = p.product._id;
                    const userCarts = await models.Cart.find();

                    userCarts.map(async (cartByUser) => {
                        if (updatedQuantity === 0){
                            cartByUser.products = cartByUser.products.filter(product =>{
                                return JSON.stringify(product.product) !== JSON.stringify(productId);
                            });
                        }

                        const product = cartByUser.products.find(p => JSON.stringify(p.product) === JSON.stringify(productId));

                        if (product && updatedQuantity < product.quantity){
                            product.quantity = updatedQuantity;
                        }

                        await cartByUser.products.length === 0 ?
                            cartByUser.remove() : cartByUser.save();
                    });
                })).catch(e => {
                    hasError = true;
                });

                if (hasError){
                    res.sendStatus(500);
                    return;
                }

                const createdOrder = await models.Order.create({
                    user: ObjectId(userId),
                    products: mappedProducts
                });

                // DELETE CART
                await models.Cart.deleteOne({
                    user: ObjectId(userId)
                });

                // ORDER DETAILS DOCUMENT IS CREATED
                await models.OrderDetails.create({
                    order: ObjectId(createdOrder._id),
                    firstName,
                    surname,
                    email,
                    phoneNumber,
                    address,
                    productsPrice,
                    totalPrice,
                    delivery: deliveryByName._id
                });

               res.send(createdOrder);
           }

           catch (e) {
               next(e);
           }
        }
    }
};