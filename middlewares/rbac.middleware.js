'use strict';
const RBAC = require("./role.middleware");
const {AuthFailureError} = require("../core/error.response");

class RBACMiddleware {
    grantAccess(action, resource) {
        return async (req, res, next) => {
            try {
                // TODO: Replace this with role queried from database
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