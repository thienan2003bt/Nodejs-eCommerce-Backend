'use strict';

const { CreatedSuccessResponse } = require("../core/success.response");
const { generateApiKey } = require("../services/apikey.service");

const createNewApiKey = async (req, res, next) => {
    const newAPIKey = await generateApiKey(req.body)
    return new CreatedSuccessResponse({
        code: 20001,
        message: "New API key created successfully!",
        metadata: { newAPIKey },
    }).send(res);
}

module.exports = {
    createNewApiKey,
}