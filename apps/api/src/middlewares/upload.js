import multer from 'multer';
import { AppError } from '../errors/appError.js';

const storage = multer.memoryStorage();

const ALLOWED_MIMES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/zip',
  'application/x-zip-compressed',
  'application/vnd.rar',
  'application/x-rar-compressed',
  'application/x-rar',
  'image/vnd.adobe.photoshop',
  'application/postscript',
  'application/illustrator',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.zip', '.rar', '.ai', '.psd', '.eps'];

const fileFilter = (_req, file, cb) => {
  const ext = '.' + file.originalname.split('.').pop().toLowerCase();

  if (ALLOWED_MIMES.includes(file.mimetype) || ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Formato de archivo no aceptado. Formatos permitidos: PDF, PNG, JPG, ZIP, RAR, AI, PSD, EPS',
        400
      ),
      false
    );
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

export const uploadDesignFiles = uploadDesign.fields([
  { name: 'file', maxCount: 1 },
  { name: 'previews', maxCount: 5 },
]);

// Custom order delivery: the seller sends the final file. It is stored in a
// private bucket and only delivered to the buyer who paid, so we accept any
// format (still bounded by size) to avoid rejecting valid archives like .rar/.7z.
export const uploadAnySingle = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
}).single('file');
