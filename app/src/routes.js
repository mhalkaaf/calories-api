import * as handler from './handler.js';
import * as signUpHandler from './signup.js';

import { Router } from 'express';

const router = Router();

router.get("/", handler.getUser);
router.post("/", handler.addUser);
router.get("/:id", handler.getUserById);
router.put("/:id", handler.updateUser)
router.delete("/:id", handler.deleteUser);

router.post("/api/signup",signUpHandler.addUser);

export { router };