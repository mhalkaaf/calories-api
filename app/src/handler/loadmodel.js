import * as tf from '@tensorflow/tfjs';


const loadModel = (async (req,res) =>{
  try{
      // Path ke model.json
      const modelPath = 'model/tfjs_models/model.json';

      // Memuat model menggunakan TensorFlow.js
      const model = await tf.loadLayersModel(modelPath);
      console.log('Model loaded successfully!');

      // Contoh membuat prediksi dengan model
      // Buat input tensor (misalnya array 2D dengan bentuk yang sesuai dengan input model Anda)
      const inputTensor = tf.tensor2d([[1, 2, 3, 4]]); // Sesuaikan dengan bentuk input model Anda

      // Lakukan prediksi
      const prediction = model.predict(inputTensor);

      // Cetak hasil prediksi
      prediction.print();
    }catch (error){
      console.error('Error loading model:', error);
    }
});

document.getElementById('loadModelButton').addEventListener('click', loadModel);

export { loadModel }