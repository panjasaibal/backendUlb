const multer = require("multer");
const path = require('path')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, "./public/uploads"); // Destination folder for uploads
  },
  filename: function (req, file, cb) {
   
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname); // Naming convention for the uploaded files
  }
});

const upload = multer({storage})

module.exports = upload
