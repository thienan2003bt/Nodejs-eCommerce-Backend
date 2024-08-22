'use strict';

const { OKSuccessResponse } = require('../core/success.response');
const InventoryService = require('../services/inventory.service');

class InventoryController {
    async addStockToInventory(req, res, next) {
        const data = await InventoryService.addStockToInventory(req.body);
        return new OKSuccessResponse({
            message: 'Add stock to inventory successfully',
            code: 200,
            metadata: { data },
        }).send(res);
    }
}

module.exports = new InventoryController();