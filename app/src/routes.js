import * as handler from './handler.js';
import * as loginHandler from './login.js';

import { Router } from 'express';

const router = Router();

router.post("/", handler.addUser);
router.put("/:id", handler.updateUser)
router.delete("/:id", handler.deleteUser);

// Login
router.get("/login", loginHandler.getUser);
router.get("/login/:id", loginHandler.getUserById);


export { router };