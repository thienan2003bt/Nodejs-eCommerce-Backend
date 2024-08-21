'use strict';

const { OKSuccessResponse } = require('../core/success.response');
const CheckoutService = require('../services/checkout.service');

class CheckoutController {
    async checkoutReview(req, res, next) {
        const data = await CheckoutService.checkoutReview(req.body);
        return new OKSuccessResponse({
            message: 'Checkout review successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }
}


module.exports = new CheckoutController();