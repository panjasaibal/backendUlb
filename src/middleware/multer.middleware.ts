import multer from "multer";
import path from 'path';


const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {

    cb(null, "./public/uploads"); // Destination folder for uploads
  },
  filename: function (_req , file, cb) {
   
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname); // Naming convention for the uploaded files
  }
});

const upload = multer({storage});

export { upload };
