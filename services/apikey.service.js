'use strict';

const apikeyModel = require("../models/apikey.model");
const crypto = require('crypto')

const generateApiKey = async () => {
    const newApiKey = await apikeyModel.create({
        key: crypto.randomBytes(64).toString('hex'),
        permissions: ['0000']
    })

    return newApiKey?.key ?? '';
}

const findByID = async (key) => {
    generateApiKey();
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
}