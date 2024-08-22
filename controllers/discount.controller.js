'use strict';
const { OKSuccessResponse } = require('../core/success.response');
const DiscountService = require('../services/discount.service');

class DiscountController {
    async createDiscountCode(req, res, next) {
        const data = await DiscountService.createDiscountCode({
            ...req.body,
            shopID: req.user?.userID
        })
        return new OKSuccessResponse({
            message: 'Create discount code successfully!',
            code: 201,
            metadata: { data }
        }).send(res);
    }

    async getAllDiscountCodesByShop(req, res, next) {
        const data = await DiscountService.getAllDiscountCodesByShop({
            ...req.query,
            shopID: req.user?.userID
        })
        return new OKSuccessResponse({
            message: 'Get discount codes by shop successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }

    async getAllDiscountCodesWithProduct(req, res, next) {
        const data = await DiscountService.getAllDiscountCodesWithProduct({
            ...req.query,
        })
        return new OKSuccessResponse({
            message: 'Get discount codes with product successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }

    async applyDiscountCode(req, res, next) {
        const data = await DiscountService.applyDiscountCode({
            ...req.body,
        })
        return new OKSuccessResponse({
            message: 'Apply discount code successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }

    async deleteDiscountCode(req, res, next) {
        const data = await DiscountService.deleteDiscountCode({
            ...req.body,
        })
        return new OKSuccessResponse({
            message: 'Apply discount code successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }

    async cancelDiscountCode(req, res, next) {
        const data = await DiscountService.cancelDiscountCode({
            ...req.body,
        })
        return new OKSuccessResponse({
            message: 'Apply discount code successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }
}
module.exports = new DiscountController();