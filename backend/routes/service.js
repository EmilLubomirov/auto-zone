const controllers = require('../controllers/');
const router = require('express').Router();

router.post('/', controllers.service.post);

module.exports = router;