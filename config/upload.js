const multer = require('multer');

let upload = multer({ dest: 'public/uploads/' });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const extend = file.originalname.split('.')[1];
    cb(null, `${file.fieldname}-${Date.now()}.${extend}`);
  },
});

upload = multer({ storage });

module.exports = upload;
