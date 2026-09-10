import multer from 'multer';
import { AppError } from '../../errors/appError.js';

const storage = multer.memoryStorage();

const ALLOWED_MIMES = [
  'application/pdf',
  'image/png',
  'application/zip',
  'application/x-zip-compressed',
  'image/vnd.adobe.photoshop',
  'application/postscript',
  'application/illustrator',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.zip', '.ai', '.psd', '.eps'];

const fileFilter = (_req, file, cb) => {
  const ext = '.' + file.originalname.split('.').pop().toLowerCase();

  if (ALLOWED_MIMES.includes(file.mimetype) || ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new AppError('Formato de archivo no aceptado. Formatos permitidos: PDF, PNG, ZIP, AI, PSD, EPS', 400), false);
  }
};

export const uploadDesign = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

export const uploadSingle = uploadDesign.single('file');
