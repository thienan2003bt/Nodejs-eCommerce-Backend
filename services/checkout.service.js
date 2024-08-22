'use strict';

const CartRepository = require('../models/repositories/cart.repo');
const ProductRepository = require('../models/repositories/product.repo');
const orderModel = require('../models/order.model');
const { BadRequestError } = require('../core/error.response');
const DiscountService = require('./discount.service');
const RedisService = require('./redis.service');



class CheckoutService {
    /* CHECKOUT REVIEW GUIDELINE
    1 - Check if cartID is valid
    */
    static async checkoutReview({ cartID, userID, shop_order_ids = [] }) {
        const existingCart = await CartRepository.findCartByID(cartID);
        if (!existingCart) {
            throw new BadRequestError('Cart does not exist!');
        }

        let checkOutOrder = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }
        let shop_order_ids_new = []

        for (let i = 0; i < shop_order_ids?.length; i++) {
            const { shopID, shop_discounts = [], item_products = [] } = shop_order_ids[i];

            let checkedProducts = await ProductRepository.checkProductByServer(item_products)
            if (!checkedProducts || !checkedProducts[0]) {
                throw new BadRequestError('Invalid order!')
            }

            checkedProducts = checkedProducts.map((ele, i) => {
                return {
                    ...ele,
                    quantity: item_products[i]?.quantity,
                }
            })
            const checkoutPrice = await checkedProducts?.reduce((account, product, index) => {
                return account + (+ product?.quantity * +product?.price);
            }, 0)

            checkOutOrder.totalPrice += +checkoutPrice;
            const itemCheckout = {
                shopID,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyCheckout: checkoutPrice,
                item_products: checkedProducts
            }

            // Only take the first discount
            if ((shop_discounts?.length ?? 0) > 0) {
                const { totalPrice = 0, discount = 0 } = await DiscountService.applyDiscountCode({
                    code: shop_discounts[0]?.code,
                    userID, shopID: shop_discounts[0]?.shopID,
                    products: checkedProducts
                })
                checkOutOrder.totalDiscount += +discount;
                if (+discount > 0) {
                    itemCheckout.priceApplyCheckout = +checkoutPrice - +discount;
                }
            }
            checkOutOrder.totalCheckout += +itemCheckout.priceApplyCheckout;
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkOutOrder,
        }
    }

    static async checkoutOrder({ shop_order_ids, cartID, userID, user_address = {}, user_payment = {} }) {
        const { shop_order_ids_new, checkOutOrder } = await CheckoutService.checkoutReview({ cartID, userID, shop_order_ids });

        const acquiredProducts = [];
        const products = shop_order_ids_new?.flatMap(order => order?.item_products);
        for (let index = 0; index < products.length; index++) {
            const { quantity, productID } = products[index];

            const keyLock = await RedisService.acquireLock({ productID, cartID, quantity })
            acquiredProducts.push(keyLock ? true : false);
            if (keyLock) {
                await RedisService.releaseLock(keyLock);
            }
        }

        if (acquiredProducts?.includes(false)) {
            throw new BadRequestError('There are some updated products in your order, please check your cart again!');
        }

        const newOrder = await orderModel.create({
            order_userID: userID,
            order_checkout: checkOutOrder,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        });

        if (newOrder) {

        }
        return newOrder;
    }


    static async getOrdersByUser() {

    }

    static async getOneOrderByUser() {

    }

    static async cancelOrderByUser() {

    }

    static async updateOrderStatusByShop() {

    }
}



module.exports = CheckoutService;