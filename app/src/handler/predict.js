import * as tf from '@tensorflow/tfjs-node';
import * as path from 'path';
import multer from "multer";
import fs from 'fs';
import exp from 'constants';

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Load TensorFlow.js model
let model;
const loadModel = async () => {
    model = await tf.loadLayersModel('file://../../../models/tfjs_models/model.json');
    console.log('Model loaded');
};

loadModel();

const predict = (upload.single('file'), async (req, res) => {
    // Check if the file uploaded exist
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Load the uploaded image
        const filePath = path.join(__dirname, req.file.path);
        const imageBuffer = fs.readFileSync(filePath);
        const imageTensor = tf.node.decodeImage(imageBuffer);

        // Preprocess the image to fit the model input requirements
        const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]); // Example resize
        const inputTensor = resizedImage.expandDims(0).div(255.0); // Example normalization

        // Make prediction
        const predictions = model.predict(inputTensor);
        const result = predictions.arraySync();

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        res.json({ predictions: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error processing the image' });
    }
});


export { predict }