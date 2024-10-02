'use strict';
const crypto = require("crypto");
const Utils = require("../utils/index");

require("dotenv").config();
const cloudinary = require('../configs/config.cloudinary');

const { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("../configs/config.s3");
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer')


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

    static async uploadMultiImagesFromLocal(files, folderName = 'product/8049') {
        if (!files.length) return;
        const uploads = [];

        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName
            })
            const thumb = cloudinary.url(result.public_id, {
                height: 100, width: 100, format: 'jpg'
            });
            uploads.push({
                img_url: result.secure_url,
                shopID: 8049,
                thumb_url: thumb
            });
        }

        return uploads;
    }


    // S3
    static async uploadImageFromLocalToS3(file) {
        const uploadedFileName = Utils.generateRandomName();
        const putFileCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uploadedFileName,
            Body: file.buffer,
            ContentType: 'image/jpeg',
        });

        // const signedUrlCommand = new GetObjectCommand({
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: uploadedFileName,
        // });
        // const url = await getSignedUrl(s3, signedUrlCommand, { expiresIn: 3600 });

        const url = getSignedUrl({
            url: `${process.env.AWS_URL_IMAGE_PUBLIC}/${uploadedFileName}`,
            dateLessThan: new Date(Date.now() + 3600 * 60),
            keyPairId: process.env.AWS_PUBLIC_KEY_ID,
            privateKey: process.env.AWS_BUCKET_PRIVATE_KEY_ID
        });

        const result = await s3.send(putFileCommand);
        return {
            result: { ...result?.$metadata },
            url: url,
        };
    }
}


module.exports = UploadService;