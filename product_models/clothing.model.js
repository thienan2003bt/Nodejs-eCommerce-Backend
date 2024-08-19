'use strict';

const { clothing } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { Product } = require('./product.model')

class Clothing extends Product {
    constructor(payload) {
        super(payload)
    }

    async createProduct() {
        const newClothing = await clothing.create({
            ...this?.product_attributes,
            product_shop: this?.product_shop
        });
        if (!newClothing) throw new BadRequestError('Something went wrong creating new Clothing product!')

        const newProduct = await super.createProduct(newClothing?._id);
        if (!newClothing) throw new BadRequestError('Something went wrong creating new product!')

        return newProduct;
    }
}
const productType = 'Clothing';
const ModelType = Clothing;

module.exports = {
    productType,
    ModelType
};
