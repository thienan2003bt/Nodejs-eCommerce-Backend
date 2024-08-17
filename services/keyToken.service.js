'use strict';

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async (userID, publicKey) => {
        try {
            const publicKeyString = publicKey.toString();
            const tokens = await keytokenModel.create({
                user: userID,
                publicKey: publicKeyString
            })

            return tokens ? publicKeyString : null;
        } catch (error) {
            return error;
        }
    }

    static createKeyTokenHighLevel = async (userID, publicKey, privateKey, refreshToken) => {
        try {
            const filter = { user: userID };
            const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken }
            const options = { upsert: true, new: true };

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens?.publicKey ?? null;
        } catch (error) {
            return error;

        }
    }
}


module.exports = KeyTokenService;