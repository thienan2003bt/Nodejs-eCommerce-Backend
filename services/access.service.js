'use strict';
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require('../models/shop.model')
const SHOP_ROLES = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}


class AccessService {
    static signUp = async (data) => {
        const { name, email, password } = data;
        try {
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: error.message,
                    status: 'Shop already exists!'
                }
            }

            const hashedPassword = bcrypt.hashSync(password, 10)
            const newShop = await shopModel.create({
                name, email,
                password: hashedPassword,
                roles: [SHOP_ROLES.SHOP]
            })

            if (newShop) {
                // after signing up successfully, redirecting to the home page with token
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulesLength: 4096
                })


            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;