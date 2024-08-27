'use strict';
const { product } = require('../models/product.model');
const ProductRepository = require('../models/repositories/product.repo');
const InventoryRepository = require('../models/repositories/inventory.repo');
const NotificationService = require('../services/notification.service');
const NotificationTypeConfig = require('../configs/notificationType');

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
        const newProduct = await product.create({
            ...this,
            _id: productID
        });

        if (newProduct) {
            await InventoryRepository.insertInventory({
                product_id: newProduct?._id,
                shop_id: this.product_shop,
                stock: this?.product_quantity
            })
        }

        // Push noti to system
        await NotificationService.pushNotiToSystem({
            type: NotificationTypeConfig.types.ADD_NEW_PRODUCT,
            receiverID: 1,
            senderID: this.product_shop,
            options: {
                product_name: this.product_name,
                shop_name: this.product_shop,
            }
        })
        return newProduct;
    }

    async updateProduct(product_id, payload) {
        return await ProductRepository.updateProductByID(product_id, payload, product)
    }
}

module.exports = { Product };