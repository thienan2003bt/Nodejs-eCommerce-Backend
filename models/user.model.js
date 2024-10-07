'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    user_slug: {type: String, required: true},
    user_name: {type: String, required: true},
    user_password: {type: String, required: true},
    user_salf: {type: String, default: ''},
    user_email: {type: String, required: true},
    user_fullname: {type: String, default: ''},
    user_phone: {type: String, default: ''},
    user_gender: {type: String, default: 'NOT_GIVEN', enum: ['MALE', 'FEMALE', 'OTHER', 'NOT_GIVEN']},
    user_avatar: {type: String, default: ''},
    user_dob: {type: Date, default: new Date()},
    user_roles: {type: mongoose.Types.ObjectId, ref: 'Role'},
    user_status: {type: String, default: 'INACTIVE', enum: ['INACTIVE', 'ACTIVE', 'BLOCKED']},
}, {
    timestamps: true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);