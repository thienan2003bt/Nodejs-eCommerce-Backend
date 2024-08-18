'use strict';
const AccessService = require('../services/access.service');
const { OKSuccessResponse, CreatedSuccessResponse } = require('../core/success.response');

class AccessController {
    login = async (req, res, next) => {
        const data = await AccessService.login(req.body)
        return new OKSuccessResponse({
            message: 'Login successfully!',
            code: '20000',
            metadata: { data },
        }).send(res);
    }

    logout = async (req, res, next) => {
        const data = await AccessService.logout(req.keyStore);
        return new OKSuccessResponse({
            message: 'Logout successfully!',
            code: '20000',
            metadata: { deletedKeyToken: data },
        }).send(res);
    }

    signUp = async (req, res, next) => {
        const data = await AccessService.signUp(req.body)
        return new CreatedSuccessResponse({
            message: 'Sign up successfully!',
            code: '20001',
            metadata: { data },
            options: {
                limit: 10,
            }
        }).send(res);
    }
}


module.exports = new AccessController();