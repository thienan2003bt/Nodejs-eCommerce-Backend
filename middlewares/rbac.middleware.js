'use strict';
const RBAC = require("./role.middleware");
const {AuthFailureError} = require("../core/error.response");
const RBACService = require("../services/rbac.service");

class RBACMiddleware {
    grantAccess(action, resource) {
        return async (req, res, next) => {
            try {
                // TODO: Replace this with role queried from database
                const roles = await RBACService.getRoleList({adminId: 'admin'});
                RBAC.setGrants(roles);

                const role_name = req.query.role;
                console.log("Role name: " + role_name);
                const permissions = RBAC.can(role_name)[action](resource);
                if(permissions.granted === false) {
                    throw new AuthFailureError("Permission denied!")
                }
                next();
            } catch (error) {
                next(error);
            }
        }
    }
}

module.exports = new RBACMiddleware();