'use strict';
const inventoryModel = require('../inventory.model');
const { Types } = require('mongoose')
const Utils = require('../../utils/index');

const insertInventory = async ({ product_id, shop_id, stock, location = 'Unknown' }) => {
    return await inventoryModel.create({
        inven_shopID: shop_id,
        inven_productID: product_id,
        inven_stock: stock,
        inven_location: location
    })
}

const reservationInventory = async ({ productID, quantity, cartID }) => {
    const query = {
        inven_productID: Utils.convertToObjectIdMongoose(productID),
        inven_stock: +quantity,
    }
    const updateSet = {
        $inc: { inven_stock: -quantity },
        $push: {
            inven_reservations: {
                quantity, cartID, createdAt: new Date(),
            }
        }
    }

    return await inventoryModel.updateOne(query, updateSet)
}

module.exports = {
    insertInventory,
    reservationInventory,
}