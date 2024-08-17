'use strict';
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const shopModel = require('../models/shop.model')
const KeyTokenService = require('../services/keyToken.service');

const createTokenPair = require('../auth/auth.utils');
const { getIntoData } = require('../utils');

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
                    message: 'Shop already existed!',
                    status: 'failed'
                }
            }

            const hashedPassword = bcrypt.hashSync(password, 10)
            const newShop = await shopModel.create({
                name, email,
                password: hashedPassword,
                roles: [SHOP_ROLES.SHOP]
            })
            console.log("New shop created: ");
            console.log(newShop);
            if (newShop) {
                // after signing up successfully, redirecting to the home page with token
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
                    privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
                })

                const publicKeyString = await KeyTokenService.createKeyToken(
                    newShop._id,
                    publicKey
                )

                if (!publicKeyString) {
                    return {
                        code: 'xxxx',
                        message: 'public key string error'
                    }
                }

                const tokens = await createTokenPair({
                    userID: newShop._id,
                    email
                }, publicKeyString, privateKey);

                if (tokens) {
                    return {
                        code: 201,
                        metadata: {
                            shop: getIntoData(['_id', 'name', 'email'], newShop),
                            tokens
                        }
                    }
                }
            }

            return {
                code: 200,
                metadata: null
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