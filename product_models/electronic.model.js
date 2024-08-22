'use strict';

const { electronic } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { Product } = require('./product.model')
const ProductRepository = require('../models/repositories/product.repo');
const Utils = require('../utils');

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

    /*  !!! UPDATE PRODUCT GUIDELINE !!!
   1 - Remove undefined or null keys in the payload which is created by the constructor.
   2 - If the payload has product_attributes, update the data in the corresponding models in DB.
   3 - Update the product data in Product model in DB.
   4 - Return the updated product.
   */
    async updateProduct(product_id) {
        // Step 1
        const objParams = Utils.removeUndefinedObject(this);

        // Step 2
        if (objParams?.product_attributes) {
            await ProductRepository.updateProductByID(
                product_id,
                Utils.updateNestedObject(objParams?.product_attributes),
                electronic
            )
        }

        // Step 3
        const updatedProduct = await super.updateProduct(product_id, Utils.updateNestedObject(objParams));

        // Step 4
        return updatedProduct;
    }
}

const productType = 'Electronic';
const ModelType = Electronic;

module.exports = {
    productType,
    ModelType
};
