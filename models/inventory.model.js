'use strict';

const mongoose = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'


// Declare the Schema of the Mongo model
const inventorySchema = new mongoose.Schema({
    inven_productID: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    inven_location: {
        type: String,
        default: 'Unknown'
    },
    inven_stock: {
        type: Number,
        required: true,
    },
    inven_shopID: {
        type: mongoose.Types.ObjectId,
        ref: 'Shop'
    },
    inven_reservations: {
        type: Array,
        default: [],
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);