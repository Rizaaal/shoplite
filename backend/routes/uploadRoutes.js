const express = require('express');
const router = express.Router();

const cloudUpload = require('../middlewares/cloudUpload');
const { uploadToCloud } = require('../controllers/uploadController');

router.post('/image', cloudUpload.single('file'), uploadToCloud);

module.exports = router;
