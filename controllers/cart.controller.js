'use strict';

const { OKSuccessResponse } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {

    /**
     * @desc add product to user's cart
     * @param {int} userID 
     * @param {*} res 
     * @param {*} next 
     * @method POST
     * @url v1/api/cart/user
     * @return {}
     */
    async addToCart(req, res, next) {
        const data = await CartService.addToCart(req.body)
        return new OKSuccessResponse({
            message: 'Add product to cart successfully!',
            code: 200,
            metadata: { data }
        }).send(res)
    }

    async updateUserCart(req, res, next) {
        const data = await CartService.addToCartV2(req.body)
        return new OKSuccessResponse({
            message: 'Update user cart successfully!',
            code: 200,
            metadata: { data }
        }).send(res)
    }

    async deleteUserCartItem(req, res, next) {
        const data = await CartService.deleteUserCartItem(req.body)
        return new OKSuccessResponse({
            message: 'Delete product in cart successfully!',
            code: 200,
            metadata: { data }
        }).send(res)
    }

    async getListUserCart(req, res, next) {
        const data = await CartService.getListUserCart(req.query)
        return new OKSuccessResponse({
            message: 'Get product list of user cart successfully!',
            code: 200,
            metadata: { data }
        }).send(res)
    }
}

module.exports = new CartController();