'use strict';

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const config = {
    region: 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY,
    }
}

const s3 = new S3Client(config);
module.exports = { 
    s3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
};