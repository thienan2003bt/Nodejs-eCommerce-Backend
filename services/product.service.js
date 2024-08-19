'use strict';

const { product, clothing, electronic, furniture } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');

class ProductFactory {
    static productRegistry = {};


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


class Furniture extends Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes }) {
        super({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes })
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

// const productConfig = require('../configs/product.config');
// for (const type in productConfig) {
//     if (Object.prototype.hasOwnProperty.call(productConfig, type)) {
//         console.log(`Add type ${type} into product registry`);
//         ProductFactory.registerProductType(type, productConfig[type])
//     }
// }

// console.log("Product registry: ");
// console.log(Product.productRegistry);
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = {
    ProductFactory,
    Clothing, Electronic, Furniture
}