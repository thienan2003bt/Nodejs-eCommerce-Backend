'use strict'
const mongoose = require('mongoose');
const { countConnect, checkOverloadedConnect } = require('../helpers/check.connect')

const connectString = `mongodb://localhost:27017/shopDEV`
const MAX_POOL_SIZE = 50

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if (type === 'mongodb') {
            if (1 === 1) {
                //TODO: Only show DB logs for development environments
                mongoose.set('debug', true);
                mongoose.set('debug', { color: true });
            }

            mongoose.connect(connectString, { maxPoolSize: MAX_POOL_SIZE })
                .then(_ => {
                    console.log("Connect to MongoDB successfully");
                    countConnect();
                    checkOverloadedConnect();
                }).catch(err => console.log("Error connecting to MongoDB: " + err))
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;