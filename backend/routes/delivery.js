const controllers = require('../controllers/');
const router = require('express').Router();

router.get('/', controllers.delivery.get);

module.exports = router;