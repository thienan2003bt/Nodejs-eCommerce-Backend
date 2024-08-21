'use strict';

const CartRepository = require('../models/repositories/cart.repo');
const ProductRepository = require('../models/repositories/product.repo');
const { BadRequestError } = require('../core/error.response');
const DiscountService = require('./discount.service');

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
}


module.exports = CheckoutService;