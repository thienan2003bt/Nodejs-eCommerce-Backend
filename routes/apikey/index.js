const { createNewApiKey } = require('../../controllers/apikey.controller');

const router = require('express').Router();

const { aSyncHandler } = require('../../helpers/asyncHandler')


router.post('/create', aSyncHandler(createNewApiKey))

module.exports = router;