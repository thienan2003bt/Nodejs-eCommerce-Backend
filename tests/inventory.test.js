'use strict';

const redisPubSubService = require('../services/redisPubSub.service');

class InventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            InventoryServiceTest.updateInventory(message);
        })
    }

    static updateInventory({ productID, quantity }) {
        console.log(`Update inventory for product: ${productID} with quantity ${quantity}`);
    }
}

module.exports = new InventoryServiceTest();