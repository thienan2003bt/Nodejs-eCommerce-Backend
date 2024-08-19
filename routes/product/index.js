const router = require('express').Router();
const { authentication } = require('../../auth/auth.utils');
const { apiKey, permissions } = require('../../auth/checkAuth');
const { aSyncHandler } = require('../../helpers/asyncHandler');

const productController = require('../../controllers/product.controller');

// Middleware
router.use(apiKey)
router.use(permissions('0000'))
router.use(authentication)


router.post('/', aSyncHandler(productController.createProduct))

module.exports = router;