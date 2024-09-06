'use strict';
const cloudinary = require('../configs/config.cloudinary');

class UploadService {
    static async uploadImageFromURL() {
        const urlImg = 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwtsm9gayac924';
        const folderName = 'product/shopID';
        const newFilename = 'testDemo';

        const result = await cloudinary.uploader.upload(urlImg, {
            public_id: newFilename,
            folder: folderName
        })

        return result;
    }

    static async uploadImageFromLocal(filepath, folderName = 'product/8049') {
        const result = await cloudinary.uploader.upload(filepath, {
            public_id: 'thumb',
            folder: folderName
        })

        const thumb = cloudinary.url(result.public_id, {
            height: 100, width: 100, format: 'jpg'
        });

        return {
            img_url: result.secure_url,
            shopID: 8049,
            thumb_url: thumb
        };
    }
}


module.exports = UploadService;