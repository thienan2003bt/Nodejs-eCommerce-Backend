'use strict';

const { OKSuccessResponse } = require("../core/success.response");
const rbacService = require("../services/rbac.service");

class RBACController {
    static async createNewResource(req, res, next) {
        const data = await rbacService.createNewResource(req.body);
        return new OKSuccessResponse({
            message: "Create new resource successfully!",
            metadata: data,
        }).send(res);
    }

    static async getResourceList(req, res, next) {
        const data = await rbacService.getResourceList(req.body);
        return new OKSuccessResponse({
            message: "Get Resource list successfully!",
            metadata: data,
        }).send(res);
    }

    static async createNewRole(req, res, next) {
        const data = await rbacService.createNewRole(req.body);
        return new OKSuccessResponse({
            message: "Create new role successfully!",
            metadata: data,
        }).send(res);
    }

    static async getRoleList(req, res, next) {
        const data = await rbacService.getRoleList(req.body);
        return new OKSuccessResponse({
            message: "Get role list successfully!",
            metadata: data,
        }).send(res);
    }
}

module.exports = RBACController;