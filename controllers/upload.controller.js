'use strict';
const { OKSuccessResponse } = require('../core/success.response');
const { BadRequestError } = require('../core/error.response')
const UploadService = require('../services/upload.service');

class UploadController {
    async uploadFile(req, res, next) {
        const data = await UploadService.uploadImageFromURL()
        return new OKSuccessResponse({
            message: 'New file uploaded successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }

    async uploadFileThumb(req, res, next) {
        const { file } = req;
        if (!file || !file.path) throw new BadRequestError('File required!')
        const data = await UploadService.uploadImageFromLocal(file.path)
        return new OKSuccessResponse({
            message: 'New file uploaded successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }

    async uploadMultiFilesThumb(req, res, next) {
        const { files } = req;
        if (!files || !files.length) throw new BadRequestError('File required!')
        const data = await UploadService.uploadMultiImagesFromLocal(files)
        return new OKSuccessResponse({
            message: 'New files uploaded successfully!',
            code: 200,
            metadata: { data }
        }).send(res);
    }

    // S3
    async uploadFileThumbS3(req, res, next) {
        const { file } = req;
        if (!file) throw new BadRequestError('File required!')
        const data = await UploadService.uploadImageFromLocalToS3(file)
        return new OKSuccessResponse({
            message: 'New file uploaded to S3 successfully!',
            code: 200,
            metadata: data?.$metadata ?? data,
        }).send(res);
    }
}

module.exports = new UploadController();