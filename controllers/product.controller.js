'use strict';
const { ProductFactory } = require('../services/product.service');
const { OKSuccessResponse } = require('../core/success.response')

class ProductController {
    static createProduct = async (req, res, next) => {
        const data = await ProductFactory.createProduct(req.body?.product_type ?? '', {
            ...req.body,
            product_shop: req.user?.userID,
        });
        return new OKSuccessResponse({
            message: 'Product created successfully!',
            code: 201,
            metadata: { data }
        }).send(res);
    }

    static publishProduct = async (req, res, next) => {
        const data = await ProductFactory.publishProductByShop({
            product_shop: req.user?.userID,
            product_id: req.params?.id,
        })

        return new OKSuccessResponse({
            message: 'Publish product for shop successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }

    static unPublishProduct = async (req, res, next) => {
        const data = await ProductFactory.unPublishProductByShop({
            product_shop: req.user?.userID,
            product_id: req.params?.id,
        })

        return new OKSuccessResponse({
            message: 'Unpublish product for shop successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }

    // GET
    static getAllDraftsForShop = async (req, res, next) => {
        const data = await ProductFactory.findAllDraftsForShop({
            product_shop: req.user?.userID
        })

        return new OKSuccessResponse({
            message: 'Get list of drafts for shop successfully!',
            code: 200,
            metadata: { drafts: data }
        }).send(res);
    }

    static getAllPublishedProductsForShop = async (req, res, next) => {
        const data = await ProductFactory.findAllPublishedProductsForShop({
            product_shop: req.user?.userID
        })

        return new OKSuccessResponse({
            message: 'Get list of published products for shop successfully!',
            code: 200,
            metadata: { drafts: data }
        }).send(res);
    }


    static searchProductsByUser = async (req, res, next) => {
        const data = await ProductFactory.searchProductsByUser({
            keySearch: req.params?.keySearch
        })

        return new OKSuccessResponse({
            message: 'Search products for user successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }

    static findAllProducts = async (req, res, next) => {
        const data = await ProductFactory.findAllProducts(req.query);

        return new OKSuccessResponse({
            message: 'Find all products successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }

    static findProduct = async (req, res, next) => {
        const data = await ProductFactory.findProduct({
            product_id: req.params?.id
        });

        return new OKSuccessResponse({
            message: 'Find all products successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }


    // PATCH
    static updateProduct = async (req, res, next) => {
        const data = await ProductFactory.updateProduct({
            type: req.body?.product_type,
            product_id: req.params?.id,
            payload: req.body
            // product_shop: req.user?.userID,
        });

        return new OKSuccessResponse({
            message: 'Update product successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }
}

module.exports = ProductController;