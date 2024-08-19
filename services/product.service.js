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
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError('Invalid product type!')
        }

        return new productClass(payload).createProduct();
    }

    static updateProduct = async (type, payload) => {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError('Invalid product type!')
        }

        return new productClass(payload).updateProduct();
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

    static findAllProducts = async ({ limit = 50, sort = 'ctime', page = 1, filter = { is_published: true } }) => {
        const select = ['product_name', 'product_price', 'product_thumb'];
        return await ProductRepository.findAllProducts(limit, sort, page, filter, select);
    }

    static findProduct = async ({ product_id }) => {
        const unSelect = ['__v'];
        return await ProductRepository.findProduct(product_id, unSelect);
    }

}



module.exports = {
    ProductFactory,
}