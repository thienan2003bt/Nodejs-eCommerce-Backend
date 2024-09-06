'use strict';

const multer = require('multer');
const uploadMemory = multer({
    storage: multer.memoryStorage()
})

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, './uploads/')
        },
        filename: (req, file, callback) => {
            const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            callback(null, uniquePrefix + '-' + (file?.originalname ?? ''));
        }
    })
})

module.exports = {
    uploadDisk,
    uploadMemory,
}