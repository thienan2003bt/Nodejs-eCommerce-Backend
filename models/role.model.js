'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

// Declare the Schema of the Mongo model
const roleSchema = new mongoose.Schema({
    role_slug: {type: String, required: true},
    role_name: {type: String, default: 'USER', enum: ['USER', 'SHOP', 'ADMIN']},
    role_status: {type: String, default: 'INACTIVE', enum: ['INACTIVE', 'ACTIVE', 'BLOCKED']},
    role_description: {type: String, default: ''},
    role_grants: [{
        resource: {type: mongoose.Types.ObjectId, ref: "Resource", required: true},
        actions: [ {type: String, required: true} ],
        attributes: {type: String, default: ''}
    }],
}, {
    timestamps: true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, roleSchema);