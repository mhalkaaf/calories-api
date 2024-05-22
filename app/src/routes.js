import * as handler from './handler.js';
import * as loginHandler from './login.js';
import * as signUpHandler from './signup.js'

import { Router } from 'express';

const router = Router();

router.post("/", handler.addUser);
router.put("/:id", handler.updateUser)
router.delete("/:id", handler.deleteUser);

// Login
router.get("/login", loginHandler.getUser);
router.get("/login/:id", loginHandler.getUserById);

// Sign Up
router.post("/api/signup",signUpHandler.addUser);

export { router };