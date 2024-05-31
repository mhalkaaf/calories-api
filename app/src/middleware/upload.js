import multer from 'multer';

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

export { upload };