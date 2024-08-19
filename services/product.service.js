'use strict';

const { product, clothing, electronic } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');

class ProductFactory {
    static createProduct = async (type, payload) => {
        switch (type) {
            case 'Clothing': return new Clothing(payload).createProduct();
            case 'Electronics': return new Electronic(payload).createProduct();
            default: throw new BadRequestError('Invalid product type!')
        }
    }
}


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
        console.log("Creating product with payload: ");
        console.log(this);
        return await product.create({
            ...this,
            _id: productID
        });
    }
}


class Clothing extends Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes }) {
        super({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes })
    }

    async createProduct() {
        console.log("~~~Clothing attributes: ");
        console.log(this.product_attributes);
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

class Electronic extends Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes }) {
        super({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes })
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

module.exports = ProductFactory