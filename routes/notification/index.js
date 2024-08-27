const router = require('express').Router();
const { authentication } = require('../../auth/auth.utils');
const { apiKey, permissions } = require('../../auth/checkAuth');
const { aSyncHandler } = require('../../helpers/asyncHandler');

const notificationController = require('../../controllers/notification.controller');

// For authenticated users <=> shop owners
router.use(authentication)

// GET
router.get('/', aSyncHandler(notificationController.getListNotiByUser))




module.exports = router;