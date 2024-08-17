'use strict';

const accessController = require('../../controllers/access.controller');

const router = require('express').Router();

const { aSyncHandler } = require('../../auth/checkAuth')


router.post('/shop/signup', aSyncHandler(accessController.signUp))

module.exports = router;