import * as tf from '@tensorflow/tfjs-node';
import "dotenv/config.js";

let model;

const loadModel = async () => {
    if (!model) {
        model = await tf.loadLayersModel(process.env.MODEL_URL);
        console.log('Model loaded');
    }
    return model;
};

export { loadModel };