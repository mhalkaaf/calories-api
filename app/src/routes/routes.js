import { Router } from 'express';
import { login, verify } from '../handler/login.js';
import { register } from '../handler/register.js';
// import { loadModel } from '../handler/loadmodel.js';
import { predict } from '../handler/predict.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Login
router.post("/login", login);
router.get("/verify", verify);

// Sign Up
router.post("/register", register);

// Load model
// router.post("/load", loadModel);

// Predict model
router.post("/predict", upload.single('file'), predict);

export { router };