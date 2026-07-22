const multer = require('multer');

const storage = multer.memoryStorage();

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const PDF_MIME_TYPE = 'application/pdf';

function fileFilterFor(allowedTypes, description) {
  return (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error(`Unsupported file type. Please upload ${description}.`));
    }
    cb(null, true);
  };
}

// Runs the multer middleware and converts its errors (bad file type, file too
// large) into the app's standard { success, data, message } 400 response
// instead of letting them fall through to the generic 500 error handler.
function handleUpload(multerMiddleware) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, data: null, message: err.message || 'File upload failed.' });
      }
      next();
    });
  };
}

const uploadImage = handleUpload(
  multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilterFor(IMAGE_MIME_TYPES, 'an image (JPEG, PNG, WEBP, or GIF)'),
  }).single('photo')
);

const uploadPdf = handleUpload(
  multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilterFor([PDF_MIME_TYPE], 'a PDF file'),
  }).single('file')
);

module.exports = { uploadImage, uploadPdf };
