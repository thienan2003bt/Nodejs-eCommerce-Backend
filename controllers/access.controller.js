'use strict';
const AccessService = require('../services/access.service');
const { CreatedSuccessResponse } = require('../core/success.response');

class AccessController {
    signUp = async (req, res, next) => {
        const data = await AccessService.signUp(req.body)
        return new CreatedSuccessResponse({
            code: '20001',
            statusCode: 201,
            metadata: { data },
        }).send(res);
    }
}


module.exports = new AccessController();