'use strict';

const mongoose = require('mongoose'); // Erase if already required
const { Types } = require('mongoose')
const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

// Declare the Schema of the Mongo model
const discountSchema = new mongoose.Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' },
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_startDate: { type: Date, required: true },
    discount_endDate: { type: Date, required: true },
    discount_maxUses: { type: Number, required: true },
    discount_maxUsesPerUser: { type: Number, required: true },
    discount_users: { type: Array, default: [] },
    discount_usedCount: { type: Number, required: true },
    discount_minOrderValue: { type: Number, required: true },
    discount_shopID: { type: Types.ObjectId, ref: 'Shop' },
    discount_isActive: { type: Boolean, default: true },
    discount_applyTo: { type: String, required: true, enum: ['all', 'specific'] },
    discount_appliedProductIDs: { type: Array, default: [] }
    // discount_location
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);