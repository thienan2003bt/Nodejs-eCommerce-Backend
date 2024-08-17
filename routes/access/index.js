'use strict';
const router = require('express').Router();
const { apiKey, permissions } = require('../../auth/checkAuth');

const accessController = require('../../controllers/access.controller');
const { aSyncHandler } = require('../../auth/checkAuth')

// Check APIKey: 
router.use(apiKey)
router.use(permissions('0000'))


router.post('/shop/login', aSyncHandler(accessController.login))

router.post('/shop/signup', aSyncHandler(accessController.signUp))

module.exports = router;