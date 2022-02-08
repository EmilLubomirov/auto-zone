const controllers = require('../controllers/');
const router = require('express').Router();

router.post('/make-order', controllers.order.post.makeOrder);

module.exports = router;