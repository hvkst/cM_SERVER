const router = require('express').Router();
const User = require('../models/User.model');
const Image = require('../models/Project/FileUpload/Image.model');

// // ********* require fileUploader in order to use it *********
// const fileUploader = require('../config/cloudinary.config');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'userUploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/images', upload.array('images', 12), function (req, res) {
  console.log(req.body);

  res.json({});
});

module.exports = router;
