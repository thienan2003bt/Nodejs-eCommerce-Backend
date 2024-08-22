'use strict';

const mongoose = require('mongoose'); // Erase if already required
const { Types } = require('mongoose');
const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'



// Declare the Schema of the Mongo model
const commentSchema = new mongoose.Schema({
    comment_productID: { type: Types.ObjectId, ref: 'Product' },
    comment_userID: { type: Number, default: 1 },
    comment_content: { type: String, default: 'text' },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentID: { type: Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false },
    // Consider moving deleted comments to another DB
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, commentSchema);