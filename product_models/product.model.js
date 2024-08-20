'use strict';
const { product } = require('../models/product.model');
const ProductRepository = require('../models/repositories/product.repo');

class Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }


    async createProduct(productID) {
        return await product.create({
            ...this,
            _id: productID
        });
    }

    async updateProduct(product_id, payload) {
        return await ProductRepository.updateProductByID(product_id, payload, product)
    }
}

module.exports = { Product };