const router = require('express').Router();
const { authentication } = require('../../auth/auth.utils');
const { apiKey, permissions } = require('../../auth/checkAuth');
const { aSyncHandler } = require('../../helpers/asyncHandler');

const productController = require('../../controllers/product.controller');

// Middleware
router.use(apiKey)
router.use(permissions('0000'))

// Unauthenticated routes <=> For user
router.get('/', aSyncHandler(productController.findAllProducts))
router.get('/:id', aSyncHandler(productController.findProduct))
router.get('/search/:keySearch', aSyncHandler(productController.searchProductsByUser))


// For authenticated users <=> shop owners
router.use(authentication)

// GET
router.get('/drafts/all', aSyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', aSyncHandler(productController.getAllPublishedProductsForShop))

// POST
router.post('/', aSyncHandler(productController.createProduct))
router.post('/publish/:id', aSyncHandler(productController.publishProduct))
router.post('/unpublish/:id', aSyncHandler(productController.unPublishProduct))

module.exports = router;