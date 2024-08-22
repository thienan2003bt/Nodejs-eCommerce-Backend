'use strict';
const { BadRequestError } = require('../core/error.response');
const inventoryModel = require('../models/inventory.model');
const ProductRepository = require('../models/repositories/product.repo');
const Utils = require('../utils/index');

class InventoryService {
    static async addStockToInventory({ stock, productID, shopID, location = '1234 Tran Phu, HCM City' }) {
        const product = ProductRepository.getProductByID(productID)
        if (!product) {
            throw new BadRequestError('The product does not exist!');
        }

        const query = { inven_shopID: Utils.convertToObjectIdMongoose(shopID), inven_productID: Utils.convertToObjectIdMongoose(productID) }
        const updateSet = {
            $inc: { inven_stock: +stock },
            $set: { inven_location: location }
        }
        const options = { upsert: true, new: true };
        return await inventoryModel.findOneAndUpdate(query, updateSet, options);
    }
}



module.exports = InventoryService;