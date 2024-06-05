import { Router } from 'express';
import { login, verify } from '../handler/login.js';
import { register } from '../handler/register.js';
import { caloriesData } from '../handler/calculation.js';
import { getItems } from '../handler/dashboard.js';
import { addNewItem } from '../handler/items.js';


const router = Router();

// Login
router.post("/login", login);
router.get("/verify", verify);

// Sign Up
router.post("/register", register);

// Calculations
// router.post("/items", caloriesData);

// Get All Users data
// router.get("/dashboard", getItems);

router.post("/items", addNewItem)


export { router };