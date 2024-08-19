'use strict';

const fs = require('fs');
const path = require('path');

const initProductType = () => {
    const ProductTypeMap = {}
    const modelFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.model.js'))

    modelFiles.forEach((file, index) => {
        const filePath = path.join(__dirname, file);
        const { productType, ModelType } = require(filePath);

        if (productType && ModelType) {
            ProductTypeMap[productType] = ModelType;
        }

    })

    console.log("ProductTypeMap: ");
    console.log(ProductTypeMap);

    return ProductTypeMap;
}

module.exports = {
    initProductType,
};