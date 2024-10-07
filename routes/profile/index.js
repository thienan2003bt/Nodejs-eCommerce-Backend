'use strict';

const { apiKey } = require('../../auth/checkAuth');
const ProfileController = require('../../controllers/profile.controller');
const { aSyncHandler } = require('../../helpers/asyncHandler');
const RBACMiddleware = require('../../middlewares/rbac.middleware');

const router = require('express').Router();

router.use(apiKey)

router.get("/", (req, res) => {
    return res.status(200).send("Welcome!")
})

router.get("/viewAny", RBACMiddleware.grantAccess('readAny', 'profile'), aSyncHandler(ProfileController.profiles))
router.get("/viewOwn",  RBACMiddleware.grantAccess('readOwn', 'profile'), aSyncHandler(ProfileController.profile))


module.exports = router;