import multer from "multer";
import path from "path";
import * as storage from '@google-cloud/storage';


// Initialize Google Cloud Storage
const gcsClient = new storage.Storage({
  keyFilename: path.join(__dirname, 'path-to-your-service-account-file.json'),
  projectId: 'haeckal-bangkit2024'
});
const bucket = gcsClient.bucket('client-profile');

// Multer configuration
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const gcsUpload = (upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No file uploaded' });
      }
    
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: req.file.mimetype
        }
    });

    blobStream.on('error', (err) => {
        console.error('Blob stream error:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    });

    blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).json({ status: 'success', url: publicUrl });
    });

    blobStream.end(req.file.buffer);

});


export { gcsUpload }