import { Router } from 'express';
import { login, verify } from '../handler/login.js';
import { register } from '../handler/register.js';
import { caloriesData } from '../handler/calculation.js';
// import { dashboard } from '../handler/dashboard.js';

const router = Router();

// Login
router.post("/login", login);
router.get("/verify", verify);

// Sign Up
router.post("/register", register);

// Calculations
router.post("/calculate", caloriesData);

// Get All Users data
// router.get("/dashboard", dashboard);

export { router };