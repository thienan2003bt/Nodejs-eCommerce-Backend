'use strict';

const NotificationTypeHelper = require("../helpers/notificationType");
const notificationModel = require("../models/notification.model");


class NotificationService {
    static async pushNotiToSystem({ type = 'SHOP-001', receiverID = 1, senderID = 1, options = {} }) {
        let noti_content = NotificationTypeHelper.getTemplateNotiContent(type);
        const newNoti = await notificationModel.create({
            noti_type: type,
            noti_content,
            noti_senderID: senderID,
            noti_receiverID: receiverID,
            noti_options: options,
        });

        return newNoti;
    }

    static async getListNotiByUser({ userID = 1, type = 'all', isRead = 0 }) {
        const match = { noti_receiverID: userID };
        if (type !== 'all') {
            match['noti_type'] = type;
        }

        return await notificationModel.aggregate([
            { $match: match },
            {
                $project: {
                    noti_type: 1,
                    noti_senderID: 1,
                    noti_receiverID: 1,
                    noti_options: 1,
                    noti_content: {
                        $concat: [
                            { $substr: ['$noti_options.shop_name', 0, -1] },
                            ' just added a new product',
                            { $substr: ['$noti_options.product_name', 0, -1] },
                        ]
                    },
                    // noti_content: 1,
                    createdAt: 1,
                }
            }
        ])
    }
}

module.exports = NotificationService;