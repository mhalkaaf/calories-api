import { Router } from 'express';
import { login, verify } from '../handler/login.js';
import { register } from '../handler/register.js';
import { loadModel } from '../handler/loadmodel.js';

const router = Router();

// Login
router.post("/login", login);
router.get("/verify", verify);

// Sign Up
router.post("/register", register);

// Load model
router.post("/load", loadModel);

export { router };