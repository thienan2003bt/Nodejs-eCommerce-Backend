'use strict';

const router = require('express').Router();

const cartController = require('../../controllers/cart.controller');
const { aSyncHandler } = require('../../helpers/asyncHandler');

router.get('/', aSyncHandler(cartController.getListUserCart))
router.post('/', aSyncHandler(cartController.addToCart))
router.post('/update', aSyncHandler(cartController.updateUserCart))
router.delete('/', aSyncHandler(cartController.deleteUserCartItem))


module.exports = router;