const { authenticationV2 } = require('../../auth/auth.utils');
const { aSyncHandler } = require('../../helpers/asyncHandler');
const DiscountController = require('../../controllers/discount.controller');
const router = require('express').Router();



router.get('/list-product-code', aSyncHandler(DiscountController.getAllDiscountCodesWithProduct))
router.post('/amount', aSyncHandler(DiscountController.applyDiscountCode))


// Authentication
router.use(authenticationV2)

router.get('/', aSyncHandler(DiscountController.getAllDiscountCodesByShop))
router.post('/', aSyncHandler(DiscountController.createDiscountCode))

module.exports = router;