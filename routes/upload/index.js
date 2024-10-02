'use strict';

const router = require('express').Router();
const UploadController = require('../../controllers/upload.controller');
const { aSyncHandler } = require('../../helpers/asyncHandler');
const { uploadDisk, uploadMemory } = require('../../configs/config.multer')

// Cloudinary
router.post('/product', aSyncHandler(UploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file'), aSyncHandler(UploadController.uploadFileThumb))
router.post('/product/multiple', uploadDisk.array('files', 3), aSyncHandler(UploadController.uploadMultiFilesThumb))

// S3
router.post('/product/bucket', uploadMemory.single('file'), aSyncHandler(UploadController.uploadFileThumbS3))


module.exports = router;