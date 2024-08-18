'use strict';
const jwt = require('jsonwebtoken');
const { aSyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');
const { findShopByID } = require('../services/shop.service');

const _HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        return { accessToken, refreshToken }
    } catch (error) {
        console.log("error signing token: " + error.message);
        return null;
    }
}

const verifyToken = (token, publicKey) => {
    try {
        return jwt.verify(token, publicKey, (err, decoded) => {
            if (err) throw err;

            console.log("### Decoded: ");
            console.log(decoded);
            return decoded;
        })
    } catch (error) {
        console.log("error verifying token: " + error.message);
        throw error;
    }
}


/* !!! AUTHENTICATION GUIDELINE !!!
1 - Check if user id is missing
2 - Get keyStore in DBs from user id
3 - Verify user's access token from request
4 - Check if user is existing in DBs
5 - Check keyStore with this user id
6 - Return next()
*/
const authentication = aSyncHandler(async (req, res, next) => {
    // Step 1
    const userID = req.headers[_HEADER.CLIENT_ID];
    if (!userID) throw new AuthFailureError('Invalid request!');

    // Step 2
    const keyStore = await KeyTokenService.findKeyTokenByUserID(userID);
    if (!keyStore) throw new NotFoundError('KeyStore not found!');

    // Step 3
    const accessToken = req.headers[_HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid request!');

    const decoded = verifyToken(accessToken, keyStore?.publicKey)
    if (!decoded || userID !== decoded?.userID) throw new AuthFailureError('Invalid user!')

    // Step 4
    const userInDB = await findShopByID(userID);
    if (!userInDB) throw new NotFoundError('User not found!')

    // Step 5
    // TODO: handle this

    // Step 6
    req.keyStore = keyStore;
    return next();

})
module.exports = {
    createTokenPair,
    authentication,
}