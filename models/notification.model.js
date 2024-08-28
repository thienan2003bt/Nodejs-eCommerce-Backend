'use strict';
const NotificationType = require('../helpers/notificationType');
const mongoose = require('mongoose'); // Erase if already required
const { Types } = require('mongoose')
const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

// Declare the Schema of the Mongo model
const notificationSchema = new mongoose.Schema({
    noti_type: { type: String, enum: NotificationType.getAllTypes() },
    noti_senderID: { type: Types.ObjectId, ref: 'Shop', required: true },
    noti_receiverID: { type: Number, required: true },
    noti_content: { type: String, default: '' },
    noti_options: { type: Object, default: {} },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);