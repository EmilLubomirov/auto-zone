const controllers = require('../controllers/');
const router = require('express').Router();

router.get('/', controllers.serviceTag.get);

router.post('/add', controllers.serviceTag.post.add);

module.exports = router;