'use strict';

const { OKSuccessResponse } = require("../core/success.response");
const ProfileService = require('../services/profile.service');

class ProfileController {
    static async profiles(req, res, next) {
        const data = await ProfileService.viewAny();
        return new OKSuccessResponse({
            message: "Get profile by admin successfully!",
            metadata: data
        }).send(res);
    }

    static async profile(req, res, next) {
        const data = await ProfileService.viewOne();
        return new OKSuccessResponse({
            message: "Get profile by user successfully!",
            metadata: data
        }).send(res);
    }
}


module.exports = ProfileController;