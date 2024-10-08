'use strict';
const router = require('express').Router();

const { pushToLogDiscord } = require('../middlewares/index');

// Logger bot
router.use(pushToLogDiscord);


router.use('/v1/api/discount', require('./discount/index'));
router.use('/v1/api/profile', require('./profile/index'));
router.use('/v1/api/rbac', require('./rbac/index'));
router.use('/v1/api/notification', require('./notification/index'));
router.use('/v1/api/inventory', require('./inventory/index'));
router.use('/v1/api/comment', require('./comment/index'));
router.use('/v1/api/cart', require('./cart/index'));
router.use('/v1/api/product', require('./product/index'));
router.use('/v1/api/upload', require('./upload/index'));
router.use('/v1/api/checkout', require('./checkout/index'));
router.use('/v1/api', require('./access/index'));
router.use('/apikey', require('./apikey/index'));

router.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello world!",
    })
})

module.exports = router;