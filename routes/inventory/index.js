const router = require('express').Router();
const { authenticationV2 } = require('../../auth/auth.utils');
const { aSyncHandler } = require('../../helpers/asyncHandler');
const InventoryController = require('../../controllers/inventory.controller');

// Authentication required
router.use(authenticationV2)

router.post('/review', aSyncHandler(InventoryController.addStockToInventory))



module.exports = router;