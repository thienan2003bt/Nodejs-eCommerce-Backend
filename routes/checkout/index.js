const router = require('express').Router();
const { authenticationV2 } = require('../../auth/auth.utils');
const { aSyncHandler } = require('../../helpers/asyncHandler');
const CheckoutController = require('../../controllers/checkout.controller');



router.post('/review', aSyncHandler(CheckoutController.checkoutReview))



module.exports = router;