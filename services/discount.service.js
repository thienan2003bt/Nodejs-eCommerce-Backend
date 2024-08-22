'use strict';

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const Utils = require('../utils/index');
const ProductRepository = require('../models/repositories/product.repo');
const DiscountRepository = require('../models/repositories/discount.repo');
const { lte } = require("lodash");
const { Types } = require("mongoose");

class DiscountService {
    static normalizeDiscountData = (data) => {
        return {
            discount_name: data?.name,
            discount_description: data?.description,
            discount_type: data?.type,
            discount_value: data?.value,
            discount_code: data?.code,
            discount_startDate: data?.startDate,
            discount_endDate: data?.endDate,
            discount_maxUses: data?.maxUses,
            discount_usedCount: data?.usedCount,
            discount_usersUsed: data?.usersUsed,
            discount_maxUsesPerUser: data?.maxUsesPerUser,
            discount_minOrderValue: data?.minOrderValue,
            discount_shopID: data?.shopID,
            discount_isActive: data?.isActive,
            discount_applyTo: data?.applyTo,
            discount_appliedProductIDs: data?.applyTo === 'all' ? [] : data?.appliedProductIDs.map((productID) => new Types.ObjectId(productID))
        }
    }

    static async createDiscountCode(payload) {
        const { code, startDate, endDate, shopID } = payload;

        if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
            throw new BadRequestError('Discount code has expired!')
        }
        if (new Date(startDate) >= new Date(endDate)) {
            throw new BadRequestError('Start date must be before end date!')
        }

        const existingDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopID: Utils.convertToObjectIdMongoose(shopID)
        }).lean();

        if (existingDiscount && existingDiscount?.discount_isActive === true) {
            throw new BadRequestError('Discount code existed!');
        }

        const data = DiscountService.normalizeDiscountData(payload);
        const newDiscount = await discountModel.create(data);
        return newDiscount;
    }


    static async updateDiscountCode() {

    }


    static async getAllDiscountCodesWithProduct({ code, shopID, limit = 50, page = 1 }) {
        const existingDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopID: Utils.convertToObjectIdMongoose(shopID)
        }).lean();

        if (!existingDiscount || !existingDiscount?.discount_isActive || existingDiscount?.discount_isActive === false) {
            throw new NotFoundError('Discount code does not exist!');
        }

        const { discount_applyTo, discount_appliedProductIDs } = existingDiscount;
        let products = [];
        const sortBy = 'ctime';

        const select = ['product_name']
        if (discount_applyTo === 'all') {
            const filter = {
                product_shop: Utils.convertToObjectIdMongoose(shopID),
                is_published: true,
            }
            products = await ProductRepository.findAllProducts(+limit, sortBy, +page, filter, select)
        } else if (discount_applyTo === 'specific') {
            const filter = {
                _id: { $in: discount_appliedProductIDs },
                product_shop: Utils.convertToObjectIdMongoose(shopID),
                is_published: true,
            }
            products = await ProductRepository.findAllProducts(+limit, sortBy, +page, filter, select)
        }

        return products;
    }

    static async getAllDiscountCodesByShop({ shopID, limit = 50, page = 1 }) {
        const filter = {
            discount_shopID: Utils.convertToObjectIdMongoose(shopID),
            discount_isActive: true
        }
        const unSelect = ['__v', 'discount_shopID'];
        const discounts = await DiscountRepository.findAllDiscountsCodeUnSelect({ limit, page, filter, unSelect, model: discountModel })
        return discounts;
    }

    static async applyDiscountCode({ code, userID, shopID, products }) {
        const existingDiscount = await DiscountRepository.findExistingDiscount({
            model: discountModel,
            filter: {
                discount_code: code,
                discount_shopID: shopID
            }
        })

        if (!existingDiscount) {
            throw new NotFoundError('Discount does not exist!')
        }

        const { discount_type, discount_value, discount_usersUsed, discount_isActive, discount_maxUses, discount_minOrderValue, discount_maxUsesPerUser, discount_startDate, discount_endDate } = existingDiscount;
        if (discount_isActive === false) {
            throw new NotFoundError('Discount is expired!')
        }
        if (discount_maxUses === 0) {
            throw new NotFoundError('Discount codes are out of stock!')
        }
        if (new Date() < new Date(discount_startDate) || new Date() > new Date(discount_endDate)) {
            throw new NotFoundError('Discount is expired!')
        }
        let totalOrder = 0;
        if (discount_minOrderValue > 0) {
            totalOrder = products?.reduce((account, product) => {
                return +account + (+(product?.quantity ?? 0) * (+product?.price ?? 0))
            }, 0)
        }

        if (totalOrder < discount_minOrderValue) {
            throw new NotFoundError('Discount require a minium order value!')
        }

        if (discount_maxUsesPerUser > 0) {
            const userDiscount = discount_usersUsed.find(user => user?.userID === userID)
            if (userDiscount) {
                // TODO: handle this
            }
        }

        // TODO: validate product's information like: _id, price, ...

        const amount = discount_type === 'fixed_amount' ? +discount_value : +totalOrder * (+discount_value / 100)
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        }
    }

    static async deleteDiscountCode({ code, shopID }) {
        // Considerate the situation that deleted discounts are migrated onto another DB instead.
        const deletedDiscount = await discountModel.findOneAndDelete({
            discount_code: code,
            discount_shopID: Utils.convertToObjectIdMongoose(shopID),
        })

        return deletedDiscount;
    }

    static async cancelDiscountCode({ code, shopID, userID }) {
        // Considerate the situation that deleted discounts are migrated onto another DB instead.
        const filter = {
            discount_code: code,
            discount_shopID: Utils.convertToObjectIdMongoose(shopID),
        }
        const existingDiscount = await DiscountRepository.findExistingDiscount({ model: discountModel, filter })

        if (!existingDiscount) {
            throw new NotFoundError('Discount does not exist!')
        }


        const result = await discountModel.findByIdAndUpdate(existingDiscount?._id, {
            $pull: {
                discount_usersUsed: userID,
            },
            $inc: {
                discount_maxUses: 1,
                discount_usedCount: -1
            }
        })

        return result;
    }
}

module.exports = DiscountService;