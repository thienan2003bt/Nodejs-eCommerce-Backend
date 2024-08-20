'use strict';

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const Utils = require('../utils/index');
const ProductRepository = require('../models/repositories/product.repo');
const DiscountRepository = require('../models/repositories/discount.repo');

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
            discount_appliedProductIDs: data?.applyTo === 'all' ? [] : data?.appliedProductIDs
        }
    }

    static async createDiscountCode(payload) {
        const { code, startDate, endDate, shopID } = payload;

        if (new Date() < newDate(startDate) || new Date() > new Date(endDate)) {
            throw new BadRequestError('Discount code has expired!')
        }
        if (new Date(startDate) < newDate(endDate)) {
            throw new BadRequestError('Start date must be before end date!')
        }

        const existingDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopID: Utils.convertToObjectIdMongoose(shopID)
        }).lean();

        if (existingDiscount && existingDiscount?.discount_isActive === true) {
            throw new BadRequestError('Discount code existed!');
        }

        const newDiscount = await discountModel.create(DiscountService.normalizeDiscountData(payload));
        return newDiscount;
    }


    static async updateDiscountCode() {

    }


    static async getAllDiscountCodesWithProduct({ code, shopID, userID, limit = 50, page = 1 }) {
        const existingDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopID: Utils.convertToObjectIdMongoose(shopID)
        }).lean();

        if (!existingDiscount || !existingDiscount?.discount_isActive || existingDiscount?.discount_isActive === false) {
            throw new NotFoundError('Discount code does not exist!');
        }

        const { discount_applyTo, discount_appliedProductIDs } = existingDiscount;
        const products = [];
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

    static async getAllDiscountCodesByShop({ code, shopID, userID, limit = 50, page = 1 }) {
        const filter = {
            discount_shopID: Utils.convertToObjectIdMongoose(shopID),
            discount_isActive: true
        }
        const unSelect = ['__v', 'discount_shopID'];
        const discounts = await DiscountRepository.findAllDiscountsCodeUnSelect({ limit, page, filter, unSelect, model: discountModel })
        return discounts;
    }
}



module.exports = DiscountService;