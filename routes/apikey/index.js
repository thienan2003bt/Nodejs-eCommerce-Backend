const { createNewApiKey } = require('../../controllers/apikey.controller');

const router = require('express').Router();

const { aSyncHandler } = require('../../auth/checkAuth')


router.post('/create', aSyncHandler(createNewApiKey))

module.exports = router;