'use strict';
const cartModel = require('../cart.model');
const Utils = require('../../utils/index');


const findCartByID = async (cartID) => {
    return await cartModel.findOne({
        _id: Utils.convertToObjectIdMongoose(cartID),
        cart_state: 'active'
    }).lean();
}





module.exports = {
    findCartByID,
}