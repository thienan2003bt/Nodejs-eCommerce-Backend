'use strict';
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const shopModel = require('../models/shop.model')
const KeyTokenService = require('../services/keyToken.service');

const { createTokenPair, verifyToken } = require('../auth/auth.utils');
const { getIntoData } = require('../utils');
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findShopByEmail } = require('./shop.service');

const SHOP_ROLES = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}


class AccessService {
    /* !!! LOGIN GUIDELINE !!!
    1 - Check if email is existing in DBs
    2 - Check if password is matched
    3 - Create Access Token, Refresh Token and save it
    4 - Generate tokens
    5 - Get data and return
     */
    static login = async ({ email, password, refreshToken = null }) => {
        // Step 1
        const existingShop = await findShopByEmail({ email })
        if (!existingShop) {
            throw new BadRequestError('Shop is not registered!')
        }

        // Step 2
        const isPasswordMatched = bcrypt.compare(password, existingShop?.password ?? '')
        if (!isPasswordMatched) {
            throw new AuthFailureError('Authentication failed!')
        }

        // Step 3
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
        })

        const userID = existingShop._id;
        const tokens = await createTokenPair({
            userID, email,
        }, publicKey, privateKey);

        await KeyTokenService.createKeyTokenHighLevel(
            userID, publicKey, privateKey, tokens?.refreshToken ?? '',
        )

        return {
            shop: getIntoData(['_id', 'name', 'email'], existingShop),
            tokens
        }
    }

    static logout = async (keyStore) => {
        const deletedKeys = KeyTokenService.removeKeyTokenByID(keyStore?._id, {
            _id: 1, user: 1,
        });
        return deletedKeys;
    }

    static signUp = async (data) => {
        const { name, email, password } = data;
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered!')
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
                throw new BadRequestError('Error: Public key string');
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
    }

    /* !!! HANDLE USER REFRESH TOKEN GUIDELINE !!!
    1 - Check if refresh token is used
    2 - Decode the existing refresh token if any
    3 - Delete all tokens related to the refresh token in DBs
    4 - Check if holder refresh token (currently used refresh token) is existing
    5 - Verify the holder refresh token and check if user decoded from it is existing
    6 - Update key token with new access token
    7 - Return the new access token with user info after all
    */
    static handleRefreshToken = async (refreshToken) => {
        // Step 1
        const existingToken = await KeyTokenService.findKeyTokenByRefreshTokenUsed(refreshToken);

        // Step 2
        if (existingToken) {
            console.log("existingToken: ");
            console.log(existingToken);
            const { userID, email } = verifyToken(refreshToken, existingToken?.publicKey ?? '');

            // Step 3
            await KeyTokenService.deleteKeyByUserID(userID)
            throw new ForbiddenError('Something went wrong, please login again!')
        }

        // Step 4
        console.log("Find holder token ...");
        const holderToken = await KeyTokenService.findKeyTokenByRefreshToken(refreshToken);
        if (!holderToken) throw new AuthFailureError('Shop is not registered')

        // Step 5
        console.log("Verify holder token ...");
        const { userID, email } = verifyToken(refreshToken, holderToken?.publicKey ?? '');
        const existingShop = await findShopByEmail({ email })
        if (!existingShop) throw new AuthFailureError('Shop is not registered')

        // Step 6
        const tokens = await createTokenPair({ userID, email }, holderToken?.publicKey, holderToken?.privateKey ?? '');

        await KeyTokenService.updateRefreshToken(holderToken?._id, tokens, refreshToken);

        // Step 7
        return {
            user: { userID, email },
            tokens
        }
    }

    /* !!! HANDLE USER REFRESH TOKEN V2 GUIDELINE !!!
    1 - Check if refresh token is used
    2 - Decode the existing refresh token if any
    3 - Delete all tokens related to the refresh token in DBs
    4 - Check if holder refresh token (currently used refresh token) is existing
    5 - Verify the holder refresh token and check if user decoded from it is existing
    6 - Update key token with new access token
    7 - Return the new access token with user info after all
    */
    static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
        const { userID, email } = user;
        if (keyStore?.refreshTokensUsed?.includes(refreshToken)) {
            await KeyTokenService.deleteKeyByUserID(userID)
            throw new ForbiddenError('Something went wrong, please login again!')
        }

        if (keyStore?.refreshToken !== refreshToken) {
            throw new AuthFailureError('Shop is not registered')
        }

        const existingShop = await findShopByEmail({ email })
        if (!existingShop) throw new AuthFailureError('Shop is not registered')

        // Step 6
        const tokens = await createTokenPair({ userID, email }, keyStore?.publicKey, keyStore?.privateKey ?? '');
        await KeyTokenService.updateRefreshToken(keyStore?._id, tokens, refreshToken);

        // Step 7
        return {
            user,
            tokens
        }
    }
}

module.exports = AccessService;