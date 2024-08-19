'use strict';
const router = require('express').Router();
const { authentication, authenticationV2 } = require('../../auth/auth.utils');
const { apiKey, permissions } = require('../../auth/checkAuth');

const accessController = require('../../controllers/access.controller');
const { aSyncHandler } = require('../../helpers/asyncHandler')

// Check APIKey: 
router.use(apiKey)
router.use(permissions('0000'))


router.post('/shop/login', aSyncHandler(accessController.login))
router.post('/shop/signup', aSyncHandler(accessController.signUp))


// Check authentication
router.use(authenticationV2)

router.post('/shop/logout', aSyncHandler(accessController.logout))
router.post('/shop/refresh-token', aSyncHandler(accessController.handleRefreshToken))




module.exports = router;