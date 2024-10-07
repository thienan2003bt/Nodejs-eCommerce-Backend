'use strict';

'use strict';

const { apiKey } = require('../../auth/checkAuth');
const RBACController = require('../../controllers/rbac.controller');
const { aSyncHandler } = require('../../helpers/asyncHandler');

const router = require('express').Router();

router.use(apiKey)

router.get("/resources", aSyncHandler(RBACController.getResourceList));
router.get("/roles", aSyncHandler(RBACController.getRoleList));


router.post("/resource", aSyncHandler(RBACController.createNewResource));
router.post("/role", aSyncHandler(RBACController.createNewRole));


module.exports = router;