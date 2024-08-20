'use strict';
const inventoryModel = require('../inventory.model');
const { Types } = require('mongoose')

const insertInventory = async ({ product_id, shop_id, stock, location = 'Unknown' }) => {
    return await inventoryModel.create({
        inven_shopID: shop_id,
        inven_productID: product_id,
        inven_stock: stock,
        inven_location: location
    })
}

module.exports = {
    insertInventory,
}