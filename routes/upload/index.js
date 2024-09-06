'use strict';

const router = require('express').Router();
const UploadController = require('../../controllers/upload.controller');
const { aSyncHandler } = require('../../helpers/asyncHandler');
const { uploadDisk } = require('../../configs/config.multer')

router.post('/product', aSyncHandler(UploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file'), aSyncHandler(UploadController.uploadFileThumb))

module.exports = router;