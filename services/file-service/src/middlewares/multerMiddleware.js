import multer, { memoryStorage } from 'multer';

const storage = memoryStorage();

// Restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf', // PDF
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'image/png', // PNG
    'image/jpeg', // JPEG
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // File is allowed
  } else {
    cb(new Error('Only PDF, Word, PNG, and JPEG files are allowed.'), false);  // Reject file
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10 MB in bytes
});

export default upload;
