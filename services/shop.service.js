'use strict';

const shopModel = require("../models/shop.model");
const _SELECT = {
    email: 1,
    password: 1,
    status: 1,
    name: 1,
    roles: 1,
}

const findShopByID = async (id, select = _SELECT) => {
    return await shopModel.findOne({ _id: id }).select(select).lean();
}

const findShopByEmail = async ({ email, select = _SELECT }) => {
    return await shopModel.findOne({ email }).select(select).lean();
}

module.exports = {
    findShopByID,
    findShopByEmail,
}