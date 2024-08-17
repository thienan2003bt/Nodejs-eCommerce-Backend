'use strict';

const { apiKey, permissions } = require('../auth/checkAuth');

const router = require('express').Router();

// Check APIKey: 
router.use(apiKey)
router.use(permissions('0000'))

router.use('/v1/api', require('./access/index'));

router.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello world!",
    })
})

module.exports = router;