'use strict';

const { Types } = require('mongoose');
const { product, clothing, electronic, furniture } = require('../product.model');

// GET
const queryProduct = async (query, limit, skip) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllDraftsForShop = async (query, limit, skip) => {
    return await queryProduct(query, limit, skip)
}

const findAllPublishedProductsForShop = async (query, limit, skip) => {
    return await queryProduct(query, limit, skip)
}

const searchProductsByUser = async (keySearch) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product.find(
        { is_published: true, $text: { $search: regexSearch } },
        { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).lean();

    return results;
}



// POST
const publishProductByShop = async (product_shop, product_id) => {
    const existingShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    })

    if (!existingShop) {
        return null;
    }

    const updatedProduct = await product.findOneAndUpdate(
        { _id: new Types.ObjectId(product_id) },
        { is_draft: false, is_published: true },
        { new: true }
    )
    return {
        modifiedCount: 1,
        data: updatedProduct
    };
}

const unPublishProductByShop = async (product_shop, product_id) => {
    const existingShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
        is_published: true,
    })

    if (!existingShop) {
        return null;
    }

    const updatedProduct = await product.findOneAndUpdate(
        { _id: new Types.ObjectId(product_id) },
        { is_draft: true, is_published: false },
        { new: true }
    )
    return {
        modifiedCount: 1,
        data: updatedProduct
    };
}


module.exports = {
    findAllDraftsForShop,
    findAllPublishedProductsForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductsByUser,
}