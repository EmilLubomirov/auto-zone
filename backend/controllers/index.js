const user = require('./user');
const productTag = require('./product-tag');
const product = require('./product');
const cart = require('./cart');
const order = require('./order');
const serviceTag = require('./service-tag');
const service = require('./service');
const delivery = require('./delivery');

module.exports = {
    user,
    productTag,
    serviceTag,
    product,
    cart,
    order,
    service,
    delivery
};