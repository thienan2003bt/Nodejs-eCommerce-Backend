'use strict';

const { AuthFailureError } = require("../core/error.response");
const apikeyModel = require("../models/apikey.model");
const crypto = require('crypto')
require('dotenv').config();

const generatePublicApiKey = async () => {
    const newApiKey = await apikeyModel.create({
        key: crypto.randomBytes(64).toString('hex'),
        permissions: ['0000']
    })

    return newApiKey?.key ?? '';
}

const generateApiKey = async ({ admin_permission }) => {
    if (!admin_permission || admin_permission !== process.env.ADMIN_PERMISSION_STRING_FOR_API_KEY) {
        throw new AuthFailureError('Admin permission is required!')
    }
    return generatePublicApiKey();
}

const findByID = async (key) => {
    try {
        const objKey = await apikeyModel.findOne({
            key,
            status: true
        }).lean();

        return objKey ?? null;
    } catch (error) {
        console.log("Error finding object by APIKey: " + error.message);
        return null;
    }
}

module.exports = {
    findByID,
    generateApiKey,
}