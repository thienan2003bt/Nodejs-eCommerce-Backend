'use strict';
const jwt = require('jsonwebtoken');

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
        jwt.verify(token, publicKey, (err, decoded) => {
            if (err) throw err;
            return decoded;
        })
    } catch (error) {
        console.log("error verifying token: " + error.message);
        return null;
    }
}
module.exports = createTokenPair