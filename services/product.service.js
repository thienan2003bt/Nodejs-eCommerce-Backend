'use strict';

const { BadRequestError } = require('../core/error.response');
const { initProductType } = require('../product_models');

class ProductFactory {
    static productRegistry = initProductType();

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static createProduct = async (type, payload) => {
        console.log("product registry: ");
        console.log(ProductFactory.productRegistry);
        console.log(ProductFactory.productRegistry[type]);
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError('Invalid product type!')
        }

        return new productClass(payload).createProduct();
    }
}



module.exports = {
    ProductFactory,
}