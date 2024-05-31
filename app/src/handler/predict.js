import * as tf from '@tensorflow/tfjs-node';
import * as path from 'path';
import fs from 'fs';
import { loadModel } from '../middleware/loadModel.js';

const predict = async (req, res) => {
    // Check if the file uploaded exists
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Load the model
        const model = await loadModel();

        // Load the uploaded image
        const filePath = path.resolve(req.file.path);
        const imageBuffer = fs.readFileSync(filePath);
        const imageTensor = tf.node.decodeImage(imageBuffer);

        // Preprocess the image to fit the model input requirements
        const resizedImage = tf.image.resizeBilinear(imageTensor, [128, 128]); // Example resize
        const inputTensor = resizedImage.expandDims(0); // Example normalization

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
};

export { predict };