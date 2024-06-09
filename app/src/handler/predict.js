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
        // const imageTensor = tf.node.decodeImage(imageBuffer);
        let imageTensor = tf.node.decodeImage(imageBuffer, 3); // Decode image as RGB

        // Preprocess the image to fit the model input requirements
        const resizedImage = tf.image.resizeBilinear(imageTensor, [128, 128]); // Example resize
        const normalizedImage = resizedImage.div(255.0); // Normalize pixel values
        const inputTensor = normalizedImage.expandDims(0); // Add batch dimension

        // Make prediction
        const predictions = model.predict(inputTensor);

        // const probabilities = predictions.arraySync();
        const probabilities = predictions.arraySync()[0];
        predictions.dispose(); // Dispose of the prediction tensor to free up resources
        console.log('Probabilities:', probabilities);

        // Determine the predicted fruit class
        const foodClasses = ['Apple', 'Banana', 'Beef_Rendang', 'Doughnut', 'Egg', 'Fried_Chicken'];
        const predictedClassIndex = probabilities.indexOf(Math.max(...probabilities));
        console.log(predictedClassIndex);
        const predictedFood = foodClasses[predictedClassIndex];
        console.log('Predicted food:', predictedFood);

        let label, information;

        if (predictedFood == "Apple") {
            label = "Apel";
            information = "Apel mempunyai kandungan 52 kalori per 100 gram."
        } else if (predictedFood == "Banana") {
            label = "Pisang";
            information = "Pisang mempunyai kandungan 89 kalori per 100 gram."
        } else if (predictedFood == "Beef_Rendang") {
            label = "Rendang";
            information = "Rendang mempunyai kandungan 193 kalori per 100 gram."
        } else if (predictedFood == "Doughnut") {
            label = "Donat";
            information = "Donat mempunyai kandungan 421 kalori per 100 gram."
        } else if (predictedFood == "Egg") {
            label = "Telur";
            information = "Telur mempunyai kandungan 155 kalori per 100 gram."
        } else if (predictedFood == "Fried_Chicken") {
            label = "Ayam Goreng";
            information = "Ayam Goreng mempunyai kandungan 260 kalori per 100 gram."
        } else {
            label = "Tidak Sesuai";
            information = "Mohon maaf, makanan yang anda input belum ada di database kami. Silahkan input makanan yang lain"
        }

        // return predictedFruit;

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        // res.json({ predictions: probabilities });
        // res.json({ predictedFood });
        res.status(200).json({ label: label, information: information });
    } catch (err) {
        // console.error(err);
        // res.status(500).json({ error: 'Error processing the image' });
        console.error('Error classifying food:', err);
        res.status(500).json({ status: 'error', message: 'Error processing the image' });
    }
};

export { predict };