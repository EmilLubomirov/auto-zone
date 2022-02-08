const controllers = require('../controllers/');
const router = require('express').Router();

router.get('/', controllers.productTag.get);

module.exports = router;