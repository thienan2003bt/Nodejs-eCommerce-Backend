'use strict';

const { Types } = require('mongoose');
const { product, clothing, electronic, furniture } = require('../product.model');
const { getSelectedData, refuseSelectedData } = require('../../utils');

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

const findAllProducts = async (limit, sort, page, filter, select) => {
    const skip = (+page - 1) * +limit;
    const sortBy = (sort === 'ctime') ? { _id: -1 } : { _id: 1 };
    const newSelect = getSelectedData(select);

    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(newSelect)
        .lean();

    return products;
}

const findProduct = async (product_id, unSelect) => {
    return await product.findById(product_id).select(refuseSelectedData(unSelect));
}

const getProductByID = async (productID) => {
    return await product.findById(productID).lean();
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


// PATCH
const updateProductByID = async (product_id, payload, model, isNew = true) => {
    return await model?.findByIdAndUpdate(product_id, payload, { new: isNew })
}

const checkProductByServer = async (products) => {
    const result = await Promise.all(
        products.map(async (product) => {
            const existingProduct = await getProductByID(product?.productID);
            if (existingProduct) {
                return {
                    price: existingProduct?.product_price,
                    productID: existingProduct?._id,
                }
            }
        }
        ));
    return result;
}


module.exports = {
    findAllDraftsForShop,
    findAllPublishedProductsForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProduct,
    updateProductByID,
    getProductByID,
    checkProductByServer,
}