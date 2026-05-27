const express = require('express');
const multer = require('multer');
const aiController = require('../controllers/aiController');

const router = express.Router();

const upload = multer({
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || 10485760) },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos'));
    }
  },
});

router.post('/generate-from-pdf',
  upload.single('file'),
  aiController.generateFromPdf
);

module.exports = router;
