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
        // const probabilities = predictions.arraySync();
        const probabilities = predictions.arraySync()[0];
        console.log(probabilities);

        // Determine the predicted fruit class
        const foodClasses = ['Apple', 'Banana', 'Fried_Chicken', 'Beef_Rendang', 'Egg', 'Doughnut'];
        const predictedClassIndex = probabilities.indexOf(Math.max(...probabilities));
        console.log(predictedClassIndex);
        const predictedFood = foodClasses[predictedClassIndex];

        // return predictedFruit;

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        // res.json({ predictions: probabilities });
        res.json({ predictedFood });
    } catch (err) {
        // console.error(err);
        // res.status(500).json({ error: 'Error processing the image' });
        console.error('Error classifying food:', err);
        res.status(500).json({ error: 'Error processing the image' });
    }
};

export { predict };