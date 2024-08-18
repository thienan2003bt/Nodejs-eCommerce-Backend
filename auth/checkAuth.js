'use strict';

const { findByID } = require("../services/apikey.service");


const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        const objKey = await findByID(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }


        req.objKey = objKey;
        return next();
    } catch (error) {
        console.log("Error checking API key middleware: ", error.message);
        return res.status(500);
    }
}

const permissions = (permission) => {
    return (req, res, next) => {
        if (!req?.objKey?.permissions) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }

        const isValidPermission = req.objKey?.permissions?.includes(permission)
        if (!isValidPermission) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }

        return next();
    }
}


module.exports = {
    apiKey,
    permissions,
}