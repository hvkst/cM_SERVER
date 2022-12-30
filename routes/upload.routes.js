const router = require('express').Router();
const User = require('../models/User.model');
const Image = require('../models/Project/FileUpload/Image.model');

// // ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');

router.post('/images', function (req, res) {});

module.exports = router;
