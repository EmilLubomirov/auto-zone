const router = require('../routes/');

module.exports = (app) => {

    app.use('/api/user', router.user);

    app.use('/api/product-tag', router.productTag);

    app.use('/api/service-tag', router.serviceTag);

    app.use('/api/product', router.product);

    app.use('/api/cart', router.cart);

    app.use('/api/order', router.order);

    app.use('/api/service', router.service);

    app.use('/api/delivery', router.delivery);

    app.use('*', (req, res, next) => res.send('<h1> Something went wrong. Try again. :thumbsup: </h1>'))
};