'use strict';

const mongoose = require('mongoose'); // Erase if already required 
const { Schema } = require('mongoose');
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true,
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

// !!! CLOTHING SCHEMA !!!
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    },
    size: String,
    material: String,
}, {
    timestamps: true,
    collection: 'clothes'
})


// !!! ELECTRONIC SCHEMA !!!
const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        required: true,
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    },
    model: String,
    color: String,
}, {
    timestamps: true,
    collection: 'electronics'
})

//Export the model
module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model('Clothing', clothingSchema),
    electronic: mongoose.model('Electronic', electronicSchema),
};