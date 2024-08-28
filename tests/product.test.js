'use strict';

const redisPubSubService = require('../services/redisPubSub.service');

class ProductServiceTest {
    purchaseProduct({ productID, quantity }) {
        const order = { productID, quantity };

        redisPubSubService.publish('purchase_events', JSON.stringify(order));
    }
}

module.exports = new ProductServiceTest();