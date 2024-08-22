'use strict';
const redis = require('redis')
const { promisify } = require('util')
const redisClient = redis.createClient();

const InventoryRepository = require('../models/repositories/inventory.repo');

const pExpire = promisify(redisClient.pExpire).bind(redisClient)
const setNXAsync = promisify(redisClient.setNX).bind(redisClient)


class RedisService {
    // Optimistic key
    static async acquireLock({ productID, quantity, cartID }) {
        const key = `lock_v2024_${productID}`;
        const retryTimes = 10;
        const expireTime = 3000; // 3 seconds

        for (let index = 0; index < retryTimes; index++) {
            const result = await setNXAsync(key, expireTime)
            if (result === 1) {
                const isReserved = await InventoryRepository.reservationInventory({ productID, cartID, quantity })
                if (isReserved.modifiedCount) {
                    await pExpire(key, expireTime)
                    return key;
                }
                return null;
            } else {
                await new Promise((resolve) => setTimeout(resolve, 50))
            }
        }
    }

    static async releaseLock(keyLock) {
        const deAsyncKey = promisify(redisClient.del).bind(redisClient);
        return await deAsyncKey(keyLock)
    }
}


module.exports = RedisService;