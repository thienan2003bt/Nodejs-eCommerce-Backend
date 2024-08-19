'use strict';

const { electronic } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { Product } = require('./product.model')

class Electronic extends Product {
    constructor(payload) {
        super(payload)
    }

    async createProduct() {
        const newElectronic = await electronic.create({
            ...this?.product_attributes,
            product_shop: this?.product_shop
        });
        if (!newElectronic) throw new BadRequestError('Something went wrong creating new Electronic product!')

        const newProduct = await super.createProduct(newElectronic?._id);
        if (!newElectronic) throw new BadRequestError('Something went wrong creating new product!')

        return newProduct;
    }
}

const productType = 'Electronic';
const ModelType = Electronic;

module.exports = {
    productType,
    ModelType
};
