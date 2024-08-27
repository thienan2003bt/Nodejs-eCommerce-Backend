'use strict';
const NotificationTypeConfig = require('../configs/notificationType');

class NotificationTypeHelper {
    constructor() {
        this._types = NotificationTypeConfig.types;
    }

    static getAllTypes() {
        return this._types;
    }

    static getTemplateNotiContent(type) {
        return NotificationTypeConfig.contents.get(type) ?? 'Invalid notification type!';
    }
}

module.exports = NotificationTypeHelper;