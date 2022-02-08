const controllers = require('../controllers/');
const router = require('express').Router();

router.get('/', controllers.cart.get);

router.post('/add-to-cart', controllers.cart.post.addToCart);

router.delete('/remove-from-cart', controllers.cart.delete);

router.put('/update-quantity', controllers.cart.put.updateQuantity);

module.exports = router;