'use strict';

const { OKSuccessResponse } = require('../core/success.response');
const NotificationService = require('../services/notification.service');

class NotificationController {
    async getListNotiByUser(req, res, next) {
        const data = await NotificationService.getListNotiByUser({ ...req.query })
        return new OKSuccessResponse({
            message: 'Get list of notifications by user successfully!',
            code: 200,
            metadata: { data },
        }).send(res);
    }
}

module.exports = new NotificationController();