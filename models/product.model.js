'use strict';

const mongoose = require('mongoose'); // Erase if already required 
const { Schema } = require('mongoose');
const slugify = require('slugify');

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
    product_slug: {
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
    product_rating_average: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be equal or above 1.0'],
        max: [5, 'Rating must be equal or below 5.0'],
        set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
        type: Array,
        default: []
    },
    is_draft: {
        type: Boolean,
        default: true,
        index: true,
        select: false,
    },
    is_published: {
        type: Boolean,
        default: false,
        index: true,
        select: false,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

// Indexes
productSchema.index({ product_name: 'text', product_description: 'text' })

// Document middleware: run before .save(), .create(), ...
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this?.product_name ?? '', { lower: true })
    next();
})


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

// !!! FURNITURE SCHEMA !!!
const furnitureSchema = new Schema({
    manufacturer: {
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
    collection: 'Furniture'
})

//Export the model
module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model('Clothing', clothingSchema),
    electronic: mongoose.model('Electronic', electronicSchema),
    furniture: mongoose.model('Furniture', furnitureSchema),
};