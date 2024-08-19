'use strict';

const { furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { Product } = require('./product.model')

class Furniture extends Product {
    constructor(payload) {
        super(payload)
    }

    async createProduct() {
        const newFurniture = await furniture.create({
            ...this?.product_attributes,
            product_shop: this?.product_shop
        });
        if (!newFurniture) throw new BadRequestError('Something went wrong creating new Furniture product!')

        const newProduct = await super.createProduct(newFurniture?._id);
        if (!newFurniture) throw new BadRequestError('Something went wrong creating new product!')

        return newProduct;
    }
}

const productType = 'Furniture';
const ModelType = Furniture;

module.exports = {
    productType,
    ModelType
};