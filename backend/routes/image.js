const express = require('express');
const fileupload = require('../controllers/fileUpload');
const multerFile = require('../utils/multerFile');

const router = express.Router();

router.post('/upload',multerFile, fileupload );

module.exports = router;