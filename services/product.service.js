'use strict';

const { BadRequestError } = require('../core/error.response');
const { initProductType } = require('../product_models');
const ProductRepository = require('../models/repositories/product.repo');

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

    static publishProductByShop = async ({ product_shop, product_id }) => {
        return await ProductRepository.publishProductByShop(product_shop, product_id);
    }

    static unPublishProductByShop = async ({ product_shop, product_id }) => {
        return await ProductRepository.unPublishProductByShop(product_shop, product_id);
    }

    // GET

    static findAllDraftsForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
        const query = { product_shop, is_draft: true };
        return await ProductRepository.findAllDraftsForShop(query, limit, skip);
    }

    static findAllPublishedProductsForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
        const query = { product_shop, is_published: true };
        return await ProductRepository.findAllPublishedProductsForShop(query, limit, skip);
    }

    static searchProductsByUser = async ({ keySearch }) => {
        return await ProductRepository.searchProductsByUser(keySearch);
    }
}



module.exports = {
    ProductFactory,
}