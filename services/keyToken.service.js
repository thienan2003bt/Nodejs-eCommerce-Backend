'use strict';

const keytokenModel = require("../models/keytoken.model");
const { Types } = require('mongoose')

const _SELECT = {
    user: 1,
    publicKey: 1,
    refreshToken: 1,
    refreshTokenUsed: 1,
}

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

    static findKeyTokenByUserID = async (userID, select = _SELECT) => {
        const token = await keytokenModel.findOne({ user: new Types.ObjectId(userID) }).select(select).lean();
        return token;
    }

    static removeKeyTokenByID = async (id, select = _SELECT) => {
        return await keytokenModel.findByIdAndDelete(id).select(select).lean();
    }
}


module.exports = KeyTokenService;