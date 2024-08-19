'use strict';
const ProductService = require('../services/product.service');
const { OKSuccessResponse } = require('../core/success.response')

class ProductController {
    static createProduct = async (req, res, next) => {
        const data = await ProductService.createProduct(req.body?.product_type ?? '', req.body);
        return new OKSuccessResponse({
            message: 'Product created successfully!',
            code: 201,
            metadata: { data }
        }).send(res);
    }


}

module.exports = ProductController;