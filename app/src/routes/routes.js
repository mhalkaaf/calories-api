import { Router } from 'express';
import { login, verify } from '../handler/login.js';
import { register } from '../handler/register.js';
import { predict } from '../handler/predict.js';
import { upload } from '../middleware/upload.js';
import { gcsUpload } from '../handler/gcsbucket.js';
import { addNewItem, getNewItem, updateNewItem, deleteNewItem } from '../handler/items.js';


const router = Router();

// Login
router.post("/login", login);
router.get("/verify", verify);

// Sign Up
router.post("/register", register);

// Predict model
router.post("/predict", upload, predict);

// CRUD Operation Item

router.post("/items", addNewItem);

router.get("/items", getNewItem);

router.put("/items", updateNewItem);

router.delete("/items", deleteNewItem);

// Upload image to GCS for Profile
router.post("/upload", gcsUpload);


export { router };