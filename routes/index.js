
const router = require('koa-router')();
const home = require('../controller/HomeController');
const api = require('../controller/APIController');


router.get('/', home.homepage);
router.get('/:code', home.transfer);
router.post('/api/generate', api.generate);
router.get('/api/find/:code', api.find);

module.exports = router;

